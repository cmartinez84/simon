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
    var playerInput = [];
    var sequence = "";
    var play = function(){
        newGame.play();
        sequence = newGame.sequence.join("");
        $("#sequence").text(sequence);
    }
    $("#play").click(function(){
        play();
        console.log("played");
        $("input#playerInput").keyup(function(){
            var entryLength = $(this).val().length;
            if($(this).val() !== sequence.substring(0, entryLength)){
                alert("over!");
            }
            else if($(this).val() === sequence){
                play();
                console.log("success");
            };
        })
     })
});
