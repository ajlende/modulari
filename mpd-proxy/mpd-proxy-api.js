/* jslint node: true */
'use strict';

var seneca = require('seneca')();

seneca.use('./mpd-proxy.js');

seneca.act('role:web', {
  use: {
    prefix: '/api',
    pin: { role: 'api', cmd: '*' },
    map: {
      destroy: { POST: true },
      create: { POST: true },
    }
  }
});

var express = require('express');
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json());
app.use(seneca.export('web'));
app.listen(3000);
