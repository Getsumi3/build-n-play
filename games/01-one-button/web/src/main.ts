import "./styles/main.scss";
import type { ObstacleProps, PlayerProps, WorldProps } from "./types.ts";

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
    draw();
}
function draw() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    ctx.clearRect(0, 0, width, height);

    player.draw();
    world.draw(width, height);
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
    size: 100,
    draw() {
        const { x, y } = this.transform.position;

        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#00eaff";
        ctx.shadowBlur = 12;

        ctx.fillRect(x, y, this.size, this.size);

        ctx.shadowBlur = 0;
    },
    getX(width: number) {
        const laneBoundary = this.activeLane === "left" ? world.bb.left : world.bb.right;

        return width * laneBoundary - (this.activeLane === "right" ? this.size : 0);
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
    bb: {
        left: 0.35,
        right: 0.65,
        top: 0,
        bottom: 1
    },
    update(height: number, deltaTime: number) {
        this.lineY += this.speed * deltaTime;

        if (this.lineY > height) {
            this.lineY = 0;
        }
    },
    draw(width: number, height: number) {
        this.bgEffect(width);
        this.bounds(width, height);
        obstacle.draw(width, height);
    },
    bgEffect(width: number) {
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#00eaff";
        ctx.shadowBlur = 12;

        ctx.fillRect(width * this.bb.left, this.lineY, width * (this.bb.right - this.bb.left), 3);

        ctx.shadowBlur = 0;
    },
    bounds(width: number, height: number) {
        const leftLane = width * this.bb.left;
        const rightLane = width * this.bb.right;

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
};
const obstacle: ObstacleProps = {
    lane: "left",
    y: 0,
    size: 1,
    draw(width: number, height: number) {
        this.primitive(width, height);
    },
    update(height: number, deltaTime: number) {
        this.y += world.speed * deltaTime;

        if (this.y > height) {
            this.y = -60;
            this.lane = this.lane === "left" ? "right" : "left";
        }
    },
    primitive(width: number) {
        const centerX = this.lane === "left" ? width * world.bb.left : width * world.bb.right;

        const a = [centerX, this.y],
            b = [centerX, this.y + 60],
            c = [centerX + (this.lane === "left" ? 50 : -50), this.y + 30];

        ctx.strokeStyle = "#f9f9f9";
        ctx.lineWidth = 3;
        ctx.shadowColor = "#ff0000";
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.lineTo(c[0], c[1]);
        ctx.closePath();

        ctx.stroke();

        ctx.shadowBlur = 0;
    }
};
function handleLaneChange() {
    player.activeLane = player.activeLane === "left" ? "right" : "left";
    player.nextLaneX = player.getX(canvas.clientWidth);
}
function gameLoop(timestamp: number) {
    const deltaTime = (timestamp - world.lastFrameTime) / 1000;
    world.lastFrameTime = timestamp;

    world.update(canvas.clientHeight, deltaTime);
    obstacle.update(canvas.clientHeight, deltaTime);
    player.update(deltaTime);

    draw();

    world.loopId = requestAnimationFrame(gameLoop);
}
window.addEventListener("resize", resizeCanvas);
window.addEventListener("click", handleLaneChange);
resizeCanvas();
world.loopId = requestAnimationFrame(gameLoop);
