export type Vector2d = { x: number; y: number };
export type LaneDir = "left" | "right";
export type PlayerProps = {
    transform: {
        position: Vector2d;
        scale: Vector2d;
        rotation: number;
    };
    activeLane: LaneDir;
    nextLaneX: number;
    size: 100;
    draw(): void;
    getX(width: number): number;
    setNextX(width: number, height: number): void;
    update(deltaTime: number): void;
};

export type WorldProps = {
    lineY: number;
    speed: number;
    loopId: number | null;
    lastFrameTime: number;
    bb: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    update(height: number, deltaTime: number): void;
    draw(width: number, height: number): void;
    bgEffect(width: number): void;
    bounds(width: number, height: number): void;
};

export type ObstacleProps = {
    lane: "left" | "right";
    y: number;
    size: number;
    update(height: number, deltaTime: number): void;
    draw(width: number, height: number): void;
    primitive(width: number): void;
};
