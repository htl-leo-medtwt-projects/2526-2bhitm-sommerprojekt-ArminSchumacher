// LIBRARY
function loadThoughtById(thoughtId) {
    const thoughtObject = thoughtBubbles.find(item => item.id === thoughtId);

    if (thoughtObject) {
        thoughts.textContent = thoughtObject.text;
    } else {
        thoughts.textContent = "Kein passender Gedanke gefunden.";
    }
}

// VARIABLEN
let startButton = document.getElementById("start");
let navTree = document.getElementById("nav-tree");
let logo = document.getElementById("logo");
let howToPlayButton = document.getElementById("how-to-play");
let creditsButton = document.getElementById("credits");
let playerChoose = document.getElementById("playerChoose");
let characterSelection = document.getElementById("character-selection");
let fogDown = document.getElementById("fogDown");
let fogUp = document.getElementById("fogUp");
let thoughtBubble = document.getElementById("thought-bubble");
let thoughts = document.getElementById("thoughts");
let bubblePic = document.getElementById("bubblePic");
let thoughtNextButton = document.getElementById("thought-next");
let thoughtChoiceButtons = document.getElementById("thought-choice-buttons");
let healthBar = document.getElementById("health-bar");
let gameOverBox = document.getElementById("game-over-box");
let gameOverScreen = document.getElementById("game-over-screen");
let endingText = document.getElementById("ending-text");
let endingTitle = document.getElementById("ending-title");
let deathscreens = document.getElementById("deathscreens");
let bgmButton = document.getElementById("bgm");
let bgmAudio = document.getElementById("bgm-audio");
let bgmPlaying = false;
let bridgeBroken = false;
let owlDialogueActive = false;
let owlDialogueFinished = false;
let owlDialogueIndex = 0;
let owlChoice = null;
let bittersweetEndingSrcOne = "";
let bittersweetEndingSrcTwo = "";
let caveEndingSrcOne = "";
let caveEndingSrcTwo = "";


thoughtNextButton.style.display = "none";
const OWL_DIALOGUE_IDS = [16, 17, 18, 19, 20, 21, 22, 23];

// BACKGROUND MUSIC
function toggleBGM() {
    if (!bgmPlaying) {
        bgmAudio.play();
        bgmButton.src = "./img/loud.png";
        bgmPlaying = true;
    } else {
        bgmAudio.pause();
        bgmButton.src = "./img/quiet.png";
        bgmPlaying = false;
    }
}

// leaderboard variablen
let leaderboardScreen = document.getElementById("leaderboard-screen");
let leaderboardList = document.getElementById("leaderboard-list");
let leaderboardNameEntry = document.getElementById("leaderboard-name-entry");
let leaderboardNameInput = document.getElementById("leaderboard-name-input");

let runStartTime = null;
let finishedRunTime = null;
let goodEndingReached = false;
let leaderboardSavedThisRun = false;

const LEADERBOARD_KEY = "whisperingWoodsLeaderboard";

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
    characterSpeed: 16
    // normal: 8
};

let gameStarted = false;

// MAPS
let mapRow = 1;
let mapCol = 1;

const MAPS = [
    ["./img/field-map.png", "./img/CaveUndWeg.png", "./img/canyon.png"],
    ["./img/UmgefallenerBaum.png", "./img/StartMap.png", "./img/Eule-Map.png"],
    ["./img/CaveUndWeg.png", "./img/bear-map.png", "./img/farm.png"]
];

// WALLS
function rectsOverlap(r1, r2) {
    return !(
        r1.right <= r2.left ||
        r1.left >= r2.right ||
        r1.bottom <= r2.top ||
        r1.top >= r2.bottom
    );
}

function getCurrentMapKey() {
    return `${mapRow}-${mapCol}`;
}

function getWallsForCurrentMap() {
    const mapKey = getCurrentMapKey();
    let walls = [...(MAP_WALLS[mapKey] || [])];

    if (mapKey === "1-2" && owlChoice === "up") {
        // Sperrt den Weg nach unten
        walls.push({ left: 620, top: 440, width: 400, height: 90 });
    }

    if (mapKey === "1-2" && owlChoice === "down") {
        // Sperrt den Weg nach oben
        walls.push({ left: 620, top: 200, width: 400, height: 90 });
    }

    return walls;
}

