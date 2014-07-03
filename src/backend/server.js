var express = require('express'),
io = require('socket.io'),
http = require('http');

var inShoot = express();
var serverIo = http.createServer(inShoot);
var socketIo = io.listen(serverIo);

var gsession = [];
var PLAYER_TYPE = {
    GOAL: 1,
    STRIKER: 2
};

//static
inShoot.use('/', express.static(__dirname + '/../../static/'))

//404 not found
.use(function(req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Not Found');
});

socketIo.on("connection", function (socket) {
    var response = checkSession(socket);

    socket.emit("playerType", {id: response.id, type: response.type, ready: (gsession[response.id].goal && gsession[response.id].striker) ? true : false});
});

var checkSession = function(socket) {
    var session = null;

    gsession.forEach(function(obj, index) {
        if (!obj.goal) {
            obj.goal = {
                id: obj.id,
                io: socket,
                type: PLAYER_TYPE.GOAL
            }
            session = obj.goal;
        } else if (!obj.striker) {
            obj.striker = {
                id: obj.id,
                io: socket,
                type: PLAYER_TYPE.STRIKER
            }
            session = obj.striker;
        }
    });

    if (!session) {
        session = createNewSession(socket);
    }

    return session;
}

var createNewSession = function(socket) {
    gsession.push({
        id: gsession.length,
        goal: {id: gsession.length, io: socket, type: PLAYER_TYPE.GOAL},
        striker: null
    });

    return gsession[gsession.length - 1].goal;
}

serverIo.listen(process.env.PORT || 8080);

console.log('now listening on port ', (process.env.PORT || 8080));
