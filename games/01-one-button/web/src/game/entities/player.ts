import type { PlayerProps, WorldProps } from "../../types.ts";

export function createPlayer(ctx: CanvasRenderingContext2D, bbox: WorldProps["bbox"]): PlayerProps {
    let state: Pick<PlayerProps, "transform" | "activeLane" | "nextLaneX" | "size"> = {
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
        size: 100
    };
    function draw() {
        const { x, y } = state.transform.position;

        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#00eaff";
        ctx.shadowBlur = 12;

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
    }

    return {
        ...state,
        draw,
        getX,
        setNextX,
        update
    };
}
