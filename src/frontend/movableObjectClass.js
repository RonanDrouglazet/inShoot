var touchStartHandler = function(e) {
  e.preventDefault();
  this.startCoord = e.touches[0];
  this.touchTime = (new Date()).getTime();
};

var touchEndHandler = function(e) {
  e.preventDefault();
  this.shoot.direction = {
    x: Math.abs(this.startCoord.screenX - e.changedTouches[0].screenX),
    y: Math.abs(this.startCoord.screenY - e.changedTouches[0].screenY)
  };
  this.shoot.distance = Math.sqrt(sqr(this.shoot.direction.x) + sqr(this.shoot.direction.y));
  this.shoot.vitesse = this.shoot.distance / ((new Date()).getTime() - this.touchTime);
  //doAction(this.shoot);
  console.log(this.shoot);
  move("goal", this.shoot);
};


var touchMoveHandler = function(e) {
  e.preventDefault();
};

var move = function(id, coord) {
  var ob = document.getElementById("goal");
  ob.style.transition ="all 1s ease-in-out";
  ob.style.webkitTransform = "translate(" + coord.direction.x +  "px, -" + coord.direction.y +  "px)";
};

var MovableObject = function(id) {

  var ob = document.getElementById(id);

  this.startCoord = {};
  this.touchTime = null;
  ob.addEventListener("touchstart", touchStartHandler.bind(this), false);
  ob.addEventListener("touchmove", touchMoveHandler.bind(this), false);
  ob.addEventListener("touchend", touchEndHandler.bind(this), false);

  this.shoot = {
    vitesse: 0,
    direction: {
      x: 0,
      y: 0
    },
    distance: 0
  };

  return this;
};
