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
  <div class="game__ui">
  <div class="game__ui__score" id="game-score">0</div>
</div>
    <canvas class="game__canvas" id="game-canvas"></canvas>
  </main>
`;

const scoreElement = document.querySelector<HTMLDivElement>("#game-score");

if (!scoreElement) {
    throw new Error("Score element not found.");
}

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
function getHighestObstacle(): number {
    return Math.min(...obstacles.map((obstacle) => obstacle.y));
}
const world: WorldProps = createWorld(ctx, obstacles);
const player: PlayerProps = createPlayer(ctx, world.bbox);
const SPAWN_MARGIN = 100;
const MIN_OBSTACLE_GAP = 270;
const MAX_OBSTACLE_GAP = 360;
let score = 0;
function spawnObstacle(y: number) {
    const lane = Math.random() < 0.5 ? "left" : "right";

    obstacles.push(createObstacle(ctx, world, player, lane, y));
}
spawnObstacle(0);
spawnObstacle(-300);
spawnObstacle(-600);

function handleLaneChange() {
    player.activeLane = player.activeLane === "left" ? "right" : "left";
    player.nextLaneX = player.getX(canvas.clientWidth);
}

function gameLoop(timestamp: number) {
    const deltaTime = (timestamp - world.lastFrameTime) / 1000;
    world.lastFrameTime = timestamp;

    world.update(canvas.clientHeight, deltaTime);
    obstacles.forEach((obstacle) => {
        obstacle.update(deltaTime);

        if (obstacle.y > canvas.clientHeight) {
            const gap = Math.max(MIN_OBSTACLE_GAP, MAX_OBSTACLE_GAP - (world.speed - 180) * 0.5);
            const spawnY = Math.min(getHighestObstacle() - gap, -SPAWN_MARGIN);

            obstacle.respawn(spawnY);
        }

        if (obstacle.checkPassed(player.transform.position.y)) {
            score++;
        }
    });
    player.update(deltaTime);

    player.setOverlapping(
        obstacles.some((obstacle) => {
            const overlaps = obstacle.overlapsPlayer();
            if (overlaps) score--;
            return overlaps;
        })
    );
    scoreElement.textContent = String(score);
    draw();

    world.loopId = requestAnimationFrame(gameLoop);
}
window.addEventListener("resize", resizeCanvas);
window.addEventListener("click", handleLaneChange);
resizeCanvas();
world.loopId = requestAnimationFrame(gameLoop);
