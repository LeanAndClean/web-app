'use strict';

var server = require('node-static');

var fileServer = new server.Server('./app');

require('http').createServer(function (req, res) {
    
    if(req.url === '/healthcheck' && req.method === 'GET'){
       res.writeHead(200, {
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'POST, GET, OPTIONS, DELETE, PUT',
        'Access-Control-Allow-Headers':'Content-Type',
        'Content-Type': 'application/json'
      });
      res.write(JSON.stringify({ message: 'OK' }));
      res.end();
    }

    req.addListener('end', function () {
        fileServer.serve(req, res);
    }).resume();

}).listen(process.env.SERVICE_PORT, function(){
  console.log('Listen on ' + process.env.SERVICE_PORT)
});