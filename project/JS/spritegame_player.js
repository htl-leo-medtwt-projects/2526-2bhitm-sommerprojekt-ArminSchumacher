/***********************************
 * PLAYER
 ***********************************/
let PLAYER = {
    box: document.getElementById('player'),
    spriteImg: document.getElementById('spriteImg'),
    spriteImgNumber: 0, // current animation frame of sprite image
    spriteDirection: 1,
    dotsCount: 0
}


/***********************************
 * MOVE
 * **********************************/
/**
 * @param {number} dx - player x move offset in pixel
 * @param {number} dy - player y move offset in pixel
 * @param {number} dr - player heading direction (-1: look left || 1: look right)
 */

// Walls collision
function getWalls() {
    return Array.from(document.querySelectorAll(".wall"));
}

function rectsOverlap(r1, r2) {
    return !(
        r1.right <= r2.left ||
        r1.left >= r2.right ||
        r1.bottom <= r2.top ||
        r1.top >= r2.bottom
    );
}

function wouldCollideWithAnyWall(nextLeft, nextTop) {
    let playerRect = {
        left: nextLeft,
        top: nextTop,
        right: nextLeft + PLAYER.box.clientWidth,
        bottom: nextTop + PLAYER.box.clientHeight
    };

    let margin = 4;

    for (let wall of getWalls()) {
        let wallRect = {
            left: wall.offsetLeft + margin,
            top: wall.offsetTop + margin,
            right: wall.offsetLeft + wall.clientWidth + margin + 8,
            bottom: wall.offsetTop + wall.clientHeight + margin + 8
        };

        if (rectsOverlap(playerRect, wallRect)) return true;
    }
    return false;
}

function movePlayer(dx, dy, dr) {
    let currentX = parseFloat(PLAYER.box.style.left);
    let currentY = parseFloat(PLAYER.box.style.top);

    // --- erst X testen ---
    let nextX = currentX + dx;
    // Grenzen (surface)
    if (nextX < 0) nextX = 0;
    if (nextX > GAME_SCREEN.surface.clientWidth - PLAYER.box.clientWidth) {
        nextX = GAME_SCREEN.surface.clientWidth - PLAYER.box.clientWidth;
    }

    // wenn X-Shift in Wand -> X blocken
    if (dx !== 0 && wouldCollideWithAnyWall(nextX, currentY)) {
        nextX = currentX;
    }

    // --- dann Y testen (mit finalem X) ---
    let nextY = currentY + dy;
    if (nextY < 0) nextY = 0;
    if (nextY > GAME_SCREEN.surface.clientHeight - PLAYER.box.clientHeight) {
        nextY = GAME_SCREEN.surface.clientHeight - PLAYER.box.clientHeight;
    }

    // wenn Y-Shift in Wand -> Y blocken
    if (dy !== 0 && wouldCollideWithAnyWall(nextX, nextY)) {
        nextY = currentY;
    }

    let moved = (nextX !== currentX) || (nextY !== currentY);

    // Position setzen
    if (moved) {
        PLAYER.box.style.left = nextX + "px";
        PLAYER.box.style.top = nextY + "px";
    }

    if (dx !== 0 || dy !== 0) {
        let transform = "";

        if (dr === -1) transform = "scaleX(-1) rotate(0deg)";
        else if (dr === 1) transform = "scaleX(1) rotate(0deg)";

        if (dy < 0) transform = "rotate(-90deg)";
        if (dy > 0) transform = "rotate(90deg)";

        PLAYER.box.style.transform = transform;
    }

    if (GAME_SCREEN.debug_output) {
        GAME_SCREEN.debug_output.innerHTML =
            `x: ${PLAYER.box.style.left} | y: ${PLAYER.box.style.top} | direction: ${dr} | animation: ${PLAYER.spriteImgNumber} | count: ${PLAYER.dotsCount}`;
    }
}


/***********************************
 * ANIMATE PLAYER
 * **********************************/
function animatePlayer() {
    if (PLAYER.spriteImgNumber < 1) { // switch to next sprite position
        PLAYER.spriteImgNumber++;
        let x = parseFloat(PLAYER.spriteImg.style.right);
        x += 27.0; // ANPASSEN!
        PLAYER.spriteImg.style.right = x + "px";
    } else { // animation loop finished: back to start animation
        PLAYER.spriteImg.style.right = "0px";
        PLAYER.spriteImgNumber = 0;
    }
}


function checkDotCollision() {
    GAME_SCREEN.dots.forEach(dot => {

        // wenn schon eingesammelt --> ignorieren
        if (dot.style.opacity == "0") {
            return;
        }

        if (isColliding(PLAYER.box, dot, -8)) {
            dot.style.opacity = "0";
            dot.style.animation = "none";
            PLAYER.dotsCount++;
            checkWinCondition();
            collectSound.play();
        }
    });
}

let collectSound = new Audio('audio/collecting.mp3');
collectSound.volume = 0.5;
collectSound.loop = false;

function checkWinCondition() {
    if (PLAYER.dotsCount === GAME_SCREEN.totalDots) {
        showWinBox();
    }
}

let winSound = new Audio('audio/win.mp3');
winSound.volume = 0.8;

function showWinBox() {
    document.getElementById("winBox").classList.add("show");

    // Timer stoppen + echte Zeit merken
    if (typeof timerStartMs !== "undefined") {
        const elapsedMs = performance.now() - timerStartMs;
        finalTimeSeconds = elapsedMs / 1000;
        stopTimer();
    }

    const elapsedMs = performance.now() - timerStartMs;
    finalTimeSeconds = elapsedMs / 1000;
    endRound(finalTimeSeconds);

    // Spiel stoppen
    KEY_EVENTS.leftArrow = false;
    KEY_EVENTS.rightArrow = false;
    KEY_EVENTS.upArrow = false;
    KEY_EVENTS.downArrow = false;

    runningSound.pause();
    winSound.play();
}
