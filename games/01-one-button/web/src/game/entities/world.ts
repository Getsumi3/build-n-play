import type { ObstacleProps, WorldProps } from "../../types.ts";

export function createWorld(ctx: CanvasRenderingContext2D, obstacles: ObstacleProps[]): WorldProps {
    let state: Pick<WorldProps, "lineY" | "speed" | "loopId" | "lastFrameTime" | "bbox"> = {
        lineY: 0,
        speed: 180,
        loopId: null,
        lastFrameTime: 0,
        bbox: {
            left: 0.35,
            right: 0.65,
            top: 0,
            bottom: 1
        }
    };
    function update(height: number, deltaTime: number) {
        state.lineY += state.speed * deltaTime;

        if (state.lineY > height) {
            state.lineY = 0;
        }
    }
    function draw(width: number, height: number) {
        bgEffect(width);
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
