var socket = io(window.location.origin);
var joueur = {}, ui = {}, move = {};
var PLAYER_TYPE = {
    GOAL: 1,
    STRIKER: 2
};

socket.on("playerType", function (data) {
    joueur.type = data.type;
    joueur.id = data.id;

    //retrieve dom ui
    ui.type = document.getElementById("type");
    ui.ball = document.getElementById("ball");
    ui.goal = document.getElementById("goal");
    ui.game = document.getElementById("game");
    ui.state = document.getElementById("state");
    ui.play = document.getElementById("play");
    ui.wait = document.getElementById("wait");

    if (joueur.type === PLAYER_TYPE.GOAL) {
        ui.type.innerHTML = "Vous êtes goal";
        document.title += " - Goal " + data.id;
        new MovableObject("goal");
    } else if (joueur.type === PLAYER_TYPE.STRIKER) {
        ui.type.innerHTML = "Vous êtes attaquant";
        document.title += " - Attaquant " + data.id;
        new MovableObject("ball");
    }

    ready(data.ready);
});

socket.on("ready", function () {
    ready(true);
});

socket.on("score", function(data){
    alert("score: goal (" + data.goal + ") / striker (" + data.striker + ")");

    resetStage(joueur.type);
});

socket.on("shoot", function(data){
    ui.ball.style.display = "block";
    ui.ball.style.opacity = 0.2;
    ui.ball.style.top = data.endPoint.y + "px";
    ui.ball.style.left = data.endPoint.x + "px";

    setTimeout(function() {
        ui.ball.style.opacity = 0;
    }, 250);

    setTimeout(function(){
        ui.ball.style.opacity = 1;
        ui.ball.style.top = "80%";
        ui.ball.style.left = "50%";
    }, 2000);

    setTimeout(function() {
        move(ui.ball, data.endPoint.x, data.endPoint.y, checkIfGoal.bind(this, data));
        ui.ball.style.width = ui.ball.style.height = "30px";
    }, 2100);
});

var checkIfGoal = function(data) {
    var g = ui.goal.getBoundingClientRect();
    var b = ui.ball.getBoundingClientRect();
    var left = (b.left + b.width) > g.left;
    var right = b.left < (g.left + g.width);
    var top = (b.top + b.height) > g.top;
    var bottom = b.top < (g.top + g.height);
    var isGoal = !(left && right && top && bottom);

    socket.emit("shootStop", {id: data.id, goal: isGoal});
}

var ready = function(isReady){
    if(isReady){
        ui.state.innerHTML = "";
        ui.game.style.display = "block";
        ui.play.style.display = "none";

        if (joueur.type === PLAYER_TYPE.GOAL) {
            ui.goal.style.display = "block";
        } else {
            ui.ball.style.display = "block";
            ui.ball.addEventListener("touchend", function() {
                ui.ball.style.width = ui.ball.style.height = "30px";
            });
            ui.ball.addEventListener("webkitTransitionEnd", function() {
                ui.wait.style.display = "block";
            });
        }
    } else {
        ui.state.innerHTML = "En attente du second joueur...";
    }
};

var resetStage = function(type) {
    if (type === PLAYER_TYPE.GOAL) {
        ui.ball.style.display = "none";
        ui.goal.style.top = "37%";
        ui.goal.style.left = "50%";
    } else if (type === PLAYER_TYPE.STRIKER) {
        ui.ball.style.top = "80%";
        ui.ball.style.left = "50%";
        ui.wait.style.display = "none";
    }

    ui.ball.style.width = ui.ball.style.height = "50px";
}

/**
 *
 * @param data
 * data.vitesse
 * data.directionX
 * data.directionY
 */
var doAction = function(obj) {
    var data = {
        id: joueur.id,
        endPoint: obj.endPoint
    };

    // striker
    if (joueur.type == PLAYER_TYPE.STRIKER) {
        socket.emit("shoot", data);
    }
};

var sqr = function(a) {
    return a * a;
};


