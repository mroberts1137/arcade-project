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
    this.startHealth = 5;
    this.health = this.startHealth;

    this.hit = false;
    this.hitTime = 250;
    this.invulnerable = false;
    this.invulnerableTime = 1200;
    this.dead = false;
    this.deadTime = 5000;

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
      },
      {
        name: 'dead',
        frames: 20
      }
    ];
    this.getSpriteAnimations();
  }

  update(deltaTime) {
    super.update(deltaTime);

    if (this.hit && this.hitbox.left > 0) {
      this.x -= this.game.levelSpeed;
    }

    if (
      !this.placeFree(this.hitbox.left, this.hitbox.bottom) &&
      !this.hit &&
      !this.dead &&
      this.game.levelState === 'run'
    ) {
      this.state = 'run';
      this.animationSpeed = 20;
    }

    // handle collisions by collisionId
    switch (this.collisionId) {
      case 0:
        break;
      case 1:
        // collide with enemy
        if (
          !this.invulnerable &&
          this.game.levelState === 'run' &&
          !this.dead
        ) {
          this.hit = true;
          this.invulnerable = true;
          this.state = 'getHit';
          this.animationFrame = 0;
          this.animationSpeed = 20;
          this.sfx_hit.play();
          this.health -= 1;
          if (this.health <= 0) {
            this.die();
          }
          setTimeout(() => {
            this.hit = false;
          }, this.hitTime);
          setTimeout(() => {
            this.invulnerable = false;
          }, this.invulnerableTime);
        }
        break;
    }
  }

  move(deltaTime) {
    if (!this.dead && this.game.levelState === 'run') {
      if (this.placeFree(this.hitbox.left, this.hitbox.bottom)) {
        // freefall
        this.ay = this.gravity;
        this.animationSpeed = 40;
        if (this.vy < 0 && !this.hit) this.state = 'jump';
        else if (this.vy > 0 && !this.hit) this.state = 'fall';
      } else {
        if (this.vy > 0) {
          // land on ground
          this.y = this.game.ground - this.hitbox.yOffset - this.hitbox.height;
          this.vy = 0;
          this.ay = 0;
          this.state = 'run';
          this.animationSpeed = 20;
        }
      }

      // handle keyboard input
      if (!this.hit && !this.dead) {
        if (this.input.keys.includes('ArrowRight')) {
          // run right
          if (this.hitbox.right < this.game.canvasWidth) {
            this.x += this.maxVx * deltaTime;
          }
        } else if (this.input.keys.includes('ArrowLeft')) {
          // run left
          if (this.hitbox.left > 0) {
            this.x -= this.maxVx * deltaTime;
          }
        }
        if (
          this.input.keys.includes('Space') ||
          this.input.keys.includes('ArrowUp')
        ) {
          if (this.hitbox.bottom >= this.game.canvasHeight - 18) {
            // jump
            this.vy = -this.maxVy;
            this.ay = this.gravity;
            this.sfx_jump.play();
          }
        }
      }

      super.move(deltaTime);
    }
  }

  die() {
    this.state = 'dead';
    this.dead = true;
    this.game.music.pause();
    setTimeout(() => {
      this.state = 'idle';
      this.animationSpeed = 40;
      this.x = this.game.playerStartX;
      this.y = this.game.playerStartY;
      this.health = this.startHealth;
      this.dead = false;
      this.game.startLevel();
    }, this.deadTime);
  }
}
