var Game  = function(){
    this.sequence = [];
}
Game.prototype.play = function(){
    var random = Math.floor((Math.random()*4)+1);
    console.log(random);
    this.sequence.push(random);
}
// console.log(newGame);

var scoreKeeper = 0;

$(function(){
    var newGame = new Game();
    var play = function(){
        newGame.play();
        $("#sequence").text(newGame.sequence.join());
    }
    $("#play").click(function(){
        play();
        alert("played");
    })
});
