var timerElem = null;
var startTime = null;
var intervalFunction = null;
var nameValue = null;

function leftPad (aNumber, aLength) {       
    if (aNumber.toString().length >= aLength) {
        return aNumber;
    }        
    
    return (Math.pow(10, aLength) + Math.floor(aNumber)).toString().substring(1);    
 }

function convertTime(milliseconds) {
  var totalSeconds = Math.floor(milliseconds/1000);
  var minutes = leftPad(Math.floor(totalSeconds/60),2); 
  var seconds = leftPad(totalSeconds - minutes * 60,2); 
  return minutes + ':' + seconds;
}

function onInterval() {
    var currentTime = new Date();
    var timeElapsed = currentTime - startTime;
    var formatted = convertTime(timeElapsed);

    timerElem.textContent = "" + formatted;
}

function redirectToProtein() {
    window.clearInterval(intervalFunction);

    var difficultyValueTxt = document.getElementById("difficulty-value");
    var difficultyValue = difficultyValueTxt.value;
    timerElem = document.getElementById("timer");

    fetch(`http://localhost:5000/score/${difficultyValue}`, {
        method: "POST",
        body: JSON.stringify({
            name: nameValue,
            minutes: timerElem.textContent.split(":")[0],
            seconds: timerElem.textContent.split(":")[1],
            text: timerElem.textContent
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(() => {
        nameValue = null
        window.location.href = window.location.href.replace("play", "protein");
    });
}

function showWrongAnswer() {
    var wrongAnswerTxt = document.getElementById("wrong-answer-text");
    wrongAnswerTxt.style.display = "block";
}

function onGuess() {
    var txtBox = document.getElementById("sequence");
    var inputSequence = txtBox.value;

    var guessValueInput = document.getElementById("guess-value");

    if (inputSequence == guessValueInput.value) {
        redirectToProtein();
    }
    else {
        showWrongAnswer();
    }
}

function start() {
    var startButtonArea = document.getElementById("start-button-area");
    var playArea = document.getElementById("play-area");
    var guessBtn = document.getElementById("guess-button");
    var sequence = document.getElementById("sequence");
    var nameInput = document.getElementById("name");
    var pickUpText = document.getElementById("pick-up-text");

    nameValue = nameInput.value
    startButtonArea.style.display = "none";
    pickUpText.style.display = "none";
    playArea.style.display = "flex";
    sequence.focus();

    guessBtn.addEventListener("click", onGuess);
    sequence.addEventListener("keyup", function(e) {
        if (e.code === "Enter") {
            onGuess()
        }
    });

    startTime = new Date();
    intervalFunction = window.setInterval(onInterval, 10);
}

function onLoad() {
    timerElem = document.getElementById("timer");

    var btn = document.getElementById("start-button");
    var input = document.getElementById("name");

    input.focus();

    btn.addEventListener("click", start);
    input.addEventListener("keyup", function(e) {
        if (e.code === "Enter") {
            start();
        }
    });
}

window.addEventListener("load", onLoad);
