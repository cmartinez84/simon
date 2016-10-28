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
            playSequence(example);
    });
    var playSound = function(){
        var sound = document.getElementById("audio1" );
          sound.play();
        };
        var myVar = setTimeout(playSound, 200);

    var playSequence = function(example){
        example.forEach(function(number){
            console.log(number);
            var sound = document.getElementById("audio" + number);
            var playSound = function(){
                sound.play();
            }
            var myVar = setTimeout(playSound,300 * number);
        });
    }



    $("button.tile").click(function(){
        var sound = document.getElementById("audio" + $(this).html());
         sound.play();
        var input = $(this).html();
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
    });

});
