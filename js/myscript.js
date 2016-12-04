var Game  = function(){
    this.sequence = [];
}
Game.prototype.play = function(){
    var random = Math.floor((Math.random()*4)+1);
    console.log(random);
    this.sequence.push(random);
}

$(function(){
    var arrowToNumber;
    $('body').on('keydown', function(e) {
    //   if(e.key === "ArrowLeft"){
    //       arrowToNumber = 1;
    //   }
    //   else if(e.key === "ArrowUp"){
    //       arrowToNumber = 2;
    //   }
    //   else if(e.key === "ArrowRight"){
    //       arrowToNumber = 3;
    //   }
    //   else if(e.key === "ArrowDown"){
    //       arrowToNumber = 4;
    //   }
      playWithArrowKey(e.key);
    });

    var newGame = new Game();
    var playerInput = [];
    var sequence = "";
    //to print to screen for testing
    var play = function(){
        newGame.play();
        sequence = newGame.sequence.join("");
        $("#sequence").text(sequence);
        playSequence(newGame.sequence)
    }
    $("#play").click(function(){
        play();
    });


    var playSequence = function(numbers){
        numbers.forEach(function(number, index){
            var sound;
            console.log(number);
            sound = document.getElementById("audio" + number);
            var playSound = function(){
                $("#"+number).addClass("lit");
                    sound.play();
                setTimeout(function(){
                    $("#"+number).removeClass("lit");
                    sound.load();
                },300);
            }
            var myVar = setTimeout(playSound,200 * index);
        });
    }
    //will  play out sounds and lights for simon's sequence



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
            setTimeout(play, 1000);
        };
    });

    //this is a functino for keystrokes, keep the aforementinoed one for now until done
    var playWithArrowKey = function(number){
        var sound = document.getElementById("audio" + number);
         sound.play();
        var input = number;
        playerInput.push(input);
        console.log( "playerInput is" + playerInput.join(""));
        var entryLength = playerInput.length;
        if(playerInput.join("") !== sequence.substring(0, entryLength)){
            alert("over!");
        }
        else if(playerInput.join("") === sequence){
            playerInput = [];
            $("#playerInput").text(input);
            setTimeout(play, 1000);
        };
    }

});
