var express = require('express');
var server = express.createServer();

var nodeFolder = "/data/www/node/";
//server.use(express.logger('tiny'));

var ryanKahnApp = require(nodeFolder+'rkahn/server/app').app;
server.use(express.vhost('*ryan-kahn.com', ryanKahnApp));
server.use(express.vhost('*ryanakahn.com', ryanKahnApp));
server.use(express.vhost('*', ryanKahnApp));

var chrgy = require(nodeFolder+'chrgy/server/app.js').app;
server.use(express.vhost('*chrgy.com', chrgy));
server.use(express.vhost('*chr.gy', chrgy));

//var kirk = require(nodeFolder+'kirk/server/app.js').app;
//server.use(express.vhost('*kirksteineck.com', kirk));

server.listen(8080);
console.log("All Servers Started");