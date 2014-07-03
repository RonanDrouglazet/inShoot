var touchStartHandler = function(e) {
  this.startCoord = e.touches[0];
  this.touchTime = (new Date()).getTime();
};

var touchEndHandler = function(e) {
  this.shoot.direction = {
    x: Math.abs(this.startCoord.screenX - e.changedTouches[0].screenX),
    y: Math.abs(this.startCoord.screenY - e.changedTouches[0].screenY),
  };
  this.shoot.distance = Math.sqrt(sqr(this.shoot.direction.x) + sqr(this.shoot.direction.y));
  this.shoot.vitesse = this.shoot.distance / ((new Date()).getTime() - this.touchTime);
  doAction(this.shoot);
};

var MovableObject = function(id) {

  var ob = document.getElementById(id);

  this.startCoord = {};
  this.touchTime = null;
  ob.addEventListener("touchstart", touchStartHandler.bind(this), false);
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