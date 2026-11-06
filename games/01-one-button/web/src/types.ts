export type Vector2d = { x: number; y: number };

export type PlayerProps = {
    transform: {
        position: Vector2d;
        scale: Vector2d;
        rotation: number;
    };
    activeLane: string;
    nextLaneX: number;
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
    init(): void;
    update(height: number, deltaTime: number): void;
    draw(width: number): void;
};