function wouldCollideWithAnyWall(nextLeft, nextTop) {
    const playerRect = {
        left: nextLeft,
        top: nextTop,
        right: nextLeft + PLAYER.box.clientWidth,
        bottom: nextTop + PLAYER.box.clientHeight
    };

    const walls = getWallsForCurrentMap();

    for (const wall of walls) {
        const wallRect = {
            left: wall.left,
            top: wall.top,
            right: wall.left + wall.width,
            bottom: wall.top + wall.height
        };

        if (rectsOverlap(playerRect, wallRect)) {
            return true;
        }
    }

    return false;
}

const MAP_WALLS = {
    // StartMap
    "1-1": [
        { left: 0, top: 0, width: 300, height: 320 },
        { left: 300, top: 0, width: 315, height: 200 },
        { left: 1010, top: 0, width: 450, height: 290 },
        { left: 750, top: 0, width: 450, height: 190 },
        { left: 0, top: 475, width: 280, height: 540 },
        { left: 280, top: 660, width: 280, height: 240 },
        { left: 1180, top: 440, width: 420, height: 550 },
        { left: 800, top: 650, width: 420, height: 340 }
    ],

    // Wolf
    "1-0": [
        { left: 0, top: 0, width: 1600, height: 320 },
        { left: 0, top: 470, width: 1600, height: 460 },
        { left: 550, top: 180, width: 180, height: 500 }
    ],

    // Eule
    "1-2": [
        { left: 0, top: 0, width: 700, height: 290 },
        { left: 0, top: 440, width: 700, height: 620 },
        { left: 830, top: 0, width: 700, height: 1290 }
    ],

    // verschiedene Wege
    "0-1": [
        { left: 0, top: 0, width: 1050, height: 350 },
        { left: 0, top: 487, width: 610, height: 400 },
        { left: 750, top: 487, width: 700, height: 400 },
        { left: 900, top: 0, width: 610, height: 200 },
        { left: 1170, top: 0, width: 400, height: 350 }
    ],

    // Canyon
    "0-2": [
        { left: 0, top: 0, width: 1050, height: 350 },
        { left: 230, top: 0, width: 1050, height: 400 },
        { left: 0, top: 487, width: 690, height: 400 },
        { left: 830, top: 0, width: 700, height: 1290 }
    ],

    // Bittersweet Ending
    "0-0": [
        { left: 500, top: 0, width: 1050, height: 350 },
        { left: 500, top: 500, width: 1050, height: 450 }
    ],

    // Bär
    "2-1": [
        { left: 0, top: 0, width: 575, height: 1550 },
        { left: 800, top: 0, width: 575, height: 1550 },
        { left: 0, top: 425, width: 1575, height: 50 }
    ],

    // Farm
    "2-2": [
        { left: 830, top: 0, width: 700, height: 1290 },
        { left: 0, top: 0, width: 700, height: 1290 }
    ]
};

