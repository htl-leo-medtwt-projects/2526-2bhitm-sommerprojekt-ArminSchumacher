/***********************************
 * GAME SCREEN
 ***********************************/
let GAME_SCREEN = {
    surface: document.getElementById('surface'),
    surfaceScale: '80%',
    dots: document.querySelectorAll('.dots'),
    totalDots: document.querySelectorAll('.dots').length,
    startButton: document.getElementById('startButton')
}

// Scale the surface to xx% of the screen width
surface.style.transform = `scale(${parseFloat(GAME_SCREEN.surfaceScale) / 100 * (window.innerWidth / surface.clientWidth)})`;


/***********************************
 * GAME CONFIG
 ***********************************/
let GAME_CONFIG = {
    gameSpeed: 24,
    characterSpeed: 8
}

// --- START POSITION  ---
const PLAYER_START = {
    left: 750,
    top: 360
}

// --- TIMER ---
let timerStartMs = 0;
let timerInterval = null;
let finalTimeSeconds = 0;

function formatTime(ms) {
    const totalSec = ms / 1000;
    const min = Math.floor(totalSec / 60);
    const sec = totalSec - min * 60;
    const secStr = sec.toFixed(1).padStart(4, "0"); // 00.0
    return `${String(min).padStart(2, "0")}:${secStr}`;
}

function startTimer() {
    timerStartMs = performance.now();
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        const now = performance.now();
        const elapsed = now - timerStartMs;
        document.getElementById("timer").textContent = formatTime(elapsed);
    }, 100);
}

function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;

    // final seconds fürs leaderboard o.ä.
    const text = document.getElementById("timer").textContent; // nur Anzeige
    // besser: wirklich messen:
    // (wir speichern einfach die echte Zeit)
    // -> wird beim Win gesetzt, siehe unten
}

function resetPlayerToStart() {
    PLAYER.box.style.left = PLAYER_START.left + "px";
    PLAYER.box.style.top = PLAYER_START.top + "px";
}


/***********************************
 * GHOSTS
 ***********************************/
const GHOST_CONFIG = {
    frameW: 39,
    frameH: 38,
    spriteTopRed: -0,
    animFrames: 2,
    animSpeedTicks: 6
};

function wouldGhostCollide(nextLeft, nextTop, ghostBox) {
    const ghostRect = {
        left: nextLeft,
        top: nextTop,
        right: nextLeft + ghostBox.clientWidth,
        bottom: nextTop + ghostBox.clientHeight
    };

    const margin = 4;

    for (const wall of getWalls()) {
        const wallRect = {
            left: wall.offsetLeft + margin,
            top: wall.offsetTop + margin,
            right: wall.offsetLeft + wall.clientWidth + margin + 8,
            bottom: wall.offsetTop + wall.clientHeight + margin + 8
        };

        if (rectsOverlap(ghostRect, wallRect)) return true;
    }
    return false;
}


const GHOSTS = [
    // Horizontaler Geist (links <-> rechts)
    {
        box: document.getElementById("ghostH"),
        img: document.getElementById("ghostHImg"),
        axis: "x",
        speed: 12,
        dir: 1,
        min: 10,
        max: 1000,
        fixed: 27,
        tick: 0,
        frame: 0
    },

    // Vertikaler Geist (oben <-> unten rechts)
    {
        box: document.getElementById("ghostV"),
        img: document.getElementById("ghostVImg"),
        axis: "y",
        speed: 12,
        dir: 1,
        min: 20,
        max: 250,
        fixed: 660,
        tick: 0,
        frame: 0
    }
];

function initGhosts() {
    for (const g of GHOSTS) {
        g.box.style.width = GHOST_CONFIG.frameW + "px";
        g.box.style.height = GHOST_CONFIG.frameH + "px";

        // Startposition
        if (g.axis == "x") {
            g.box.style.left = g.min + "px";
            g.box.style.top = g.fixed + "px";
        } else {
            g.box.style.left = g.fixed + "px";
            g.box.style.top = g.min + "px";
        }

    }
}

function animateGhost(g) {
    g.tick++;
    if (g.tick % GHOST_CONFIG.animSpeedTicks !== 0) return;

    g.frame = (g.frame + 1) % GHOST_CONFIG.animFrames;

    // Frame-Wechsel: wir verschieben das Sprite horizontal
    // (Wenn du andere Richtung / mehr Frames hast, sag kurz wie dein Sheet aufgebaut ist)
    g.img.style.left = (-g.frame * GHOST_CONFIG.frameW) + "px";
}

