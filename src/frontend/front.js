var socket = io('http://localhost:8080');
var joueur = {};

socket.on('playerType', function (data) {

  console.log(data);

  joueur.type = data.type;

  if(joueur.type == 1){
    $('#type').text('Vous êtes goal');
    $('title').append(' - Goal '+data.id+'');
  }
  else if(joueur.type == 2){
    $('#type').text('Vous êtes attaquant');
    $('title').append(' - Attaquant '+data.id+'');
  }

  ready(data.ready);

});


socket.on('ready', function () {
  ready(true);
});

socket.on('score', function(data){



});

socket.on('shoot', function(data){



});



var shoot = function(){
  socket.emit('shoot', { my: 'data' });
};

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
 * data.diractionY
 */
var doAction = function(data){
  console.log(data);
};

var sqr = function(a) {
  return a * a;
};