function movePlayer(dx, dy, dr) {
    let currentX = parseFloat(PLAYER.box.style.left);
    let currentY = parseFloat(PLAYER.box.style.top);

    if (isNaN(currentX)) currentX = 650;
    if (isNaN(currentY)) currentY = 400;

    let nextX = currentX + dx;
    let nextY = currentY + dy;

    // OWL
    if (
        mapRow === 1 &&
        mapCol === 2 &&
        nextX >= 730 &&
        nextX <= 760 &&
        nextY >= 310 &&
        nextY <= 370 &&
        !owlDialogueFinished
    ) {
        thoughtNextButton.style.display = "block";
        thoughts.style.top = "30%";
        owlConversation();
        return;
    }

    if ((mapRow === 2 && mapCol === 2) || (mapRow === 0 && mapCol === 2)) {
        thoughtNextButton.style.display = "none";
        thoughts.style.top = "40%";
    }

    // CAVE DEATH
    if (
        mapRow === 0 &&
        mapCol === 1 &&
        nextX >= 1000 &&
        nextX <= 1185 &&
        nextY >= 265 &&
        nextY <= 290
    ) {
        PLAYER.box.style.left = nextX + "px";
        PLAYER.box.style.top = nextY + "px";
        showCaveDeath();
        return;
    }

    // Linke Brücke
    if (mapRow === 0 && mapCol === 2 && dx > 0 && nextX >= 380 && !bridgeBroken) {
        PLAYER.box.style.left = nextX + "px";
        PLAYER.box.style.top = currentY + "px";
        showBrokenBridgeDeath();
        return;
    }

    // Untere Brücke
    if (mapRow === 0 && mapCol === 2 && dy < 0 && nextY <= 660 && !bridgeBroken) {
        PLAYER.box.style.left = currentX + "px";
        PLAYER.box.style.top = nextY + "px";
        showBrokenBridgeDeath();
        return;
    }

    if (mapRow === 0 && mapCol === 0 && nextX < 120) {
        showGameOverBittersweet();
        return;
    }

    if (nextX < 0) {
        changeMap("left");
        nextX = window.innerWidth - PLAYER.box.offsetWidth - 10;
    } else if (nextX > window.innerWidth - PLAYER.box.offsetWidth) {
        changeMap("right");
        nextX = 10;
    } else if (dx !== 0 && wouldCollideWithAnyWall(nextX, currentY)) {
        nextX = currentX;
    }

    if (nextY < 0) {
        changeMap("up");
        nextY = window.innerHeight - PLAYER.box.offsetHeight - 10;
    } else if (nextY > window.innerHeight - PLAYER.box.offsetHeight) {
        changeMap("down");
        nextY = 10;
    } else if (dy !== 0 && wouldCollideWithAnyWall(nextX, nextY)) {
        nextY = currentY;
    }

    PLAYER.box.style.left = nextX + "px";
    PLAYER.box.style.top = nextY + "px";

    if (isTouchingCup()) {
        showGameOverGoodEnding();
        return;
    }

    if (dr !== 0) {
        PLAYER.spriteDirection = dr;
    }
}

// DEBUGGING WALLS SICHTBAR MACHEN

function drawVisibleWalls() {
    document.querySelectorAll(".wall-visible").forEach(wall => wall.remove());
    const walls = getWallsForCurrentMap();
    for (const wall of walls) {
        const visibleWall = document.createElement("div");
        visibleWall.className = "wall-visible";
        visibleWall.style.left = wall.left + "px";
        visibleWall.style.top = wall.top + "px";
        visibleWall.style.width = wall.width + "px";
        visibleWall.style.height = wall.height + "px";
        document.body.appendChild(visibleWall);
    }
}

function updateMapBackground() {
    if (mapRow === 0 && mapCol === 2 && bridgeBroken) {
        document.body.style.backgroundImage = "url('./img/broken-bridge.png')";
    } else {
        document.body.style.backgroundImage = `url('${MAPS[mapRow][mapCol]}')`;
    }

    updateWolfVisibility();
    updatePortalVisibility();
    updateCupVisibility()
    drawVisibleWalls();
}

// OWL

function updateDialogueStyle(dialogueId) {
    if (dialogueId === 17 || dialogueId === 20) {
        thoughtBubble.style.backgroundColor = "#34feed";
        bubblePic.src = "./img/exclamation-mark.png";
    } else {
        thoughtBubble.style.backgroundColor = "#772f2f";
        bubblePic.src = "./img/owl.png";
    }
}

function owlConversation() {
    if (owlDialogueActive || owlDialogueFinished) {
        return;
    }

    owlDialogueActive = true;
    gameStarted = false;

    KEY_EVENTS.leftArrow = false;
    KEY_EVENTS.rightArrow = false;
    KEY_EVENTS.upArrow = false;
    KEY_EVENTS.downArrow = false;

    owlDialogueIndex = 0;

    thoughtBubble.style.display = "flex";
    thoughtBubble.style.animation = "fadeInThought 0.75s ease forwards";

    thoughtChoiceButtons.style.display = "none";
    thoughtNextButton.style.display = "inline-block";

    loadThoughtById(OWL_DIALOGUE_IDS[owlDialogueIndex]);
    updateDialogueStyle(OWL_DIALOGUE_IDS[owlDialogueIndex]);
}

