import Entity from './entity.js';

///////////////////////////////////////////
// Bat Class
///////////////////////////////////////////

export class Bat extends Entity {
  constructor(game, x, y) {
    super(game, x, y);
    // sprite info
    this.image.src = 'assets/sprites/enemy1.png';
    this.spriteWidth = 293;
    this.spriteHeight = 155;
    this.spriteScale = 0.5;

    // sprite-sheet animations/frames
    this.animationStates = [
      {
        name: 'idle',
        frames: 4
      }
    ];
    this.getSpriteAnimations();

    // coordinates/hitbox
    this.updateHitbox(
      this.spriteWidth,
      this.spriteHeight,
      this.spriteScale,
      0.75,
      0,
      0
    );

    // enemy-specific properties
    this.type = 'bat';
    this.behavior = 'shake';
    this.maxSpeed = 10;
    this.speed = (Math.random() * 2 - 1) * this.maxSpeed;
    this.direction = Math.random() * 360;
  }

  move(deltaTime) {
    super.move(deltaTime);
    this.direction = Math.random() * 360;
    this.x += this.speed * Math.cos((this.direction * Math.PI) / 180);
    this.y -= this.speed * Math.sin((this.direction * Math.PI) / 180);
  }
}

///////////////////////////////////////////
// Bat2 Class
///////////////////////////////////////////

export class Bat2 extends Entity {
  constructor(game, x, y) {
    super(game, x, y);
    // sprite info
    this.image.src = 'assets/sprites/enemy2.png';
    this.spriteWidth = 266;
    this.spriteHeight = 188;
    this.spriteScale = 0.5;

    // sprite-sheet animations/frames
    this.animationStates = [
      {
        name: 'idle',
        frames: 4
      }
    ];
    this.getSpriteAnimations();

    // coordinates/hitbox
    this.updateHitbox(
      this.spriteWidth,
      this.spriteHeight,
      this.spriteScale,
      0.75,
      0,
      0
    );

    // enemy-specific properties
    this.type = 'bat2';
    this.behavior = 'leftSine';
    this.maxSpeed = 10;
    this.speed = Math.random() * this.maxSpeed;
    this.direction = 180;
    this.amplitude = 10 * Math.random();
    this.angularSpeed = 10 * Math.random();
    this.angle = 0;
  }

  move(deltaTime) {
    this.x += this.speed * Math.cos((this.direction * Math.PI) / 180);
    this.y -= this.amplitude * Math.sin(((this.angle % 360) * Math.PI) / 180);
    this.angle += this.angularSpeed;
  }
}

///////////////////////////////////////////
// Ghost Class
///////////////////////////////////////////

export class Ghost extends Entity {
  constructor(game, x, y) {
    super(game, x, y);
    // sprite info
    this.image.src = 'assets/sprites/enemy3.png';
    this.spriteWidth = 218;
    this.spriteHeight = 177;
    this.spriteScale = 0.5;

    // sprite-sheet animations/frames
    this.animationStates = [
      {
        name: 'idle',
        frames: 4
      }
    ];
    this.getSpriteAnimations();

    // coordinates/hitbox
    this.updateHitbox(
      this.spriteWidth,
      this.spriteHeight,
      this.spriteScale,
      0.75,
      0,
      0
    );

    // enemy-specific properties
    this.type = 'ghost';
    this.behavior = 'leftSine';
    this.angularSpeed = 4 * Math.random() + 1;
    this.angle = 0;
    this.nx = 1;
    this.ny = 2;
  }

  move(deltaTime) {
    this.x =
      ((window.global.CANVAS_WIDTH - this.width) / 2) *
      (Math.sin((this.nx * (this.angle % 360) * Math.PI) / 180) + 1);
    this.y =
      ((window.global.CANVAS_HEIGHT - this.height) / 2) *
      (Math.sin((this.ny * (this.angle % 360) * Math.PI) / 180) + 1);
    this.angle += this.angularSpeed;
  }
}

///////////////////////////////////////////
// Wheel Class
///////////////////////////////////////////

export class Wheel extends Entity {
  constructor(game, x, y) {
    super(game, x, y);
    // sprite info
    this.image.src = 'assets/sprites/enemy4.png';
    this.spriteWidth = 213;
    this.spriteHeight = 213;
    this.spriteScale = 0.5;

    // sprite-sheet animations/frames
    this.animationStates = [
      {
        name: 'idle',
        frames: 7
      }
    ];
    this.getSpriteAnimations();

    // coordinates/hitbox
    this.updateHitbox(
      this.spriteWidth,
      this.spriteHeight,
      this.spriteScale,
      0.75,
      0,
      0
    );

    // enemy-specific properties
    this.type = 'wheel';
    this.behavior = 'leftSine';
    this.maxSpeed = 10;
    this.moveInterval = Math.floor(Math.random() * 200 + 50);
    this.newX = this.x;
    this.newY = this.y;
  }

