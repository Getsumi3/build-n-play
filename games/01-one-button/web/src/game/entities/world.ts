import type { ObstacleProps, WorldProps } from "../../types.ts";

export function createWorld(ctx: CanvasRenderingContext2D, obstacles: ObstacleProps[]): WorldProps {
    const initialSpeed = 180;
    const speedIncrease = 20;
    const speedInterval = 3;
    const maxSpeed = 400;

    let elapsedTime = 0;

    let gridOffset = 0;
    const GRID_SIZE = 24;
    const GRID_SPEED = 12;

    let state: Pick<WorldProps, "lineY" | "speed" | "loopId" | "lastFrameTime" | "bbox"> = {
        lineY: 0,
        speed: 180,
        loopId: null,
        lastFrameTime: 0,
        bbox: {
            left: 0,
            right: 1,
            top: 0,
            bottom: 1
        }
    };

    function update(height: number, deltaTime: number) {
        elapsedTime += deltaTime;

        const speedLevel = Math.floor(elapsedTime / speedInterval);

        state.speed = Math.min(initialSpeed + speedLevel * speedIncrease, maxSpeed);

        state.lineY += state.speed * deltaTime;

        if (state.lineY > height) {
            state.lineY = 0;
        }

        gridOffset = (gridOffset + GRID_SPEED * deltaTime) % GRID_SIZE;

        stars.forEach((star) => {
            star.y += star.speed * deltaTime;

            if (star.y > 1) {
                star.y = 0;
                star.x = Math.random();
            }
        });
    }
    function draw(width: number, height: number) {
        const gradient = ctx.createRadialGradient(
            width / 2,
            height * 0.4,
            0,
            width / 2,
            height * 0.4,
            height * 0.8
        );

        gradient.addColorStop(0, "#101a20");
        gradient.addColorStop(1, "#050607");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Background grid
        ctx.strokeStyle = "rgba(5, 6, 7, 0.07)";
        ctx.lineWidth = 1;
        ctx.shadowColor = "#00eaff";
        ctx.shadowBlur = 1;

        for (let x = 0; x <= width; x += 24) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = -GRID_SIZE; y <= height; y += GRID_SIZE) {
            const offsetY = y + gridOffset;

            ctx.beginPath();
            ctx.moveTo(0, offsetY);
            ctx.lineTo(width, offsetY);
            ctx.stroke();
        }
        ctx.shadowBlur = 0;
        // Stars
        stars.forEach((star) => {
            const alpha =
                star.alpha * (0.7 + Math.sin((performance.now() / 1000) * star.twinkle) * 0.3);

            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.shadowColor = "#ffffff";
            ctx.shadowBlur = 6;

            ctx.beginPath();
            const size =
                star.size * (0.8 + Math.sin((performance.now() / 1200) * star.twinkle) * 0.2);

            ctx.arc(star.x * width, star.y * height, size, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.shadowBlur = 0;

        bounds(width, height);
        obstacles.forEach((obstacle) => obstacle.draw(width));
    }
    function bgEffect(width: number) {
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#00eaff";
        ctx.shadowBlur = 12;

        ctx.fillRect(
            width * state.bbox.left,
            state.lineY,
            width * (state.bbox.right - state.bbox.left),
            3
        );

        ctx.shadowBlur = 0;
    }
    function bounds(width: number, height: number) {
        const leftLane = width * state.bbox.left;
        const rightLane = width * state.bbox.right;

        ctx.strokeStyle = "#00eaff";
        ctx.lineWidth = 5;
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
    return {
        ...state,
        get lineY() {
            return state.lineY;
        },
        get speed() {
            return state.speed;
        },
        get loopId() {
            return state.loopId;
        },
        get lastFrameTime() {
            return state.lastFrameTime;
        },
        get bbox() {
            return state.bbox;
        },
        set lineY(value: number) {
            state.lineY = value;
        },
        set speed(value: number) {
            state.speed = value;
        },
        set loopId(value: number) {
            state.loopId = value;
        },
        set lastFrameTime(value: number) {
            state.lastFrameTime = value;
        },
        update,
        draw,
        bgEffect,
        bounds
    };
}

const stars = Array.from({ length: 120 }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: Math.random() * 1.5 + 0.5,
    alpha: Math.random() * 0.6 + 0.2,
    twinkle: Math.random() * 2 + 1,
    speed: Math.random() * 0.025 + 0.005
}));
