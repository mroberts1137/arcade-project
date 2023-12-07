import Entity from './entity.js';

export default class Player extends Entity {
  constructor(game, x, y, input) {
    super(game, x, y);
    // sprite info
    this.image.src = 'assets/sprites/shadow_dog.png';
    this.spriteWidth = 575;
    this.spriteHeight = 523;
    this.spriteScale = 0.5;

    this.state = 'idle';
    this.edgeOfBounds = 'stop';
    this.input = input;

    this.maxVx = 0.4;
    this.maxVy = 1;

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
        frames: 6
      },
      {
        name: 'jump',
        frames: 6
      },
      {
        name: 'fall',
        frames: 6
      },
      {
        name: 'run',
        frames: 8
      },
      {
        name: 'dizzy',
        frames: 10
      },
      {
        name: 'sit',
        frames: 4
      },
      {
        name: 'roll',
        frames: 6
      },
      {
        name: 'bite',
        frames: 6
      },
      {
        name: 'dead',
        frames: 12
      },
      {
        name: 'getHit',
        frames: 4
      }
    ];
    this.getSpriteAnimations();
  }

  move(deltaTime) {
    if (this.hitbox.bottom > this.game.canvasHeight - 18 && this.vy > 0) {
      this.y =
        this.game.canvasHeight - this.hitbox.yOffset - this.hitbox.height - 15;
      this.vy = 0;
      this.ay = 0;
    }
    if (this.input.keys.includes('ArrowRight')) {
      if (this.hitbox.right + this.maxVx * deltaTime < this.game.canvasWidth) {
        this.x += this.maxVx * deltaTime;
      }
      // this.ax = 0.002;
      // this.frictionX = 0;
    } else if (this.input.keys.includes('ArrowLeft')) {
      if (this.hitbox.left - this.maxVx * deltaTime > 0) {
        this.x -= this.maxVx * deltaTime;
      }
      // this.ax = -0.002;
      // this.frictionX = 0;
    } else {
      // this.ax = 0;
      // if (this.vx > 0) this.frictionX = -0.002;
      // if (this.vx < 0) this.frictionX = 0.002;
    }
    if (this.input.keys.includes('Space')) {
      if (this.hitbox.bottom >= this.game.canvasHeight - 18) {
        this.vy = -this.maxVy;
        this.ay = 0.04;
      }
    }
    //console.log(this.vy, this.ay);

    super.move(deltaTime);
  }
}
