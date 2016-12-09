var Game  = function(){
    this.sequence = [];
    this.scoreToBeat;
    this.enableCountdown;
    this.enableCountdownAlert;
    this.gameOver = true;
}
Game.prototype.play = function(){
    var random = Math.floor((Math.random()*4)+1);
    // console.log(random);
    this.sequence.push(random);

}
var HighScore = function(playerName, highScore){
    this.playerName = playerName;
    this.highScore = highScore;
}

$(function(){
    var scoresRef = firebase.database().ref('scores');
    var redrawHighScores = function(){
        scoresRef.orderByChild('highScore').limitToLast(5).on('value', function(snap){
            $("#highScores").empty();
            // write score to beat to game object
            // var lowestKey = Object.keys(snap.val())[3];
            // var scoreToBeat = snap.val()[lowestKey];
            // newGame.scoreToBeat = scoreToBeat;
            // console.log(lowestKey);
            snap.forEach(function(thing){
                $("#highScores").prepend("<li><span>"+ thing.val().highScore +"</span>  "+ thing.val().playerName +"</li>");
            });
            newGame.scoreToBeat = $("#highScores li:last-child span").html();

            console.log(newGame.scoreToBeat);
        });
    }
    redrawHighScores();
    $("#enableCountdownAlert").click(function(){
        $("#enableCountdown").prop('checked', true);
    });
    $("#enableCountdown").click(function(){
        if($(this).prop('checked') === false){
            $("#enableCountdownAlert").prop('checked', false);
        }
    })
    // var highScores = firebase.database().ref('scores');
    var timer;
    var countdown = function(){
        var countdownAlert = document.getElementById("countdownAlert");
        var seconds = 0;
        timer = setInterval(function(){
            seconds ++;
            if(seconds  === 10){
                gameOver();
                clearInterval(timer);
            }
            if(seconds > 5 && newGame.enableCountdownAlert === true){
                countdownAlert.play();
            }
            console.log(seconds);
        }, 1000)
    }

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
    //   playWithKeyboard(e.key);
      playWithKeyboard(arrowToNumber);
    });

    var newGame = new Game();
    var playerInput = [];
    var sequence = "";
    //master clock. clock is defined outside of function so i can start it when play is hit
    var clock;
    var seconds = 0;

    // PLAYER's move, runs each time a square is pressed
    var play = function(){
        //METHOD play on object, not same
        newGame.play();
        newGame.gameOver = false;
        clearInterval(timer);
        sequence = newGame.sequence.join("");
        // $("#sequence").text(sequence);
        playSequence(newGame.sequence);

    }
//start game
    $("#play").click(function(){
        $("#options").hide();
        assignClicks();
        clock = setInterval(function(){
            seconds += 1;
        }, 1000);
        newGame.enableCountdown =  $("#enableCountdown").prop("checked");
        newGame.enableCountdownAlert = $("#enableCountdownAlert").prop("checked");
        play();
    });

    var gameOver = function(){
        newGame.gameOver = true;
        $('.tile').off();
        var sound = document.getElementById("gameOver");
        sound.play();
        var score = newGame.sequence.length - 1;
        if (score >= newGame.scoreToBeat && newGame.enableCountdown === true){
            var addNewHighScore2 = function(){
                console.log("run");
                addNewHighScore(score);
            };
            setTimeout(addNewHighScore2, 600);
        }
        clearInterval(clock);
        clearInterval(timer);
        $("#options").show();
        newGame.sequence = [];
        playerInput = [];
        sequence = "";
        //master clock. clock is defined outside of function so i can start it when play is hit
        var seconds = 0;
    }


    var addNewHighScore = function(score){
        var playerName = prompt("Congrats! You memorized "+ score +"places. Please enter your name");
        var highScore  = new HighScore(playerName, score);
        scoresRef.push(highScore).then(function(){
            redrawHighScores();
        });
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
        if(newGame.enableCountdown === true){
            setTimeout(function(){
                countdown();
            }, numbers.length * 400);
        }
        numbers.forEach(function(number, index){
            var sound = document.getElementById("audio" + number);
            setTimeout(function(){
                lightUp(number, sound);
            }, 350 * index);
        });
    }
    //will  play out sounds and lights for simon's sequence
var assignClicks = function(){
    $("button.tile").click(function(){
        var sound = document.getElementById("audio" + $(this).html());
        var input = $(this).html();
        lightUp(input, sound);
        playerInput.push(input);
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

    //this is a function for keystrokes, keep the aforementinoed one for now until done
    var playWithKeyboard = function(number){
        if(newGame.gameOver  === false){

        var sound = document.getElementById("audio" + number);
        lightUp(number, sound);
        playerInput.push(number);
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
    }
});
