var socket = io('http://localhost:8080');
var joueur = {};

socket.on('playerType', function (data) {

  console.log(data);

  joueur.type = data.type;
  joueur.id = data.id;

  console.log('playertype',data);

  if(joueur.type == 1){
    $('#type').text('Vous êtes goal');
    $('title').append(' - Goal '+data.id+'');
    new MovableObject("goal");
  }
  else if(joueur.type == 2){
    $('#type').text('Vous êtes attaquant');
    $('title').append(' - Attaquant '+data.id+'');
    new MovableObject("ball");
  }

  ready(data.ready);

});


socket.on('ready', function () {
  ready(true);
});

socket.on('score', function(data){



});


socket.on('shoot', function(data){

  $('#ball').show();
  $('#ball').css({top : data.endPoint.y+'px',left : data.endPoint.x+'px'});
  $('#ball').animate({opacity : 0});

  setTimeout(function(){
    $('#ball').css({opacity : 1, top: "80%", left:"50%"});
    $('#ball').animate({top : data.endPoint.y+'px',left : data.endPoint.x+'px'}, 500, function() {
      var left  = parseInt($("#goal")[0].offsetLeft);
      var top = parseInt($("#goal")[0].offsetTop);
      console.log(left);
      console.log(data.endPoint.x )
      if (data.endPoint.x >= left && data.endPoint.x <= (left + parseInt($('#ball').css("width"))) ){
        alert('pas but');
      } else {
        alert('but');
      }
    });
  }, 4000);


});





var stop = function(){

};


var ready = function(isReady){

  if(isReady){
    $('#state').text('');
    $('#game').show();
    $('#play').hide();

    if (joueur.type === 1) {
        $('#goal').show();
        new MovableObject("goal");
    } else {
        $('#ball').show();
        new MovableObject("ball");
    }
  }
  else{
    $('#state').text('En attente du second joueur...');
  }

};



/**
 *
 * @param data
 * data.vitesse
 * data.directionX
 * data.directionY
 */
var doAction = function(obj){

  var data = {};
  data.id = joueur.id;
  data.endPoint  = obj.endPoint;

  // goal
  if(joueur.type == 1){
    socket.emit('shootStop', data);
  }
  else if(joueur.type == 2){
    socket.emit('shoot', data);
  }


};

var sqr = function(a) {
  return a * a;
};


