import type { LaneDir, ObstacleProps, PlayerProps, WorldProps } from "../../types.ts";

export function createObstacle(
    ctx: CanvasRenderingContext2D,
    world: WorldProps,
    player: PlayerProps,
    lane: LaneDir = "left",
    y: number = 0
): ObstacleProps {
    let state: Pick<ObstacleProps, "lane" | "y" | "size" | "wasPassed" | "wasHit"> = {
        lane,
        y,
        size: 1,
        wasPassed: false,
        wasHit: false
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
        ctx.shadowBlur = 12;

        ctx.fillRect(x, state.y, laneWidth, 12);

        ctx.shadowBlur = 0;
    }
    function checkPassed(playerY: number): boolean {
        if (!state.wasPassed && state.y > playerY + player.size) {
            state.wasPassed = true;
            return true;
        }

        return false;
    }
    function overlapsPlayer(): boolean {
        const playerTop = player.transform.position.y;
        const playerBottom = playerTop + player.size;
        const obstacleTop = state.y;
        const obstacleBottom = state.y + 12;

        return (
            state.lane === player.activeLane &&
            obstacleBottom > playerTop &&
            obstacleTop < playerBottom
        );
    }
    function respawn(y: number) {
        state.y = y;
        state.lane = Math.random() < 0.5 ? "left" : "right";
        state.wasPassed = false;
        state.wasHit = false;
    }
    function registerHit(): boolean {
        if (state.wasHit) return false;

        state.wasHit = true;
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
        get wasPassed() {
            return state.wasPassed;
        },
        set wasPassed(value) {
            state.wasPassed = value;
        },
        get wasHit() {
            return state.wasHit;
        },
        set wasHit(value) {
            state.wasHit = value;
        },
        draw,
        update,
        checkPassed,
        overlapsPlayer,
        respawn,
        registerHit
    };
}