function nextOwlDialogue() {
    if (!owlDialogueActive) {
        return;
    }

    owlDialogueIndex++;

    if (owlDialogueIndex >= OWL_DIALOGUE_IDS.length) {
        owlDialogueIndex = OWL_DIALOGUE_IDS.length - 1;
    }

    const currentDialogueId = OWL_DIALOGUE_IDS[owlDialogueIndex];

    loadThoughtById(currentDialogueId);
    updateDialogueStyle(currentDialogueId);

    if (currentDialogueId === 23) {
        thoughtNextButton.style.display = "none";
        thoughtChoiceButtons.style.display = "flex";
    }
}

function chooseOwlPath(direction) {
    owlDialogueActive = false;
    owlDialogueFinished = true;
    owlChoice = direction;

    thoughtBubble.style.display = "none";
    thoughtChoiceButtons.style.display = "none";
    thoughtNextButton.style.display = "inline-block";

    thoughtBubble.style.backgroundColor = "#34feed";
    bubblePic.src = "./img/exclamation-mark.png";

    drawVisibleWalls();

    gameStarted = true;
    gameLoop();
}

// KEYBOARD INPUT
document.onkeydown = keyListenerDown;
document.onkeyup = keyListenerUp;

function keyListenerDown(e) {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        KEY_EVENTS.leftArrow = true;
        KEY_EVENTS.rightArrow = false;
        KEY_EVENTS.upArrow = false;
        KEY_EVENTS.downArrow = false;
    }

    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        KEY_EVENTS.leftArrow = false;
        KEY_EVENTS.rightArrow = false;
        KEY_EVENTS.upArrow = true;
        KEY_EVENTS.downArrow = false;
    }

    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        KEY_EVENTS.leftArrow = false;
        KEY_EVENTS.rightArrow = true;
        KEY_EVENTS.upArrow = false;
        KEY_EVENTS.downArrow = false;
    }

    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        KEY_EVENTS.leftArrow = false;
        KEY_EVENTS.rightArrow = false;
        KEY_EVENTS.upArrow = false;
        KEY_EVENTS.downArrow = true;
    }

}

function keyListenerUp(e) {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        KEY_EVENTS.leftArrow = false;
    }

    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        KEY_EVENTS.upArrow = false;
    }

    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        KEY_EVENTS.rightArrow = false;
    }

    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        KEY_EVENTS.downArrow = false;
    }
}

