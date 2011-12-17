var express = require('express');

var ryanKahnApp = require('./app').app;
var chrgy = require('./../../chrgy/server/app.js').app;
var server = express.createServer();

//server.use(express.logger('tiny'));

server.use(express.vhost('*test1.com', chrgy));

server.use(express.vhost('*ryan-kahn.com', ryanKahnApp));
server.use(express.vhost('*ryanakahn.com', ryanKahnApp));


server.use(express.vhost('*', ryanKahnApp));

server.listen(8080);
console.log("All Servers Started");