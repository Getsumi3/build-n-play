import "./styles/main.scss";
import type { ObstacleProps, PlayerProps, WorldProps } from "./types.ts";
import { createPlayer } from "./game/entities/player.ts";
import { createWorld } from "./game/entities/world.ts";
import { createObstacle } from "./game/entities/obstacles.ts";

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
const obstacles: ObstacleProps[] = [];
const world: WorldProps = createWorld(ctx, obstacles);
const player: PlayerProps = createPlayer(ctx, world.bbox);
const OBSTACLE_GAP_TIME = 1.5;
obstacles.push(
    createObstacle(ctx, world, player, "left", 0),
    createObstacle(ctx, world, player, "right", -300)
);

function handleLaneChange() {
    player.activeLane = player.activeLane === "left" ? "right" : "left";
    player.nextLaneX = player.getX(canvas.clientWidth);
}

function gameLoop(timestamp: number) {
    const deltaTime = (timestamp - world.lastFrameTime) / 1000;
    world.lastFrameTime = timestamp;

    world.update(canvas.clientHeight, deltaTime);
    obstacles.forEach((obstacle) => obstacle.update(canvas.clientHeight, deltaTime));
    player.update(deltaTime);

    player.setOverlapping(obstacles.some((obstacle) => obstacle.overlapsPlayer()));

    draw();

    world.loopId = requestAnimationFrame(gameLoop);
}
window.addEventListener("resize", resizeCanvas);
window.addEventListener("click", handleLaneChange);
resizeCanvas();
world.loopId = requestAnimationFrame(gameLoop);
