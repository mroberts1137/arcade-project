import Entity from './entity.js';

export default class Player extends Entity {
  constructor(game, x, y, input) {
    super(game, x, y);
    // sprite info
    this.image.src = 'assets/sprites/robot-boy.png';
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
      0.6,
      0,
      0
    );

    // sprite-sheet animations/frames
    this.animationStates = [
      {
        name: 'idle',
        frames: 20,
        speed: 40
      },
      {
        name: 'jump',
        frames: 10,
        speed: 40
      },
      {
        name: 'fall',
        frames: 10,
        speed: 40
      },
      {
        name: 'run',
        frames: 12,
        speed: 20
      },
      {
        name: 'getHit',
        frames: 11,
        speed: 20
      },
      {
        name: 'dead',
        frames: 20,
        speed: 60
      }
    ];
    this.spriteProps = {
      idle: {
        speed: 40
      },
      jump: {
        speed: 40
      },
      fall: {
        speed: 40
      },
      run: {
        speed: 20
      },
      getHit: {
        speed: 20
      },
      dead: {
        speed: 60
      }
    };
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
      this.animationSpeed = this.spriteProps[this.state].speed;
    }

    // handle collisions by collisionId
    switch (this.collisionId) {
      case 0:
        break;
      case 1:
        break;
    }
  }

  move(deltaTime) {
    if (this.placeFree(this.hitbox.left, this.hitbox.bottom)) {
      // freefall
      this.ay = this.gravity;
      if (!this.dead && this.game.levelState === 'run') {
        if (this.vy < 0 && !this.hit) this.state = 'jump';
        else if (this.vy > 0 && !this.hit) this.state = 'fall';
        this.animationSpeed = this.spriteProps[this.state].speed;
      }
    } else {
      if (this.vy > 0) {
        // land on ground
        this.y = this.game.ground - this.hitbox.yOffset - this.hitbox.height;
        this.vy = 0;
        this.ay = 0;
        if (!this.dead && this.game.levelState === 'run') {
          this.state = 'run';
          this.animationSpeed = this.spriteProps[this.state].speed;
        }
      }
    }

    // handle keyboard input
    if (!this.dead && this.game.levelState === 'run') {
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
          if (this.hitbox.bottom >= this.game.ground) {
            // jump
            this.vy = -this.maxVy;
            this.ay = this.gravity;
            this.sfx_jump.play();
          }
        }
      }
    }
    super.move(deltaTime);
  }

  die() {
    this.state = 'dead';
    this.animationLoop = false;
    this.animationFrame = 0;
    this.animationSpeed = this.spriteProps[this.state].speed;
    this.dead = true;
    this.game.music.pause();
    this.game.levelSpeed = 0;
    setTimeout(() => {
      this.state = 'idle';
      this.animationLoop = true;
      this.animationFrame = 0;
      this.animationSpeed = this.spriteProps[this.state].speed;
      this.x = this.game.playerStartX;
      this.y = this.game.playerStartY;
      this.health = this.startHealth;
      this.dead = false;
      this.game.startLevel();
    }, this.deadTime);
  }

  checkBounceOnEnemy(enemy) {
    if (this.game.levelState === 'run' && !this.dead) {
      // check if landing on enemy (falling from above)
      if (this.hitbox.bottom < enemy.hitbox.bottom && this.vy > 0) {
        enemy.bouncedOn();
        // bounce
        this.vy = -this.maxVy / 2;
        this.ay = this.gravity;
        this.sfx_jump.play();
      } else {
        // collide with enemy
        if (!this.invulnerable) {
          this.hit = true;
          this.invulnerable = true;
          this.state = 'getHit';
          this.animationFrame = 0;
          this.animationSpeed = this.spriteProps[this.state].speed;
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
      }
    }
  }
}