// CHARACTER SELECTION
function selectCharacter(characterNumber) {
    PLAYER.spriteImg.src = "./img/sprite.png";

    if (characterNumber === 1) {
        // Ziege
        PLAYER.spriteStartRight = 0;

        bittersweetEndingSrcOne = "./img/goat-bittersweet-sceen1.png";
        bittersweetEndingSrcTwo = "./img/goat-bittersweet-sceen2.png";
        caveEndingSrcOne = "./img/goat-cave-sceen1.png";
        caveEndingSrcTwo = "./img/goat-cave-sceen2.png";
    }

    if (characterNumber === 2) {
        // Weißes Schaf
        PLAYER.spriteStartRight = 150;

        bittersweetEndingSrcOne = "./img/sheep-bittersweet-sceen1.png";
        bittersweetEndingSrcTwo = "./img/sheep-bittersweet-sceen2.png";
        caveEndingSrcOne = "./img/sheep-cave-sceen1.png";
        caveEndingSrcTwo = "./img/sheep-cave-sceen2.png";
    }

    if (characterNumber === 3) {
        // Schwarzes Schaf
        PLAYER.spriteStartRight = 450;

        bittersweetEndingSrcOne = "./img/sheepB-bittersweet-sceen1.png";
        bittersweetEndingSrcTwo = "./img/sheepB-bittersweet-sceen2.png";
        caveEndingSrcOne = "./img/sheepB-cave-sceen1.png";
        caveEndingSrcTwo = "./img/sheepB-cave-sceen2.png";
    }

    playerChoose.style.display = "none";
    characterSelection.style.display = "none";

    PLAYER.box.style.display = "block";

    PLAYER.box.style.left = "650px";
    PLAYER.box.style.top = "400px";

    PLAYER.spriteImgNumber = 0;
    PLAYER.spriteImg.style.right = PLAYER.spriteStartRight + "px";
    PLAYER.spriteImg.style.top = "-330px";

    fogDown.style.transition = "top 1.2s ease-in-out";
    fogDown.style.top = "100%";

    fogUp.style.transition = "top 1.2s ease-in-out";
    fogUp.style.top = "-100%";

    thoughtBubble.style.display = "flex";
    thoughtBubble.style.animation = "fadeInThought 0.75s ease 1s forwards";

    // Zeit aufzeichenn
    runStartTime = Date.now();
    finishedRunTime = null;
    goodEndingReached = false;
    leaderboardSavedThisRun = false;

    gameStarted = true;
    gameLoop();

    PLAYER.spriteImgNumber = 0;
    PLAYER.spriteImg.style.right = PLAYER.spriteStartRight + "px";
    PLAYER.spriteImg.style.top = "-330px";

    healthBar.style.transition = "opacity 1.5s ease";
    healthBar.style.opacity = "1";

    mapRow = 1;
    mapCol = 1;

    wolfImg.src = "./img/wolf-sprite.png";
    WOLF.x = 950;
    WOLF.y = 390;
    WOLF.frame = 0;
    WOLF.lastDamageTime = 0;

    PLAYER_STATE.healthStage = 4;
    updateHealthBar();

    bridgeBroken = false;
    updateMapBackground();
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

// CHANGE MAP & THOUGHT
function changeMap(direction) {
    if (direction === "left" && mapCol > 0) {
        mapCol--;
        thoughtBubble.style.animation = "none";
        thoughtBubble.offsetWidth;
        thoughtBubble.style.display = "flex";
        thoughtBubble.style.animation = "fadeInThought 0.75s ease 0.3s forwards";
    }

    if (direction === "right" && mapCol < MAPS[0].length - 1) {
        mapCol++;

        thoughtBubble.style.animation = "none";
        thoughtBubble.offsetWidth;
        thoughtBubble.style.display = "flex";
        thoughtBubble.style.animation = "fadeInThought 0.75s ease 0.3s forwards";
    }

    if (direction === "up" && mapRow > 0) {
        mapRow--;
        thoughtBubble.style.animation = "none";
        thoughtBubble.offsetWidth;
        thoughtBubble.style.display = "flex";
        thoughtBubble.style.animation = "fadeInThought 0.75s ease 0.3s forwards";
    }

    if (direction === "down" && mapRow < MAPS.length - 1) {
        mapRow++;

        thoughtBubble.style.animation = "none";
        thoughtBubble.offsetWidth;
        thoughtBubble.style.display = "flex";
        thoughtBubble.style.animation = "fadeInThought 0.75s ease 0.3s forwards";
    }

    if (mapRow === 1 && mapCol === 1) {
        loadThoughtById(1);
    }

    if (mapRow === 1 && mapCol === 2) {
        loadThoughtById(5);
    }

    if (mapRow === 1 && mapCol === 0) {
        loadThoughtById(3);
    }

    if (mapRow === 0 && mapCol === 1) {
        loadThoughtById(4);
    }

    if (mapRow === 0 && mapCol === 0) {
        loadThoughtById(6);
    }

    if (mapRow === 0 && mapCol === 2) {
        loadThoughtById(7);
    }

    if (mapRow === 2 && mapCol === 2) {
        loadThoughtById(8);
    }

    updateMapBackground();
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

    updateWolf();
    updateWolfDamage();

    setTimeout(gameLoop, 1000 / GAME_CONFIG.gameSpeed);
}

// STARTBUTTON
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

    // der button soll dann einen animation haben dass er verschwindet

    bgmButton.style.transition = "opacity 0.5s ease, top 0.9s ease";
    bgmButton.style.opacity = "0";
    bgmButton.style.top = "0";

    loadThoughtById(1);
}

