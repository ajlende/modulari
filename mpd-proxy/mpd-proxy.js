/* jslint node: true */
'use strict';

var _ = require('lodash');
var net = require('net');
var http = require('http');
var WebSocketServer = require('websocket').server;

function mpdProxy(options) {
  var seneca = this;

  var MPD = require('./mpd.js');

  var ws = seneca.make('proxy/ws');

  ws.list$(function(err, list) {
    if (err) console.error(err);
    console.log(list);
    if (list.length === 0) {
      ws.httpServer = {};
      ws.wsServer = {};
      ws.clients = {};
      ws.clientCount = 0;
      ws.serverActive = false;
      ws.save$(function(err, ws) {
        if (err) console.error(err);
        console.log(ws);
      });
    }
  });

  var mpdConnections = seneca.make('proxy/mpdConnections');
  mpdConnections.list$({}, function(err, list) {
    _.forEach(list, function(connection) {
      console.log(connection);
    });
  });

  seneca.add('role:api,cmd:destroy', destroyConnection);
  seneca.add('role:api,cmd:create', createConnection);
  seneca.add('role:api,cmd:test', test);

  function test(args, done) {
    done(null, {
      log: 'test'
    });
  }

  function destroyConnection(args, done) {
    var cid = args.connectionId;
    var deleted = mpdConnections.connections[cid];
    delete mpdConnections.connections[cid];

    console.log((new Date()) + ' MPD destroyed [' + cid + ']');

    done(null, deleted);
  }

  // POST make a new connection
  function createConnection(args, done) {
    var mpdHost = args.host;
    var mpdPort = args.port;
    var mpdPass = args.pass;

    ws.list$(function(err, list) {
      _.forEach(list, function(websocket) {
        //Check if websocket server is set up.
        if (!websocket.serverActive) {
          setupWS(8007);
        }
      });
    });

    // create a new mpd connection if the connection id doesn't exist
    mpdConnections.list$({
      host: mpdHost,
      port: mpdPort
    }, function(err, list) {
      if (list.length === 0) {
        mpdConnections.data$({
          mpd: new MPD(mpdHost, mpdPort, mpdPass)
        }).save$();
        console.log((new Date()) + ' MPD created [' + mpdHost + ':' + mpdPort + ']');
      } else {
        console.warn((new Date()) + ' MPD exists [' + mpdHost + ':' + mpdPort + ']');
      }
    });

    return done(null, {
      msg: 'done'
    });
  }

  /**
   * @desc Sets up the websocket side of the connection
   *
   * @param {number} [port=8007] - The port the websocket runs on
   */
  function setupWS(port) {

    port = port || 8007;

    var ws = seneca.make('ws');
    ws.list$({}, function(err, list) {
      _.forEach(list, function(websocket) {
        console.log('ALLTHEWEBSOCKETS');
        console.log(websocket);

        websocket.httpServer = http.createServer(function(request, response) {});

        websocket.httpServer.listen(port, function() {
          websocket.serverActive = true;
          console.log((new Date()) + ' Server is listening on port ' + port);
        });

        websocket.wsServer = new WebSocketServer({
          httpServer: websocket.httpServer
        });

        websocket.wsServer.on('request', function(r) {

          var connection = r.accept('echo-protocol', r.origin);

          // Specific id for this client & increment count
          var id = websocket.clientCount++;

          console.log((new Date()) + ' Connection accepted [' + id + ']');

          connection.on('connectFailed', function(error) {
            console.log('Connect Error: ' + error.toString());
          });

          connection.on('message', function(message) {

            // The string message that was sent to us
            // Parse msgString for the MPD to connect to.
            var messageJSON = JSON.parse(message.utf8Data);
            var msgString = messageJSON.mpdCommand;
            var selectedMPD = messageJSON.mpdHost;

            var mpd = mpdConnections[selectedMPD];

            // Reconnect if necessary
            if (!mpd.isConnected) {
              mpd.setupMPD(mpd.host, mpd.port, mpd.pass);
            }

            // Reauthenticate if necessary
            if (!mpd.isAuthenticated && mpd.pass !== '') {
              mpd.netConnection.write('password ' + mpd.pass + '\n');
              // TODO: Check to see if authentication was successful and set
              // isAuthenticated to true. For now, enter password every time.
            }

            console.log((new Date()) + ' Sending MPD [' + selectedMPD + '] ' + msgString);

            // Send the command to MPD
            mpd.netConnection.write(msgString + '\n');

          });

          connection.on('close', function(reasonCode, description) {
            delete websocket.clients[id];
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected [' + id + ']');
            websocket.serverActive = false;
          });

          // Store the connection method so we can loop through & contact all clients
          websocket.clients[id] = connection;

        });

      });
    });

  }

}
module.exports = mpdProxy;
