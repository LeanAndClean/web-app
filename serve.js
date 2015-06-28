'use strict';

var express         = require('express');
var info            = require('./package.json');
var responseTime    = require('response-time');

var SHUTDOWN_TIMEOUT_MS = parseInt(process.env.SHUTDOWN_TIMEOUT_MS) || 10000;

var app = express();
var server = app.listen(process.env.SERVICE_PORT, function(){
  console.log('Listen on ' + process.env.SERVICE_PORT);
});


app.use(responseTime(function(req, res, time){
  console.log('LOG: ' + req.method + ',' + req.url + ',' + res.statusCode + ',' + time);
}));
app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.static('app'));

app.get('/healthcheck', function(req, res){
  res.send({ message: 'OK', version: info.version});
});

app.get('/error', function(req, res){
  console.log(new Error('Error - shut down'));
  process.exit(-1);
});

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
  console.log('Received kill signal, shutting down gracefully in ' + SHUTDOWN_TIMEOUT_MS + 'ms');
  server.close(function() {
    console.log('Closed out remaining connections');
    console.error('Shutting down after ' + SHUTDOWN_TIMEOUT_MS + 'ms');
    setTimeout(process.exit, SHUTDOWN_TIMEOUT_MS);
  });

  setTimeout(function() {
   console.error('Force shutting down after ' + (SHUTDOWN_TIMEOUT_MS * 3) + 'ms');
   process.exit();
  }, (SHUTDOWN_TIMEOUT_MS * 3));  
}