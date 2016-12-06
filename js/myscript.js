var Game  = function(){
    this.sequence = [];
}
Game.prototype.play = function(){
    var random = Math.floor((Math.random()*4)+1);
    console.log(random);
    this.sequence.push(random);
}
var HighScore = function(playerName, highScore){
    this.playerName = playerName;
    this.highScore = highScore;
}

$(function(){
    var highScores = firebase.database().ref('scores');
    var playerName = firebase.database().ref('players');

    // highScores.push("afaf"). then(function(){
    //     console.log("hello");
    // });
    $('body').on('keydown', function(e) {
    var arrowToNumber = e.key;
      if(e.which === 68){
          arrowToNumber = 1;
      }
      else if(e.which === 75){
          arrowToNumber =2 ;
      }
      else if(e.which === 67){
          arrowToNumber = 3;
      }
      else if(e.which === 77){
          arrowToNumber = 4;
      }
    //   playWithArrowKey(e.key);
      playWithArrowKey(arrowToNumber);
    });

    var newGame = new Game();
    var playerInput = [];
    var sequence = "";
    var seconds = 0;
    var clock;

    // to print to screen for testing
    var play = function(){
        newGame.play();
        clock = setInterval(function(){
            seconds += 1;
            console.log(seconds);
        }, 1000);
        sequence = newGame.sequence.join("");
        $("#sequence").text(sequence);
        playSequence(newGame.sequence);
    }
    $("#play").click(function(){
        play();
    });
    var gameOver = function(){
        var sound = document.getElementById("gameOver");
        sound.play();
        var score = newGame.sequence.length;
        var playerName = prompt("Bummer! looks like your score is "+score+" Please enter your name");
        var highScore  = new HighScore(playerName, score);
        highScores.push(highScore). then(function(){
            console.log("pushed");
        });
        clearInterval(clock);
    }
    //former "play sound" function, now used for player presses as well
    var lightUp = function(number, sound){
        sound.load();
        $("#"+number).addClass("lit");
            sound.play();
        setTimeout(function(){
            $("#"+number).removeClass("lit");
            sound.load();
        },300);
    }
    // will the new sequence
    var playSequence = function(numbers){
        numbers.forEach(function(number, index){
            var sound;
            console.log(number);
            sound = document.getElementById("audio" + number);
            //setttime doesnt seem to want its call back function to take an argument.
            //this looks really weird, but this prevents all lightups from runing at once!!! wtf?
            var playSound = function(){
                lightUp(number, sound);
            }
            var myVar = setTimeout(playSound, 350 * index);
        });
    }
    //will  play out sounds and lights for simon's sequence



    $("button.tile").click(function(){
        var sound = document.getElementById("audio" + $(this).html());
        var input = $(this).html();
        lightUp(input, sound);
        playerInput.push(input);
        console.log( "playerInput is" + playerInput.join(""));
        var entryLength = playerInput.length;
        if(playerInput.join("") !== sequence.substring(0, entryLength)){
            gameOver();
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
        lightUp(number, sound);
        playerInput.push(number);
        console.log( "playerInput is" + playerInput.join(""));
        var entryLength = playerInput.length;
        if(playerInput.join("") !== sequence.substring(0, entryLength)){
            gameOver();
        }
        else if(playerInput.join("") === sequence){
            playerInput = [];
            $("#playerInput").text(number);
            setTimeout(play, 1000);
        };
    }
});