function updateGhosts() {
    for (const g of GHOSTS) {
        let x = parseFloat(g.box.style.left || "0");
        let y = parseFloat(g.box.style.top || "0");

        if (g.axis == "x") {
            // Ziel-Position für den nächsten Step
            let nextX = x + g.speed * g.dir;

            // harte Bahn-Grenzen
            if (nextX <= g.min) { nextX = g.min; g.dir = 1; }
            if (nextX >= g.max) { nextX = g.max; g.dir = -1; }

            // Wall-Collision: wenn nextX in Wand -> Richtung umdrehen
            if (wouldGhostCollide(nextX, y, g.box)) {
                g.dir *= -1; // umdrehen
                nextX = x + g.speed * g.dir; // einmal in neue Richtung probieren

                // wenn immer noch Wand -> stehen bleiben
                if (wouldGhostCollide(nextX, y, g.box)) {
                    nextX = x;
                }
            }

            g.box.style.left = nextX + "px";
            g.box.style.top = g.fixed + "px";
        }

        if (g.axis == "y") {
            let nextY = y + g.speed * g.dir;

            if (nextY <= g.min) { nextY = g.min; g.dir = 1; }
            if (nextY >= g.max) { nextY = g.max; g.dir = -1; }

            if (wouldGhostCollide(x, nextY, g.box)) {
                g.dir *= -1;
                nextY = y + g.speed * g.dir;

                if (wouldGhostCollide(x, nextY, g.box)) {
                    nextY = y;
                }
            }

            g.box.style.top = nextY + "px";
            g.box.style.left = g.fixed + "px";
        }

        animateGhost(g);
    }
}

function checkGhostCollision() {

    for (const g of GHOSTS) {
        if (isColliding(PLAYER.box, g.box, -6)) {
            deathSound.play();
            resetPlayerToStart();
            return;
        }
    }
}

let deathSound = new Audio('audio/death.mp3');
deathSound.volume = 0.7;
deathSound.loop = false;


/***********************************
 * START GAME
 * **********************************/

function startGame() {
    initGhosts();

    resetPlayerToStart();
    startTimer();

    PLAYER.box.style.opacity = '1';
    PLAYER.spriteImg.style.right = '0px';
    GAME_SCREEN.dots.forEach(dot => {
        dot.style.animation = "blink 0.5s linear 0s infinite";
    });

    GAME_SCREEN.startButton.innerHTML = 'STARTED';
    GAME_SCREEN.startButton.removeAttribute('onclick');

    surface.style.animation = "flyIn 0.8s ease-in-out forwards";
    surface.style.animationDelay = "0.5s";

    gameLoop();
    playStartSound();
}

let startSound = new Audio('audio/start.mp3');
startSound.volume = 0.8;

function playStartSound() {
    startSound.play();
}


/***********************************
 * GAME LOOP
 * **********************************/
function gameLoop() {
    if (KEY_EVENTS.leftArrow) {
        movePlayer((-1) * GAME_CONFIG.characterSpeed, 0, -1);
        animatePlayer();
    } else if (KEY_EVENTS.rightArrow) {
        movePlayer(GAME_CONFIG.characterSpeed, 0, 1);
        animatePlayer();
    } else if (KEY_EVENTS.upArrow) {
        movePlayer(0, (-1) * GAME_CONFIG.characterSpeed, 0);
        animatePlayer();
    } else if (KEY_EVENTS.downArrow) {
        movePlayer(0, GAME_CONFIG.characterSpeed, 0);
        animatePlayer();
    }

    checkDotCollision();
    updateGhosts();
    checkGhostCollision();

    setTimeout(gameLoop, 1500 / GAME_CONFIG.gameSpeed); // async recursion
}


/***********************************
 * PLAYER NAME + LEADERBOARD
 * **********************************/

const nameInput = document.getElementById("nameInput");
const submit = document.getElementById("submit");
const message = document.getElementById("message");

function loadLeaderboard() {
    return JSON.parse(localStorage.getItem("leaderboard") || "[]");
}

function saveLeaderboard(arr) {
    localStorage.setItem("leaderboard", JSON.stringify(arr));
}

/*input check*/
function updateSubmitState() {
    const valid = nameInput.value.length > 0;
    submit.classList.toggle("disabled", !valid); // hängt von true oder false ab ob die Klasse "disabled" hinzugefügt oder entfernt wird
}

nameInput.addEventListener("input", updateSubmitState);
updateSubmitState();

/*save player*/
submit.addEventListener("click", () => {
    const playerName = nameInput.value;
    if (!playerName) return;

    sessionStorage.setItem("currentPlayer", playerName);
    message.textContent = "Spieler gespeichert. Spiel startet...";

    document.getElementById("uiBox").style.animation = "flyOut 0.5s ease-in-out forwards";

    setTimeout(() => {
        document.getElementById("uiBox").style.display = "none";
    }, 500);

    GAME_SCREEN.startButton.classList.remove("disabled");
});


/* ---------- END ROUND ---------- */
function endRound(timeSeconds) {
    const name = sessionStorage.getItem("currentPlayer") || "Unknown";
    const leaderboard = loadLeaderboard();

    leaderboard.push({
        name: name,
        time: timeSeconds,
        date: new Date().toISOString()
    });

    leaderboard.sort((a, b) => a.time - b.time);

    saveLeaderboard(leaderboard.slice(0, 10));
    renderLeaderboard();
}

function renderLeaderboard() {
    const leaderboard = loadLeaderboard();
    const box = document.getElementById("leaderboard");
    if (!box) return;

    if (leaderboard.length == 0) {
        box.innerHTML = "<h2>Leaderboard</h2><p>No scores yet.</p>";
        return;
    }

    box.innerHTML = `
    <h2>LEADERBOARD</h2>
    <ol>
      ${leaderboard.map(e => `<li>${e.name} – ${Number(e.time).toFixed(1)}s</li>`).join("")}
    </ol>
  `;
}