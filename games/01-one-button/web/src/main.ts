import "./styles/main.scss";
import type { PlayerProps, WorldProps } from "./types.ts";

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

function resizeCanvas() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    player.setNextX(width, height);
    world.init();
    draw();
}

function draw() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    ctx.clearRect(0, 0, width, height);

    world.draw(width);
    player.draw();
    bounds(width, height);
}

const player: PlayerProps = {
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
    activeLane: "left",
    nextLaneX: 0,
    draw() {
        const size = 100 * this.transform.scale.x;

        const { x, y } = this.transform.position;

        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#00eaff";
        ctx.shadowBlur = 12;

        ctx.fillRect(x, y, size, size);

        ctx.shadowBlur = 0;
    },
    getX(width: number) {
        const centerX = player.activeLane === "left" ? width * 0.425 : width * 0.575;
        return centerX - 50;
    },
    setNextX(width: number, height: number) {
        const x = this.getX(width);

        this.transform.position.x = x;
        this.transform.position.y = height * 0.9 - 50;

        player.nextLaneX = x;
    },
    update(deltaTime: number) {
        const position = this.transform.position;
        const difference = player.nextLaneX - position.x;

        if (Math.abs(difference) < 0.5) {
            position.x = player.nextLaneX;
            return;
        }

        position.x += difference * 8 * deltaTime;
    }
};

const world: WorldProps = {
    lineY: 0,
    speed: 180,
    loopId: null,
    lastFrameTime: 0,
    init() {
        this.lineY = 0;
    },
    update(height: number, deltaTime: number) {
        this.lineY += this.speed * deltaTime;

        if (this.lineY > height) {
            this.lineY = 0;
        }
    },
    draw(width: number) {
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#00eaff";
        ctx.shadowBlur = 12;

        ctx.fillRect(width * 0.35, this.lineY, width * 0.3, 3);

        ctx.shadowBlur = 0;
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

function handleLaneChange() {
    player.activeLane = player.activeLane === "left" ? "right" : "left";
    player.nextLaneX = player.getX(canvas.clientWidth);
}
function gameLoop(timestamp: number) {
    const deltaTime = (timestamp - world.lastFrameTime) / 1000;
    world.lastFrameTime = timestamp;

    world.update(canvas.clientHeight, deltaTime);
    player.update(deltaTime);

    draw();

    world.loopId = requestAnimationFrame(gameLoop);
}
window.addEventListener("resize", resizeCanvas);
window.addEventListener("click", handleLaneChange);
resizeCanvas();
gameLoop(0);
