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
let healthBar = document.getElementById("health-bar");

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
    characterSpeed: 25
    // normal: 5
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

//neu
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
    return MAP_WALLS[mapKey] || [];
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

    // zuerst X testen
    let nextX = currentX + dx;

    // Map-Wechsel links/rechts
    if (nextX < 0) {
        changeMap("left");
        nextX = window.innerWidth - PLAYER.box.offsetWidth - 10;
    } else if (nextX > window.innerWidth - PLAYER.box.offsetWidth) {
        changeMap("right");
        nextX = 10;
    } else if (dx !== 0 && wouldCollideWithAnyWall(nextX, currentY)) {
        nextX = currentX;
    }

    // dann Y testen
    let nextY = currentY + dy;

    // Map-Wechsel oben/unten
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

    if (dr !== 0) {
        PLAYER.spriteDirection = dr;
    }
}

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
    document.body.style.backgroundImage = `url('${MAPS[mapRow][mapCol]}')`;
    updateWolfVisibility();
    updatePortalVisibility();
    updateCupVisibility()
    drawVisibleWalls();
}
//neu

// KEYBOARD INPUT
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

    fogDown.style.transition = "top 1.2s ease-in-out";
    fogDown.style.top = "100%";

    fogUp.style.transition = "top 1.2s ease-in-out";
    fogUp.style.top = "-100%";

    thoughtBubble.style.display = "flex";
    thoughtBubble.style.animation = "fadeInThought 0.75s ease 1s forwards";

    gameStarted = true;
    gameLoop();

    PLAYER.spriteImgNumber = 0;
    PLAYER.spriteImg.style.right = PLAYER.spriteStartRight + "px";
    PLAYER.spriteImg.style.top = "-330px";

    healthBar.style.transition = "opacity 1.5s ease";
    healthBar.style.opacity = "1";

    mapRow = 1;
    mapCol = 1;
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

    loadThoughtById(1);
}

// WOLF
let wolf = document.getElementById("wolf");

function updateWolfVisibility() {
    if (mapRow === 1 && mapCol === 0) {
        wolf.style.display = "block";
    } else {
        wolf.style.display = "none";
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