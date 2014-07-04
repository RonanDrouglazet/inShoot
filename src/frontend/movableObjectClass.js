var touchStartHandler = function(e) {
    e.preventDefault();
    this.startCoord = e.touches[0];
    this.touchTime = Date.now();
};

var touchEndHandler = function(e) {
    e.preventDefault();
    this.shoot.direction = {
        x: Math.abs(e.changedTouches[0].clientX),
        y: Math.abs(e.changedTouches[0].clientY)
    };

    this.shoot.distance = Math.sqrt(sqr(this.shoot.direction.x) + sqr(this.shoot.direction.y));
    this.shoot.vitesse = this.shoot.distance / (Date.now() - this.touchTime);
    this.shoot.endPoint.x = e.changedTouches[0].pageX;
    this.shoot.endPoint.y = e.changedTouches[0].pageY;

    move(this.ob, this.shoot.endPoint.x, this.shoot.endPoint.y);
    doAction(this.shoot);
};


var touchMoveHandler = function(e) {
    e.preventDefault();
};

var move = function(obj, left, top, callback) {
    var cb = callback;
    obj.style.transition = "all 0.5s ease-out";
    obj.style.left = left + "px";
    obj.style.top = top + "px";
    addEvent(obj, ["webkitTransitionEnd", "transitionend"], function() {
        obj.style.transition = "none";
        if (cb) {
            cb();
            cb = null;
        }
    });
};

var addEvent = function(obj, aEvent, callback) {
    aEvent.forEach(function(eventS, index) {
        if (obj.addEventListener) {
            obj.addEventListener(eventS, callback, false);
        } else if (obj.attachEvent) {
            obj.attachEvent(eventS, callback);
        }
    });
}

var MovableObject = function(id) {
    this.ob = document.getElementById(id);
    this.startCoord = {};
    this.touchTime = null;

    var ms = window.navigator.msPointerEnabled;
    alert(touchStartHandler.bind);
    addEvent(this.ob, [ms ? "pointerdown" : "touchstart"], touchStartHandler.bind(this));
    addEvent(this.ob, [ms ? "pointermove" : "touchmove"], touchMoveHandler.bind(this));
    addEvent(this.ob, [ms ? "pointerup" : "touchend"], touchEndHandler.bind(this));

    this.shoot = {
        vitesse: 0,
        direction: {
            x: 0,
            y: 0
        },
        distance: 0,
        endPoint: {
            x: 0,
            y: 0
        }
    };

    return this;
};
