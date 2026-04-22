// VARIABLEN
let startButton = document.getElementById("start");
let navTree = document.getElementById("nav-tree");
let logo = document.getElementById("logo");
let howToPlayButton = document.getElementById("how-to-play");
let creditsButton = document.getElementById("credits");
let playerChoose = document.getElementById("playerChoose");
let characterSelection = document.getElementById("character-selection");
let fog = document.getElementById("fog");

let PLAYER = {
    box: document.getElementById("player"),
    spriteImg: document.getElementById("spriteImg"),
    spriteImgNumber: 0,
    spriteDirection: 1
};

let KEY_EVENTS = {
    leftArrow: false,
    rightArrow: false,
    upArrow: false,
    downArrow: false
};

let GAME_CONFIG = {
    gameSpeed: 28,
    characterSpeed: 5
};

let gameStarted = false;

document.onkeydown = keyListenerDown;
document.onkeyup = keyListenerUp;

function keyListenerDown(e) {
    if (e.key === "ArrowLeft") {
        KEY_EVENTS.leftArrow = true;
        KEY_EVENTS.rightArrow = false;
        KEY_EVENTS.upArrow = false;
        KEY_EVENTS.downArrow = false;
    }

    if (e.key === "ArrowUp") {
        KEY_EVENTS.leftArrow = false;
        KEY_EVENTS.rightArrow = false;
        KEY_EVENTS.upArrow = true;
        KEY_EVENTS.downArrow = false;
    }

    if (e.key === "ArrowRight") {
        KEY_EVENTS.leftArrow = false;
        KEY_EVENTS.rightArrow = true;
        KEY_EVENTS.upArrow = false;
        KEY_EVENTS.downArrow = false;
    }

    if (e.key === "ArrowDown") {
        KEY_EVENTS.leftArrow = false;
        KEY_EVENTS.rightArrow = false;
        KEY_EVENTS.upArrow = false;
        KEY_EVENTS.downArrow = true;
    }
}

function keyListenerUp(e) {
    if (e.key === "ArrowLeft") {
        KEY_EVENTS.leftArrow = false;
    }

    if (e.key === "ArrowUp") {
        KEY_EVENTS.upArrow = false;
    }

    if (e.key === "ArrowRight") {
        KEY_EVENTS.rightArrow = false;
    }

    if (e.key === "ArrowDown") {
        KEY_EVENTS.downArrow = false;
    }
}

function selectCharacter(characterNumber) {
    PLAYER.spriteImg.src = "./img/sprite.png";
    fog.style.transition = "opacity 1s ease";
    fog.style.opacity = "0";

    if (characterNumber === 1) {
        // Ziege
        PLAYER.spriteStartRight = 0;
    }

    if (characterNumber === 2) {
        // Weißes Schaf
        PLAYER.spriteStartRight = 150;
    }

    if (characterNumber === 3) {
        // Schwarzes Schaf
        PLAYER.spriteStartRight = 450;
    }

    playerChoose.style.display = "none";
    characterSelection.style.display = "none";

    PLAYER.box.style.display = "block";

    PLAYER.box.style.left = "650px";
    PLAYER.box.style.top = "400px";

    PLAYER.spriteImgNumber = 0;
    PLAYER.spriteImg.style.right = PLAYER.spriteStartRight + "px";
    PLAYER.spriteImg.style.top = "-330px";

    gameStarted = true;
    gameLoop();
}

function setSpriteDirection(direction) {
    if (direction === "down") {
        PLAYER.spriteImg.style.top = "-330px";
    }

    if (direction === "up") {
        PLAYER.spriteImg.style.top = "-548px";
    }

    if (direction === "left") {
        PLAYER.spriteImg.style.top = "-400px";
    }

    if (direction === "right") {
        PLAYER.spriteImg.style.top = "-475px";
    }
}

function movePlayer(dx, dy, dr) {
    let originalX = parseFloat(PLAYER.box.style.left);
    let originalY = parseFloat(PLAYER.box.style.top);

    if (isNaN(originalX)) {
        originalX = 800;
    }

    if (isNaN(originalY)) {
        originalY = 300;
    }

    let newX = originalX + dx;
    let newY = originalY + dy;

    if (newX < 0) {
        newX = 0;
    }

    if (newY < 0) {
        newY = 0;
    }

    if (newX > window.innerWidth - PLAYER.box.offsetWidth) {
        newX = window.innerWidth - PLAYER.box.offsetWidth;
    }

    if (newY > window.innerHeight - PLAYER.box.offsetHeight) {
        newY = window.innerHeight - PLAYER.box.offsetHeight;
    }

    PLAYER.box.style.left = newX + "px";
    PLAYER.box.style.top = newY + "px";

    if (dr !== 0) {
        PLAYER.spriteDirection = dr;
    }
}

function animatePlayer() {
    if (PLAYER.spriteImgNumber < 2) {
        PLAYER.spriteImgNumber++;

        let x = parseFloat(PLAYER.spriteImg.style.right);

        if (isNaN(x)) {
            x = PLAYER.spriteStartRight;
        }

        x += 50;
        PLAYER.spriteImg.style.right = x + "px";
    } else {
        PLAYER.spriteImg.style.right = PLAYER.spriteStartRight + "px";
        PLAYER.spriteImgNumber = 0;
    }
}

function gameLoop() {
    if (!gameStarted) {
        return;
    }

    if (KEY_EVENTS.leftArrow) {
        setSpriteDirection("left");
        movePlayer(-GAME_CONFIG.characterSpeed, 0, -1);
        animatePlayer();
    }

    if (KEY_EVENTS.rightArrow) {
        setSpriteDirection("right");
        movePlayer(GAME_CONFIG.characterSpeed, 0, 1);
        animatePlayer();
    }

    if (KEY_EVENTS.upArrow) {
        setSpriteDirection("up");
        movePlayer(0, -GAME_CONFIG.characterSpeed, 0);
        animatePlayer();
    }

    if (KEY_EVENTS.downArrow) {
        setSpriteDirection("down");
        movePlayer(0, GAME_CONFIG.characterSpeed, 0);
        animatePlayer();
    }

    setTimeout(gameLoop, 1000 / GAME_CONFIG.gameSpeed);
}

// Startbutton function
function Start() {
    navTree.style.transition = "transform 2s ease";
    navTree.style.transform = "translateX(-100vw)";

    startButton.style.transition = "transform 2s ease";
    startButton.style.transform = "translateX(-100vw)";

    howToPlayButton.style.transition = "transform 2s ease";
    howToPlayButton.style.transform = "translateX(-100vw)";

    creditsButton.style.transition = "transform 2s ease";
    creditsButton.style.transform = "translateX(-100vw)";

    logo.style.animation = "none";
    logo.style.transform = "rotate(12deg) scale(1)";
    void logo.offsetWidth;
    logo.style.transition = "transform 2s ease";
    logo.style.transform = "translateX(100vw) rotate(12deg) scale(1)";

    playerChoose.style.transition = "opacity 0.5s ease, top 0.9s ease";
    playerChoose.style.opacity = "1";
    playerChoose.style.top = "60%";

    characterSelection.style.transition = "opacity 0.5s ease, top 0.9s ease";
    characterSelection.style.opacity = "1";
    characterSelection.style.top = "50%";
}