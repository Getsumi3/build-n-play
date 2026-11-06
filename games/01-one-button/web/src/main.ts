import "./styles/main.scss";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
    throw new Error("Application root element not found.");
}

app.innerHTML = `
  <main class="game">
    <canvas class="game__canvas" id="game-canvas"></canvas>
  </main>
`;

const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");

if (!canvas) {
    throw new Error("Canvas element not found.");
}

const ctx = canvas.getContext("2d");

if (!ctx) {
    throw new Error("Canvas context not found.");
}

type GameStateProps = {
    currentLane: -1 | 1;
    nextLaneX: number;
};
let gameState: GameStateProps = {
    currentLane: -1,
    nextLaneX: 0
};

type PlayerStateProps = {
    transform: {
        position: { x: number; y: number };
        scale: { x: number; y: number };
        rotation: number;
    };
    animationFrameId: number | null;
};
let playerState: PlayerStateProps = {
    transform: {
        position: {
            x: 0,
            y: 0
        },
        scale: {
            x: 1,
            y: 1
        },
        rotation: 0
    },
    animationFrameId: null
};
function resizeCanvas() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    player.setNextX(width, height);
    draw();
}

function draw() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    ctx.clearRect(0, 0, width, height);

    player.init();
    bounds(width, height);
    debugCenterLane(width, height);
}

const player = {
    init() {
        const size = 100 * playerState.transform.scale.x;

        const { x, y } = playerState.transform.position;

        ctx.fillStyle = "#fff";
        ctx.fillRect(x, y, size, size);
    },
    getX(width: number) {
        const centerX = gameState.currentLane === -1 ? width * 0.425 : width * 0.575;
        return centerX - 50;
    },
    setNextX(width: number, height: number) {
        const x = this.getX(width);

        playerState.transform.position.x = x;
        playerState.transform.position.y = height * 0.9 - 50;

        gameState.nextLaneX = x;
    },
    animate() {
        playerState.transform.position.x +=
            (gameState.nextLaneX - playerState.transform.position.x) * 0.15;
        if (Math.abs(gameState.nextLaneX - playerState.transform.position.x) < 0.5) {
            playerState.transform.position.x = gameState.nextLaneX;
            playerState.animationFrameId = null;
            draw();
            return;
        }

        draw();
        playerState.animationFrameId = requestAnimationFrame(player.animate);
    }
};

function bounds(width: number, height: number) {
    const leftLane = width * 0.35;
    const rightLane = width * 0.65;

    ctx.strokeStyle = "#00eaff";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#00eaff";
    ctx.shadowBlur = 12;

    [leftLane, rightLane].forEach((x) => {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    });

    ctx.shadowBlur = 0;
}

/**
 * utility debug line to distinguish screen center
 * @param width
 * @param height
 */
function debugCenterLane(width: number, height: number) {
    const centerLane = width * 0.5;

    ctx.strokeStyle = "#ee1111";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#ee1111";
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.moveTo(centerLane, 0);
    ctx.lineTo(centerLane, height);
    ctx.stroke();

    ctx.shadowBlur = 0;
}

function handleLaneChange() {
    gameState.currentLane = gameState.currentLane === -1 ? 1 : -1;
    gameState.nextLaneX = player.getX(canvas.clientWidth);

    if (playerState.animationFrameId !== null) {
        cancelAnimationFrame(playerState.animationFrameId);
    }

    playerState.animationFrameId = requestAnimationFrame(player.animate);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("click", handleLaneChange);
resizeCanvas();
