/***********************************
 * EVENT EVENTS
 ***********************************/
let KEY_EVENTS = {
    leftArrow: false,
    rightArrow: false,
    upArrow: false,
    downArrow: false
}
document.onkeydown = keyListenerDown;
document.onkeyup = keyListenerUp;

function keyListenerDown(e) {
    if (e.key === "ArrowLeft") { // Left arrow
        KEY_EVENTS.leftArrow = true;
        playRunningSound();
    }
    if (e.key === "ArrowUp") { // Up arrow
        KEY_EVENTS.upArrow = true;
        playRunningSound();
    }
    if (e.key === "ArrowRight") { // Right arrow
        KEY_EVENTS.rightArrow = true;
        playRunningSound();
    }
    if (e.key === "ArrowDown") { // Down arrow
        KEY_EVENTS.downArrow = true;
        playRunningSound();
    }
}

function keyListenerUp(e) {
    if (e.key === "ArrowLeft") { // Left arrow
        KEY_EVENTS.leftArrow = false;
        runningSound.pause();
    }
    if (e.key === "ArrowUp") { // Up arrow
        KEY_EVENTS.upArrow = false;
        runningSound.pause();
    }
    if (e.key === "ArrowRight") { // Right arrow
        KEY_EVENTS.rightArrow = false;
        runningSound.pause();
    }
    if (e.key === "ArrowDown") { // Down arrow
        KEY_EVENTS.downArrow = false;
        runningSound.pause();
    }
}

let runningSound = new Audio('audio/running.mp3');
runningSound.volume = 0.3;
runningSound.loop = true;

function playRunningSound() {
    runningSound.play();
}