// WOLF
let wolf = document.getElementById("wolf");
let wolfImg = document.getElementById("wolf-img");
let health = document.getElementById("health");

let WOLF = {
    x: 900,
    y: 390,
    frame: 0,
    frameCount: 4,
    frameWidth: 85,
    animTick: 0,
    speed: 6,
    active: false,
    lastDamageTime: 0
};

let PLAYER_STATE = {
    healthStage: 4
};

function updateWolfVisibility() {
    if (mapRow === 1 && mapCol === 0) {
        wolf.style.display = "block";
        WOLF.active = true;
        wolf.style.left = WOLF.x + "px";
        wolf.style.top = WOLF.y + "px";
    } else {
        wolf.style.display = "none";
        WOLF.active = false;
    }
}

function animateWolf() {
    if (!WOLF.active) {
        return;
    }

    WOLF.animTick++;

    if (WOLF.animTick % 5 !== 0) {
        return;
    }

    WOLF.frame++;
    if (WOLF.frame >= WOLF.frameCount) {
        WOLF.frame = 0;
    }

    wolfImg.style.left = -(WOLF.frame * WOLF.frameWidth) + "px";
}

function updateWolf() {
    if (!WOLF.active) {
        return;
    }

    let playerX = parseFloat(PLAYER.box.style.left);
    let playerY = parseFloat(PLAYER.box.style.top);

    if (isNaN(playerX) || isNaN(playerY)) {
        return;
    }

    if (WOLF.x < playerX - 20) {
        WOLF.x += WOLF.speed;
    }

    if (WOLF.x > playerX + 20) {
        WOLF.x -= WOLF.speed;
    }

    if (WOLF.y < playerY - 10) {
        WOLF.y += 3;
    }

    if (WOLF.y > playerY + 10) {
        WOLF.y -= 3;
    }

    wolf.style.left = WOLF.x + "px";
    wolf.style.top = WOLF.y + "px";

    animateWolf();
}

function isWolfTouchingPlayer() {
    const playerRect = {
        left: PLAYER.box.offsetLeft,
        top: PLAYER.box.offsetTop,
        right: PLAYER.box.offsetLeft + PLAYER.box.clientWidth,
        bottom: PLAYER.box.offsetTop + PLAYER.box.clientHeight
    };

    const wolfRect = {
        left: wolf.offsetLeft,
        top: wolf.offsetTop,
        right: wolf.offsetLeft + wolf.clientWidth,
        bottom: wolf.offsetTop + wolf.clientHeight
    };

    return rectsOverlap(playerRect, wolfRect);
}

function updateWolfDamage() {
    if (!WOLF.active) {
        return;
    }

    if (!isWolfTouchingPlayer()) {
        return;
    }

    const now = Date.now();  // mit ki geholfen

    if (now - WOLF.lastDamageTime >= 1000) {
        WOLF.lastDamageTime = now;

        if (PLAYER_STATE.healthStage > 1) {
            PLAYER_STATE.healthStage--;
            updateHealthBar();
        }
    }
}

// HEALTHBAR
function updateHealthBar() {
    if (PLAYER_STATE.healthStage === 4) {
        health.src = "./img/healthbar-full.png";
    }

    if (PLAYER_STATE.healthStage === 3) {
        health.src = "./img/healthbar-half.png";
    }

    if (PLAYER_STATE.healthStage === 2) {
        health.src = "./img/healthbar-low.png";
    }

    if (PLAYER_STATE.healthStage <= 1) {
        health.src = "./img/healthbar-gone.png";
        showGameOverWolfEnding();
    }
}


// PORTAL
let portal = document.getElementById("portal");

function updatePortalVisibility() {
    if (mapRow === 0 && mapCol === 2) {
        portal.style.display = "block";
    } else {
        portal.style.display = "none";
    }
}

// POKAL
let cup = document.getElementById("cup");

function updateCupVisibility() {
    if (mapRow === 2 && mapCol === 2) {
        cup.style.display = "block";
    } else {
        cup.style.display = "none";
    }
}


