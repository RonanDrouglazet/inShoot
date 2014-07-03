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
.use('/frontend', express.static(__dirname + '/../frontend/'))

//404 not found
.use(function(req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Not Found');
});

socketIo.on("connection", function (socket) {
    var response = checkSession(socket);
    var matchReady = !!(gsession[response.id].goal && gsession[response.id].striker);

    socket.on("shoot", getShoot);
    socket.on("shootStop", getStop);

    socket.emit("playerType", {id: response.id, type: response.type, ready: matchReady});

    if (matchReady) {
        gsession[response.id].goal.io.emit("ready", {data: true});
    }
});

var checkSession = function(socket) {
    var session = null;

    gsession.forEach(function(obj, index) {
        if (!obj.goal) {
            obj.goal = createPlayer(obj, PLAYER_TYPE.GOAL, socket);
            session = obj.goal;
        } else if (!obj.striker) {
            obj.striker = createPlayer(obj, PLAYER_TYPE.STRIKER, socket);
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

var createPlayer = function(parent, type, socket) {
    return {
        id: parent.id,
        io: socket,
        type: type,
        score: 0
    }
}

var getShoot = function(data) {
    gsession[data.id].goal.emit("shoot", {data: data});
}

var getStop = function(data) {

    if (data.goal) {
        gsession[data.id].striker.score++;
    } else {
        gsession[data.id].goal.score++;
    }

    var score = {
        goal: gsession[data.id].goal.score,
        striker: gsession[data.id].striker.score
    };

    gsession[data.id].goal.io.emit("score", {data: score});
    gsession[data.id].striker.io.emit("score", {data: score});

}

serverIo.listen(process.env.PORT || 8080);

console.log('now listening on port ', (process.env.PORT || 8080));
