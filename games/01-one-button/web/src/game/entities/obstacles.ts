import type { LaneDir, ObstacleProps, PlayerProps, WorldProps } from "../../types.ts";

export function createObstacle(
    ctx: CanvasRenderingContext2D,
    world: WorldProps,
    player: PlayerProps,
    lane: LaneDir = "left",
    y: number = 0
): ObstacleProps {
    let state: Pick<ObstacleProps, "lane" | "y" | "size" | "wasProcessed"> = {
        lane,
        y,
        size: 1,
        wasProcessed: false
    };
    function draw(width: number) {
        primitive(width);
    }
    function update(deltaTime: number) {
        state.y += world.speed * deltaTime;
    }
    function primitive(width: number) {
        const laneWidth = (width * (world.bbox.right - world.bbox.left)) / 2;

        const x =
            state.lane === "left" ? width * world.bbox.left : width * world.bbox.left + laneWidth;

        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#ff0000";
        ctx.shadowBlur = 10;

        ctx.fillRect(x, state.y, laneWidth, 20);

        ctx.fillStyle = "rgb(255 0 0 / 0.35)";
        ctx.fillRect(x, state.y + 20, laneWidth, 2);

        ctx.shadowBlur = 0;
    }
    function checkPassed(playerY: number): boolean {
        if (!state.wasProcessed && state.y > playerY + player.size) {
            state.wasProcessed = true;
            return true;
        }

        return false;
    }
    function overlapsPlayer(): boolean {
        const playerTop = player.transform.position.y;
        const playerBottom = playerTop + player.size;
        const obstacleTop = state.y;
        const obstacleBottom = state.y + 20;

        return (
            state.lane === player.activeLane &&
            obstacleBottom > playerTop &&
            obstacleTop < playerBottom
        );
    }
    function respawn(y: number) {
        state.y = y;
        state.lane = Math.random() < 0.5 ? "left" : "right";
        state.wasProcessed = false;
    }
    function registerHit(): boolean {
        if (state.wasProcessed) return false;

        state.wasProcessed = true;
        return true;
    }
    return {
        get lane() {
            return state.lane;
        },
        set lane(value) {
            state.lane = value;
        },
        get y() {
            return state.y;
        },
        set y(value) {
            state.y = value;
        },
        get size() {
            return state.size;
        },
        get wasProcessed() {
            return state.wasProcessed;
        },
        set wasProcessed(value) {
            state.wasProcessed = value;
        },
        draw,
        update,
        checkPassed,
        overlapsPlayer,
        respawn,
        registerHit
    };
}
