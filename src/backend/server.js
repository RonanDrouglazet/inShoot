var express = require('express'),
io = require('socket.io'),
http = require('http');

var inShoot = express();
var serverIo = http.createServer(inShoot);
var socketIo = io.listen(serverIo);

//static
inShoot.use('/', express.static(__dirname + '/../../static/'))

//404 not found
.use(function(req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Not Found');
});

serverIo.listen(process.env.PORT || 8080);

console.log('now listening on port ', (process.env.PORT || 8080));
