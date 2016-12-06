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

    var scoresRef = firebase.database().ref("scores");
    scoresRef.orderByChild('highScore').limitToLast(5).on('value', function(snap){
        snap.forEach(function(thing){
            $("#highScores").prepend("<li>"+ thing.val().highScore +"  "+ thing.val().playerName +"</li>");
        });
    });



    var highScores = firebase.database().ref('scores');
    // var playerName = firebase.database().ref('players');

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
    //master clock. clock is defined outside of function so i can start it when play is hit
    var clock;
    var seconds = 0;

    // to print to screen for testing
    // play/ move
    var play = function(){
        newGame.play();
        sequence = newGame.sequence.join("");
        $("#sequence").text(sequence);
        playSequence(newGame.sequence);
    }
//start game
    $("#play").click(function(){
        play();
        assignClicks();
        $(this).hide();
        clock = setInterval(function(){
            seconds += 1;
            console.log(seconds);
        }, 1000);
    });

    var gameOver = function(){
        $('.tile').off();
        var sound = document.getElementById("gameOver");
        sound.play();
        var score = newGame.sequence.length;
        var playerName = prompt("Congrats! You memorized "+ score +"places. Please enter your name");
        var highScore  = new HighScore(playerName, score);
        highScores.push(highScore). then(function(){
            sequence = "";
        });
        clearInterval(clock);
        $("#play").show();

        newGame = new Game();
        playerInput = [];
        sequence = "";
        //master clock. clock is defined outside of function so i can start it when play is hit
        var seconds = 0;



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
    // plays computer sequence
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
var assignClicks = function(){
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
}


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
