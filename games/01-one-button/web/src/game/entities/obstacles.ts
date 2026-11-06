import type { LaneDir, ObstacleProps, PlayerProps, WorldProps } from "../../types.ts";

export function createObstacle(
    ctx: CanvasRenderingContext2D,
    world: WorldProps,
    player: PlayerProps,
    lane: LaneDir,
    y: number
): ObstacleProps {
    let state: Pick<ObstacleProps, "lane" | "y" | "size" | "wasPassed"> = {
        lane: lane || "left",
        y: y || 0,
        size: 1,
        wasPassed: false
    };
    function draw(width: number) {
        primitive(width);
    }
    function update(height: number, deltaTime: number) {
        state.y += world.speed * deltaTime;

        if (state.y > height) {
            state.y = -60;
            state.lane = Math.random() < 0.5 ? "left" : "right";
            state.wasPassed = false;
        }
    }
    function primitive(width: number) {
        const laneWidth = (width * (world.bbox.right - world.bbox.left)) / 2;

        const x =
            state.lane === "left" ? width * world.bbox.left : width * world.bbox.left + laneWidth;

        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#ff0000";
        ctx.shadowBlur = 12;

        ctx.fillRect(x, state.y, laneWidth, 12);

        ctx.shadowBlur = 0;
    }
    function collidesWithPlayer() {
        const obstacleHeight = 12;
        const playerTop = player.transform.position.y;
        const playerBottom = playerTop + player.size;
        const obstacleTop = state.y;
        const obstacleBottom = state.y + obstacleHeight;

        return (
            state.lane === player.activeLane &&
            obstacleBottom > playerTop &&
            obstacleTop < playerBottom
        );
    }
    function checkPassed(playerY: number): boolean {
        if (!state.wasPassed && state.y > playerY + player.size) {
            state.wasPassed = true;
            return true;
        }

        return false;
    }
    return {
        ...state,
        draw,
        update,
        primitive,
        collidesWithPlayer,
        checkPassed
    };
}
