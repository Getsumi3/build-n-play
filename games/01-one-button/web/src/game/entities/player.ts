import type { LaneDir, PlayerProps, WorldProps } from "../../types.ts";

export function createPlayer(ctx: CanvasRenderingContext2D, bbox: WorldProps["bbox"]): PlayerProps {
    let state: Pick<
        PlayerProps,
        "transform" | "activeLane" | "nextLaneX" | "size" | "isOverlapping"
    > = {
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
        isOverlapping: false
    };

    let hitTimer = 0;

    function draw() {
        const { x, y } = state.transform.position;

        ctx.fillStyle = "#fff";
        const hitIntensity = hitTimer / 0.2;

        ctx.shadowColor = lerpColor(
            [0, 234, 255], // cyan
            [255, 51, 51], // red
            hitIntensity
        );
        ctx.shadowBlur = 12 + hitIntensity * 20;
        ctx.fillRect(x, y, state.size, state.size);
        ctx.shadowBlur = 0;
    }
    function getX(width: number) {
        const laneBoundary = state.activeLane === "left" ? bbox.left : bbox.right;

        return width * laneBoundary - (state.activeLane === "right" ? state.size : 0);
    }
    function setNextX(width: number, height: number) {
        const x = getX(width);

        state.transform.position.x = x;
        state.transform.position.y = height * 0.9 - 50;

        state.nextLaneX = x;
    }
    function update(deltaTime: number) {
        const position = state.transform.position;
        const difference = state.nextLaneX - position.x;

        if (Math.abs(difference) < 0.5) {
            position.x = state.nextLaneX;
            return;
        }

        position.x += difference * 8 * deltaTime;
        hitTimer = Math.max(0, hitTimer - deltaTime);
    }
    function setOverlapping(value: boolean) {
        if (value && !state.isOverlapping) {
            hitTimer = 0.2;
        }
        state.isOverlapping = value;
    }

    return {
        ...state,
        get activeLane() {
            return state.activeLane;
        },
        get nextLaneX() {
            return state.nextLaneX;
        },
        get size() {
            return state.size;
        },
        set nextLaneX(value: number) {
            state.nextLaneX = value;
        },
        set size(value: number) {
            state.size = value;
        },
        set activeLane(value: LaneDir) {
            state.activeLane = value;
        },
        draw,
        getX,
        setNextX,
        update,
        setOverlapping
    };
}

function lerpColor(start: number[], end: number[], amount: number): string {
    const channels = start.map((value, index) => Math.round(value + (end[index] - value) * amount));

    return `rgb(${channels.join(",")})`;
}
