var touchStartHandler = function(e) {
  e.preventDefault();
  this.startCoord = e.touches[0];
  this.touchTime = (new Date()).getTime();
};

var touchEndHandler = function(e) {
  e.preventDefault();
  this.shoot.direction = {
    x: Math.abs(e.changedTouches[0].clientX),
    y: Math.abs(e.changedTouches[0].clientY)
  };
  this.shoot.distance = Math.sqrt(sqr(this.shoot.direction.x) + sqr(this.shoot.direction.y));
  this.shoot.vitesse = this.shoot.distance / ((new Date()).getTime() - this.touchTime);
  this.shoot.endPoint.x = e.changedTouches[0].pageX;
  this.shoot.endPoint.y = e.changedTouches[0].pageY;
  doAction(this.shoot);
  move(this);
};


var touchMoveHandler = function(e) {
  e.preventDefault();
};

var move = function(movableObject) {

  movableObject.ob.style.transition ="all 1s ease-out";
  var movement = {
    x : movableObject.shoot.direction.x - movableObject.ob.offsetLeft - (movableObject.ob.offsetWidth / 2),
    y : movableObject.shoot.direction.y - movableObject.ob.offsetTop - (movableObject.ob.offsetHeight / 2)
  }
  movableObject.ob.style.webkitTransform = "translate(" + movement.x +  "px, " + movement.y +  "px)";
};

var MovableObject = function(id) {

  this.ob = document.getElementById(id);

  this.startCoord = {};
  this.touchTime = null;
  this.ob.addEventListener("touchstart", touchStartHandler.bind(this), false);
  this.ob.addEventListener("touchmove", touchMoveHandler.bind(this), false);
  this.ob.addEventListener("touchend", touchEndHandler.bind(this), false);

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