// BITTERSWEET ENDING
function showGameOverBittersweet() {
    gameStarted = false;

    KEY_EVENTS.leftArrow = false;
    KEY_EVENTS.rightArrow = false;
    KEY_EVENTS.upArrow = false;
    KEY_EVENTS.downArrow = false;

    // Ende nicht erreicht: kein Leaderboard
    leaderboardScreen.style.display = "none";
    gameOverBox.style.display = "block";
    goodEndingReached = false;

    gameOverScreen.style.display = "flex";
    gameOverScreen.style.animation = "gameOverBlackScreen 0.5s ease forwards";

    gameOverBox.style.backgroundImage = "url('./img/BittersweetEnding.png')";
    endingText.textContent = "You ran in the meadow but never found the farm. You started a new life and tried to survive in the wilderness. You do well for a while and occasionally find other animals to befriend. Five months later, you go out one day to look for food and are attacked by a wolf pack. You and your friends died.";

    gameOverBox.style.animation = "gameOverFlyIn 0.8s ease 0.4s forwards";
}

// LEADERBOARD
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getLeaderboardEntries() {
    const raw = localStorage.getItem(LEADERBOARD_KEY);

    if (!raw) {
        return [];
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        return [];
    }
}

function saveLeaderboardEntries(entries) {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
}

function addLeaderboardEntry(name, timeMs) {
    const entries = getLeaderboardEntries();

    entries.push({
        name: name,
        timeMs: timeMs
    });

    entries.sort((a, b) => a.timeMs - b.timeMs);
    saveLeaderboardEntries(entries.slice(0, 10));
}

function renderLeaderboard() {
    const entries = getLeaderboardEntries();

    if (entries.length === 0) {
        leaderboardList.innerHTML = "<p>No times saved yet.</p>";
        return;
    }

    let html = "<ol>";

    for (const entry of entries) {
        html += `<li>${entry.name} — ${formatTime(entry.timeMs)}</li>`;
    }

    html += "</ol>";
    leaderboardList.innerHTML = html;
}

function openLeaderboard() {
    gameOverBox.style.display = "none";
    leaderboardScreen.style.display = "flex";

    if (goodEndingReached && !leaderboardSavedThisRun && finishedRunTime !== null) {
        leaderboardList.style.display = "none";
        leaderboardNameEntry.style.display = "flex";
        leaderboardNameInput.value = "";
        leaderboardNameInput.focus();
    } else {
        leaderboardNameEntry.style.display = "none";
        leaderboardList.style.display = "block";
        renderLeaderboard();
    }
}

function saveLeaderboardName() {
    let playerName = leaderboardNameInput.value.trim();

    if (playerName === "") {
        playerName = "Anonymous";
    }

    addLeaderboardEntry(playerName, finishedRunTime);
    leaderboardSavedThisRun = true;

    leaderboardNameEntry.style.display = "none";
    leaderboardList.style.display = "block";
    renderLeaderboard();
}

function closeLeaderboard() {
    leaderboardScreen.style.display = "none";
    leaderboardNameEntry.style.display = "none";
    leaderboardList.style.display = "none";
    gameOverBox.style.display = "block";
}

// GOOD ENDING
function showGameOverGoodEnding() {
    gameStarted = false;

    KEY_EVENTS.leftArrow = false;
    KEY_EVENTS.rightArrow = false;
    KEY_EVENTS.upArrow = false;
    KEY_EVENTS.downArrow = false;

    if (runStartTime !== null && finishedRunTime === null) {
        finishedRunTime = Date.now() - runStartTime;
    }

    goodEndingReached = true;

    gameOverScreen.style.display = "flex";
    gameOverScreen.style.animation = "gameOverBlackScreen 0.5s ease forwards";

    leaderboardScreen.style.display = "none";
    gameOverBox.style.display = "block";

    gameOverBox.style.backgroundImage = "url('./img/GoodEnding.png')";
    endingText.textContent = "You found the farm and got back home. All your friends are happy to see you again. You will spend the rest of your life happily on the farm. Congratulations!";

    gameOverBox.style.animation = "gameOverFlyIn 0.8s ease 0.4s forwards";
}

