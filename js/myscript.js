var Game  = function(){
    this.sequence = [];
}
Game.prototype.play = function(){
    var random = Math.floor((Math.random()*4)+1);
    console.log(random);
    this.sequence.push(random);
}

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
        $("input#playerInput").keyup(function(){
            var input = $(this).val();
            $(this).val("");
            playerInput.push(input);
            console.log( "playerInput is" + playerInput.join(""));
            var entryLength = playerInput.length;
            if(playerInput.join("") !== sequence.substring(0, entryLength)){
                alert("over!");
            }
            else if(playerInput.join("") === sequence){
                playerInput = [];
                $("#playerInput").text(input);
                play();
            };
        })
    });
    // $("button").click(function(){
    //     var value = $(this).val();
    //     // output
    // });
});
