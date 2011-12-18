var express = require('express');
var server = express.createServer();
//server.use(express.logger('tiny'));

var ryanKahnApp = require('./app').app;
server.use(express.vhost('*ryan-kahn.com', ryanKahnApp));
server.use(express.vhost('*ryanakahn.com', ryanKahnApp));
server.use(express.vhost('*', ryanKahnApp));

var chrgy = require('./../../chrgy/server/app.js').app;
server.use(express.vhost('*chrgy.com', chrgy));
server.use(express.vhost('*chr.gy', chrgy));

//var kirk = require('./../../kirk/server/app.js').app;
//server.use(express.vhost('*kirksteineck.com', kirk));


server.listen(8080);
console.log("All Servers Started");