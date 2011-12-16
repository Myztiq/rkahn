var fbGallery = require('./fbGallery/fbGallery.js'),
http = require('http'),
express = require('express'),
stylus = require('stylus'),
app = express.createServer();
app.get('/',function(req,res){
	res.send("TEST!");
});
exports.app = app;