  move(deltaTime) {
    if (this.gameFrame % this.moveInterval === 0) {
      this.newX = Math.random() * (this.game.canvasWidth - this.width);
      this.newY = Math.random() * (this.game.canvasHeight - this.height);
    }
    let dx = this.x - this.newX;
    let dy = this.y - this.newY;
    this.x -= dx / 20;
    this.y -= dy / 20;
  }
}

///////////////////////////////////////////
// Worm Class
///////////////////////////////////////////

export class Worm extends Entity {
  constructor(game, x, y) {
    super(game, x, y);
    // sprite info
    this.image.src = 'assets/sprites/enemy_worm.png';
    this.spriteWidth = 229;
    this.spriteHeight = 171;
    this.spriteScale = 0.5;

    // sprite-sheet animations/frames
    this.animationStates = [
      {
        name: 'idle',
        frames: 4
      }
    ];
    this.getSpriteAnimations();

    // coordinates/hitbox
    this.updateHitbox(
      this.spriteWidth,
      this.spriteHeight,
      this.spriteScale,
      0.75,
      0,
      0
    );

    // enemy-specific properties
    this.type = 'worm';
    this.behavior = 'crawl';
    this.maxSpeed = 0.5;
    this.vx = -Math.random() * this.maxSpeed;
  }

  update(deltaTime) {
    super.update(deltaTime);
    // if (this.y < this.game.canvasHeight - 200) this.moveContact(270);
  }

  move(deltaTime) {
    super.move(deltaTime);
  }

  moveContact(direction) {
    if (direction === 270) {
      for (let i = 0; i < 200; i++) {
        if (this.y + i === this.game.canvasHeight - 100) {
          this.y = this.y + i;
          return;
        }
      }
    }
  }
}

///////////////////////////////////////////
// Ghost2 Class
///////////////////////////////////////////

export class Ghost2 extends Entity {
  constructor(game, x, y) {
    super(game, x, y);
    // sprite info
    this.image.src = 'assets/sprites/enemy_ghost.png';
    this.spriteWidth = 261;
    this.spriteHeight = 209;
    this.spriteScale = 0.5;

    // sprite-sheet animations/frames
    this.animationStates = [
      {
        name: 'idle',
        frames: 4
      }
    ];
    this.getSpriteAnimations();

    // coordinates/hitbox
    this.updateHitbox(
      this.spriteWidth,
      this.spriteHeight,
      this.spriteScale,
      0.75,
      0,
      0
    );

    // enemy-specific properties
    this.type = 'ghost2';
    this.behavior = 'leftSine';
    this.maxSpeed = 10;
    this.speed = Math.random() * this.maxSpeed + 1;
    this.direction = 180;
    this.amplitude = 10 * Math.random();
    this.angularSpeed = 10 * Math.random();
    this.angle = 0;
  }

  move(deltaTime) {
    this.x += this.speed * Math.cos((this.direction * Math.PI) / 180);
    this.y += this.amplitude * Math.sin(((this.angle % 360) * Math.PI) / 180);
    this.angle += this.angularSpeed;
  }

  draw(deltaTime) {
    this.game.ctx.save();
    this.game.ctx.globalAlpha = 0.6;
    super.draw(deltaTime);
    this.game.ctx.restore();
  }
}

///////////////////////////////////////////
// Spider Class
///////////////////////////////////////////

export class Spider extends Entity {
  constructor(game, x, y) {
    super(game, x, y);
    // sprite info
    this.image.src = 'assets/sprites/enemy_spider.png';
    this.spriteWidth = 310;
    this.spriteHeight = 175;
    this.spriteScale = 0.5;

    // sprite-sheet animations/frames
    this.animationStates = [
      {
        name: 'idle',
        frames: 4
      }
    ];
    this.getSpriteAnimations();

    // coordinates/hitbox
    this.updateHitbox(
      this.spriteWidth,
      this.spriteHeight,
      this.spriteScale,
      0.75,
      0,
      0
    );

    // enemy-specific properties
    this.type = 'worm';
    this.behavior = 'crawl';
    this.maxSpeed = 0.5;
    this.vy = Math.random() * this.maxSpeed;
    this.maxLength = Math.random() * (this.game.canvasHeight - 100) + 100;
  }

  draw(ctx, deltaTime) {
    ctx.beginPath();
    ctx.moveTo(this.x + this.width * 0.5, 0);
    ctx.lineTo(this.x + this.width * 0.5, this.y);
    ctx.stroke();
    super.draw(ctx, deltaTime);
  }
  move(deltaTime) {
    super.move(deltaTime);
    if (this.y > this.maxLength) this.vy *= -1;
    if (this.y < 0) this.vy *= -1;
  }
}
