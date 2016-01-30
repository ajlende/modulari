/* jslint node: true */
'use strict';

var _ = require('lodash');

var net = require('net');
var http = require('http');
var WebSocketServer = require('websocket').server;

var seneca = require('seneca');

/**
 * @desc Creates a new MPD Object
 *
 * @param {string} mpdHost - The MPD host
 * @param {number} mpdPort - The MPD port
 * @param {string} [mpdPass] - The optional MPD password
 * @class
 */
function MPD(mpdHost, mpdPort, mpdPass) {
  this.netConnection = {};
  this.host = mpdHost;
  this.port = mpdPort;
  this.pass = mpdPass || '';
  this.isConnected = false;
  this.isAuthenticated = false;

  this.setupMPD(this.host, this.port, this.pass);
}

/**
 * @desc Sets up the MPD side of the connection
 *
 * @param {string} host - the MPD host
 * @param {number} port - the MPD port
 * @param {string} [pass] - an optional password for MPD
 */
MPD.prototype.setupMPD = function(host, port, pass) {
  var self = this;

  pass = pass || '';

  // The mpd connection
  self.netConnection = net.connect({host: host, port: port}, function() {
    self.isConnected = true;
  });

  self.netConnection.on('data', function(data) {
    // The string message that was sent to us
    var msgString = data.toString();
    console.log((new Date()) + ' MPD at ' + host + ':' + port + ' says ' + msgString.replace(/^\s+|\s+$/g,''));

    var ws = seneca.make$('proxy/ws');
    ws.list$({}, function (err, list) {
      _.forEach(list, function (websocket) {
        // Loop through all clients
        _.forEach(websocket.clients, function (client) {
          // Send a message to the client with the message
          client.sendUTF(msgString);
        });
      });
    });

  });

  self.netConnection.on('end', function() {
    console.log((new Date()) + ' MPD Connection [' + host + ':' + port + '] Closed');

    // Notify the clients that the connection was closed
    var ws = seneca.make$('proxy/ws');
    ws.list$({}, function (err, list) {
      _.forEach(list, function (websocket) {
        // Loop through all clients
        _.forEach(websocket.clients, function (client) {
          client.sendUTF('MPD Connection [' + host + ':' + port + '] Closed');
        });
      });
    });

    self.isConnected = false;
    self.isAuthenticated = false;
  });
};


module.exports = MPD;
