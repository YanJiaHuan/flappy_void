export type GameMode = 'ready' | 'playing' | 'over';

export type Obstacle = {
  id: number;
  x: number;
  gapY: number;
  passed: boolean;
};

export type PlayerState = {
  x: number;
  y: number;
  vy: number;
  r: number;
};

export type GameSnapshot = {
  mode: GameMode;
  score: number;
  player: PlayerState;
  obstacles: Obstacle[];
};

export type GameConfig = {
  width: number;
  height: number;
};

export class FlappyEngine {
  private width: number;
  private height: number;
  private gravity = 900;
  private jumpVelocity = -320;
  private obstacleSpeed = 180;
  private obstacleGap = 170;
  private obstacleWidth = 86;
  private spawnInterval = 1.35;
  private groundHeight = 70;

  mode: GameMode = 'ready';
  score = 0;
  player: PlayerState;
  obstacles: Obstacle[] = [];
  private spawnTimer = 0;
  private obstacleId = 1;

  constructor(config: GameConfig) {
    this.width = config.width;
    this.height = config.height;
    this.player = {
      x: 130,
      y: this.height * 0.5,
      vy: 0,
      r: 22
    };
  }

  reset() {
    this.mode = 'ready';
    this.score = 0;
    this.player = {
      x: 130,
      y: this.height * 0.5,
      vy: 0,
      r: 22
    };
    this.obstacles = [];
    this.spawnTimer = 0;
  }

  start() {
    if (this.mode === 'ready') {
      this.mode = 'playing';
    }
  }

  jump() {
    if (this.mode === 'ready') {
      this.mode = 'playing';
    }
    if (this.mode !== 'playing') {
      return;
    }
    this.player.vy = this.jumpVelocity;
  }

  step(dt: number) {
    if (this.mode !== 'playing') {
      return;
    }

    this.player.vy += this.gravity * dt;
    this.player.y += this.player.vy * dt;

    if (this.player.y - this.player.r <= 0 || this.player.y + this.player.r >= this.height - this.groundHeight) {
      this.mode = 'over';
      return;
    }

    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      const gapMargin = 90;
      const gapY = gapMargin + Math.random() * (this.height - this.groundHeight - gapMargin * 2 - this.obstacleGap);
      this.obstacles.push({
        id: this.obstacleId++,
        x: this.width + 40,
        gapY,
        passed: false
      });
    }

    this.obstacles = this.obstacles
      .map((obs) => ({ ...obs, x: obs.x - this.obstacleSpeed * dt }))
      .filter((obs) => obs.x + this.obstacleWidth > -40);

    for (const obs of this.obstacles) {
      const withinX = this.player.x + this.player.r > obs.x && this.player.x - this.player.r < obs.x + this.obstacleWidth;
      if (withinX) {
        const gapTop = obs.gapY;
        const gapBottom = obs.gapY + this.obstacleGap;
        if (this.player.y - this.player.r < gapTop || this.player.y + this.player.r > gapBottom) {
          this.mode = 'over';
          return;
        }
      }

      if (!obs.passed && obs.x + this.obstacleWidth < this.player.x - this.player.r) {
        obs.passed = true;
        this.score += 1;
      }
    }
  }

  getObstacleConfig() {
    return {
      gap: this.obstacleGap,
      width: this.obstacleWidth,
      ground: this.groundHeight
    };
  }

  getSnapshot(): GameSnapshot {
    return {
      mode: this.mode,
      score: this.score,
      player: { ...this.player },
      obstacles: this.obstacles.map((obs) => ({ ...obs }))
    };
  }
}
