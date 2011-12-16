var express = require('express');

var ryanKahnApp = require('./app').app;
var testApp = require('./test').app;
var server = express.createServer();

//server.use(express.logger('tiny'));

server.use(express.vhost('*test.com', testApp));

server.use(express.vhost('*ryan-kahn.com', ryanKahnApp));
server.use(express.vhost('*ryanakahn.com', ryanKahnApp));


server.use(express.vhost('*', ryanKahnApp));

server.listen(8080);
console.log("Server Started");