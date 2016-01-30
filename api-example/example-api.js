var seneca = require('seneca')();

seneca.use('./example.js');

seneca.act('role:web',{ use: {
  prefix: '/api',
  pin: { role:'api', cmd:'*' },
  map: {
    test: { GET: true }
  }
}});

var express = require('express');
var app = express();
app.use(seneca.export('web'));
app.listen(3000);
