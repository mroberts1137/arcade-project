import Entity from './entity.js';

///////////////////////////////////////////
// Bug Class
///////////////////////////////////////////

export class Bug extends Entity {
  constructor(game, x, y) {
    super(game, x, y);
    // sprite info
    if (Math.floor(Math.random() * 4) === 0) {
      this.image.src = 'assets/sprites/eye-bug.png';
      this.spriteWidth = 253;
      this.spriteHeight = 207;
    } else {
      this.image.src = 'assets/sprites/purple-bug.png';
      this.spriteWidth = 266;
      this.spriteHeight = 207;
    }
    this.spriteScale = 0.4;
    this.state = 'fly';
    this.outOfBounds = 'delete';

    // sprite-sheet animations/frames
    this.animationStates = [
      {
        name: 'fly',
        frames: 13
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
    this.type = 'bug';
    this.behavior = 'leftSine';
    this.speedLevel = Math.random();
    this.animationSpeed = 10 + Math.floor(20 * (1 - this.speedLevel));
    this.speed = Math.floor(this.speedLevel * 6) + this.game.levelSpeed;
    this.amplitude = 50 + Math.floor(this.speedLevel * 10);
    this.angularSpeed = Math.floor(5 * this.speedLevel) + 1;
    this.angle = 0;
    this.centerX = this.x;
    this.centerY = this.y;
    this.deltaX = 0;
    this.deltaY = 0;
  }

  move(deltaTime) {
    this.x -= this.speed;
    this.deltaY =
      this.amplitude * Math.sin(((this.angle % 360) * Math.PI) / 180);
    this.y = this.centerY + this.deltaY;
    this.angle += this.angularSpeed;
  }
}

///////////////////////////////////////////
// Bee Class
///////////////////////////////////////////

export class Bee extends Entity {
  constructor(game, x, y) {
    super(game, x, y);
    // sprite info
    this.image.src = 'assets/sprites/bee.png';
    this.spriteWidth = 273;
    this.spriteHeight = 282;
    this.spriteScale = 0.4;
    this.outOfBounds = 'delete';

    // sprite-sheet animations/frames
    this.animationStates = [
      {
        name: 'idle',
        frames: 12
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
    this.type = 'bee';
    this.behavior = 'leftSine';
    this.angularSpeed = 3 * Math.random() + 1;
    this.angle = 0;
    this.nx = 1;
    this.ny = 2;
    this.centerX = this.x;
    this.centerY = this.y;
    this.deltaX = 0;
    this.deltaY = 0;
  }

  move(deltaTime) {
    this.deltaX =
      ((this.game.canvasWidth - this.width) / 8) *
      (Math.sin((this.nx * (this.angle % 360) * Math.PI) / 180) + 2);
    this.deltaY =
      ((this.game.canvasWidth - this.height) / 8) *
      (Math.sin((this.ny * (this.angle % 360) * Math.PI) / 180) + 1);
    this.angle += this.angularSpeed;
    this.centerX -= this.game.levelSpeed * 0.5;
    this.x = this.centerX + this.deltaX;
    this.y = this.centerY + this.deltaY;
  }
}

///////////////////////////////////////////
// Crawler Class
///////////////////////////////////////////

export class Crawler extends Entity {
  constructor(game, x, y) {
    super(game, x, y);

    this.animationSpeed = 25;
    this.state = 'walk';
    this.outOfBounds = 'delete';

    // sprite info
    if (Math.floor(Math.random() * 2) === 0) this.type = 'crawler';
    else this.type = 'snail';

    // sprite-sheet animations/frames
    this.animationStates = [
      {
        name: 'walk',
        frames: 20
      }
    ];
    if (this.type === 'crawler') {
      this.image.src = 'assets/sprites/crawler.png';
      this.spriteWidth = 304;
      this.spriteHeight = 197;
      this.spriteScale = 0.5;
      // coordinates/hitbox
      this.updateHitbox(
        this.spriteWidth,
        this.spriteHeight,
        this.spriteScale,
        0.75,
        0,
        -10
      );
    } else {
      this.image.src = 'assets/sprites/snail.png';
      this.spriteWidth = 267;
      this.spriteHeight = 180;
      this.spriteScale = 0.4;

      // sprite-sheet animations/frames
      this.animationStates[0].frames = 9;
      // coordinates/hitbox
      this.updateHitbox(
        this.spriteWidth,
        this.spriteHeight,
        this.spriteScale,
        0.75,
        0,
        0
      );
    }

    this.getSpriteAnimations();

    // stick to ground
    this.y = this.game.ground - this.hitbox.yOffset - this.hitbox.height;

    // enemy-specific properties

    this.behavior = 'walk';
    this.speed = this.game.levelSpeed + 1;
  }

  move(deltaTime) {
    this.x -= this.speed;
  }
}

///////////////////////////////////////////
// Ghost Class
///////////////////////////////////////////

export class Ghost extends Entity {
  constructor(game, x, y) {
    super(game, x, y);
    // sprite info
    this.image.src = 'assets/sprites/ghost-doll.png';
    this.spriteWidth = 220;
    this.spriteHeight = 300;
    this.animationSpeed = 25;
    this.spriteScale = 0.4;
    this.outOfBounds = 'delete';

    // sprite-sheet animations/frames
    this.animationStates = [
      {
        name: 'idle',
        frames: 29
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
    this.behavior = 'moveToPoint';
    this.maxSpeed = 10;
    this.moveInterval = Math.floor(Math.random() * 200 + 100);
    this.newX = this.x;
    this.newY = this.y;
  }

  move(deltaTime) {
    if (this.gameFrame % this.moveInterval === 0) {
      this.newX = Math.random() * (this.game.canvasWidth - this.width);
      this.newY = Math.random() * (this.game.canvasHeight - this.height);
    }
    this.x -= this.game.levelSpeed * 0.3;
    this.newX -= this.game.levelSpeed * 0.3;
    let dx = this.x - this.newX;
    let dy = this.y - this.newY;
    this.x -= dx / 50;
    this.y -= dy / 50;
  }
}
