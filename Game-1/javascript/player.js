import Entity from './entity.js';

export default class Player extends Entity {
  constructor(game, x, y, input) {
    super(game, x, y);
    // sprite info
    this.image.src = 'assets/sprites/robot_boy.png';
    this.spriteWidth = 300;
    this.spriteHeight = 200;
    this.spriteScale = 0.5;
    this.animationSpeed = 40;

    this.sfx_jump = new Audio();
    this.sfx_jump.src = 'assets/sfx/jump.wav';
    this.sfx_hit = new Audio();
    this.sfx_hit.src = 'assets/sfx/aw01.ogg';

    this.state = 'idle';
    this.edgeOfBounds = 'stop';
    this.input = input;

    this.maxVx = 0.4;
    this.maxVy = 1;
    this.gravity = 0.04;

    // coordinates/hitbox
    this.updateHitbox(
      this.spriteWidth,
      this.spriteHeight,
      this.spriteScale,
      0.65,
      0,
      0
    );

    // sprite-sheet animations/frames
    this.animationStates = [
      {
        name: 'idle',
        frames: 20
      },
      {
        name: 'jump',
        frames: 10
      },
      {
        name: 'fall',
        frames: 10
      },
      {
        name: 'run',
        frames: 12
      },
      {
        name: 'getHit',
        frames: 11
      }
    ];
    this.getSpriteAnimations();
  }

  update(deltaTime) {
    super.update(deltaTime);

    // handle collisions by collisionId
    switch (this.collisionId) {
      case 0:
        break;
      case 1:
        this.state = 'getHit';
        this.sfx_hit.play();
        break;
    }
  }

  move(deltaTime) {
    if (this.placeFree(this.hitbox.left, this.hitbox.bottom)) {
      this.ay = this.gravity;
      this.animationSpeed = 40;
      if (this.vy < 0) this.state = 'jump';
      else if (this.vy > 0) this.state = 'fall';
    } else {
      if (this.vy > 0) {
        this.y = this.game.ground - this.hitbox.yOffset - this.hitbox.height;
        this.vy = 0;
        this.ay = 0;
      }
    }

    if (this.input.keys.includes('ArrowRight')) {
      if (this.hitbox.right + this.maxVx * deltaTime < this.game.canvasWidth) {
        if (!this.placeFree(this.hitbox.left, this.hitbox.bottom)) {
          this.state = 'run';
          this.animationSpeed = 20;
        }
        if (this.hitbox.right < this.game.canvasWidth / 2) {
          this.x += this.maxVx * deltaTime;
        } else {
          this.game.levelSpeed = this.maxVx * deltaTime;
        }
      }
    } else if (this.input.keys.includes('ArrowLeft')) {
      if (this.hitbox.left - this.maxVx * deltaTime > 0) {
        if (!this.placeFree(this.hitbox.left, this.hitbox.bottom)) {
          this.state = 'run';
          this.animationSpeed = 20;
        }
        this.x -= this.maxVx * deltaTime;
        this.game.levelSpeed = 0;
      }
    } else {
      if (!this.placeFree(this.hitbox.left, this.hitbox.bottom)) {
        this.state = 'idle';
        this.animationSpeed = 40;
        this.game.levelSpeed = 0;
      }
    }
    if (
      this.input.keys.includes('Space') ||
      this.input.keys.includes('ArrowUp')
    ) {
      if (this.hitbox.bottom >= this.game.canvasHeight - 18) {
        this.vy = -this.maxVy;
        this.ay = this.gravity;
        this.sfx_jump.play();
      }
      console.log(this.spriteAnimations);
    }

    super.move(deltaTime);
  }
}