function isTouchingCup() {
    if (mapRow !== 2 || mapCol !== 2) {
        return false;
    }

    const playerRect = {
        left: PLAYER.box.offsetLeft,
        top: PLAYER.box.offsetTop,
        right: PLAYER.box.offsetLeft + PLAYER.box.clientWidth,
        bottom: PLAYER.box.offsetTop + PLAYER.box.clientHeight
    };

    const cupRect = {
        left: cup.offsetLeft,
        top: cup.offsetTop,
        right: cup.offsetLeft + cup.clientWidth,
        bottom: cup.offsetTop + cup.clientHeight
    };

    return rectsOverlap(playerRect, cupRect);
}

// BAD ENDING (Wolf)
function showGameOverWolfEnding() {
    gameStarted = false;

    KEY_EVENTS.leftArrow = false;
    KEY_EVENTS.rightArrow = false;
    KEY_EVENTS.upArrow = false;
    KEY_EVENTS.downArrow = false;

    leaderboardScreen.style.display = "none";
    gameOverBox.style.display = "block";
    goodEndingReached = false;

    gameOverScreen.style.display = "flex";
    gameOverScreen.style.animation = "gameOverBlackScreen 0.5s ease forwards";

    gameOverBox.style.backgroundImage = "url('./img/BadEnding.png')";
    endingText.innerHTML = "You died.<br>You got eaten by the wolf and never found the farm.";

    gameOverBox.style.animation = "gameOverFlyIn 0.8s ease 0.4s forwards";


}

// BAD ENDING (Brücke)
function showBrokenBridgeDeath() {
    bridgeBroken = true;
    document.body.style.backgroundImage = "url('./img/broken-bridge.png')";

    gameStarted = false;

    KEY_EVENTS.leftArrow = false;
    KEY_EVENTS.rightArrow = false;
    KEY_EVENTS.upArrow = false;
    KEY_EVENTS.downArrow = false;

    leaderboardScreen.style.display = "none";
    gameOverBox.style.display = "block";
    goodEndingReached = false;

    setTimeout(() => {
        PLAYER.box.style.animation = "deathAnimation 0.6s ease forwards";

        gameOverScreen.style.display = "flex";
        gameOverScreen.style.animation = "gameOverBlackScreen 0.5s ease forwards";

        gameOverBox.style.backgroundImage = "url('./img/BadEnding.png')";
        endingText.innerHTML = "You died.<br>The bridge broke and you fell <br>into the abyss.";

        gameOverBox.style.animation = "gameOverFlyIn 0.8s ease 0.4s forwards";
    }, 600);
}

// BAD ENDING (Höhle)
function showCaveDeath() {
    gameStarted = false;

    KEY_EVENTS.leftArrow = false;
    KEY_EVENTS.rightArrow = false;
    KEY_EVENTS.upArrow = false;
    KEY_EVENTS.downArrow = false;

    leaderboardScreen.style.display = "none";
    gameOverBox.style.display = "block";
    goodEndingReached = false;

    PLAYER.box.style.display = "none";

    setTimeout(() => {
        gameOverScreen.style.display = "flex";
        gameOverScreen.style.animation = "gameOverBlackScreen 0.7s ease forwards";
        deathscreens.innerHTML = `<img src="${caveEndingSrcOne}" style="width: 100%; height: auto; opacity: 0; animation: deathScreenOne 0.7s ease forwards">
                                <img src="${caveEndingSrcTwo}" style="width: 100%; height: auto; opacity: 0; animation: deathScreenTwo 0.7s ease forwards">`;
    }, 650);

    setTimeout(() => {
        gameOverBox.style.backgroundImage = "url('./img/BadEnding.png')";
        endingText.innerHTML = "You went into the cave and explored it. After a while, you realized you were lost in the dark and couldn't find your way out. <br>You starved to death in the cave and never made it back to the farm.";
        gameOverBox.style.animation = "gameOverFlyIn 0.8s ease 0.4s forwards";
    }, 5000);
}