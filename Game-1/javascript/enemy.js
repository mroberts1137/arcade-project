export class Enemy {
  constructor(x, y) {
    this.gameFrame = 0;
    this.image = new Image();
    this.spriteScale = 2;

    // coordinates/hitbox
    this.rect = {
      x: x,
      y: y,
      width: 100,
      height: 100
    };

    // animation frame & speed
    this.frame = 0;
    this.animationSpeed = Math.floor(Math.random() * 4) + 1;
  }

  update() {
    this.gameFrame++;
    this.move();
    this.animateFrame();

    // out-of-bounds
    if (this.rect.x > window.global.CANVAS_WIDTH)
      this.rect.x = -this.rect.width;
    if (this.rect.x < -this.rect.width)
      this.rect.x = window.global.CANVAS_WIDTH;
    if (this.rect.y > window.global.CANVAS_HEIGHT)
      this.rect.y = -this.rect.height;
    if (this.rect.y < -this.rect.height)
      this.rect.y = window.global.CANVAS_HEIGHT;
  }
  move() {}
  animateFrame() {
    if (this.gameFrame % (window.global.TICK_SPEED * this.animationSpeed) === 0)
      this.frame > this.animationFrames ? (this.frame = 0) : this.frame++;
  }
  draw() {
    if (window.debug.DRAW_HITBOX)
      window.global.ctx.strokeRect(
        this.rect.x,
        this.rect.y,
        this.rect.width,
        this.rect.height
      );
    window.global.ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.rect.x,
      this.rect.y,
      this.rect.width,
      this.rect.height
    );
  }
}

export class Bat extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.type = 'bat';
    this.image.src = 'assets/sprites/enemy1.png';
    this.behavior = 'shake';
    this.spriteWidth = 293;
    this.spriteHeight = 155;
    this.maxSpeed = 10;
    this.animationFrames = 4;

    this.rect.width = this.spriteWidth / this.spriteScale;
    this.rect.height = this.spriteHeight / this.spriteScale;

    this.speed = (Math.random() * 2 - 1) * this.maxSpeed;
    this.direction = Math.random() * 360;
  }

  move() {
    this.direction = Math.random() * 360;
    this.rect.x += this.speed * Math.cos((this.direction * Math.PI) / 180);
    this.rect.y -= this.speed * Math.sin((this.direction * Math.PI) / 180);
  }
}

export class Bat2 extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.type = 'bat2';
    this.image.src = 'assets/sprites/enemy2.png';
    this.behavior = 'leftSine';
    this.spriteWidth = 266;
    this.spriteHeight = 188;
    this.maxSpeed = 10;
    this.animationFrames = 4;

    this.rect.width = this.spriteWidth / this.spriteScale;
    this.rect.height = this.spriteHeight / this.spriteScale;

    this.speed = Math.random() * this.maxSpeed;
    this.direction = 180;
    this.amplitude = 10 * Math.random();
    this.angularSpeed = 10 * Math.random();
    this.angle = 0;
  }

  move() {
    this.rect.x += this.speed * Math.cos((this.direction * Math.PI) / 180);
    this.rect.y -=
      this.amplitude * Math.sin(((this.angle % 360) * Math.PI) / 180);
    this.angle += this.angularSpeed;
  }
}

export class Ghost extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.type = 'ghost';
    this.image.src = 'assets/sprites/enemy3.png';
    this.behavior = 'leftSine';
    this.spriteWidth = 218;
    this.spriteHeight = 177;
    this.maxSpeed = 10;
    this.animationFrames = 4;

    this.rect.width = this.spriteWidth / this.spriteScale;
    this.rect.height = this.spriteHeight / this.spriteScale;

    this.angularSpeed = 4 * Math.random() + 1;
    this.angle = 0;
    this.nx = 1;
    this.ny = 2;
  }

  move() {
    this.rect.x =
      ((window.global.CANVAS_WIDTH - this.rect.width) / 2) *
      (Math.sin((this.nx * (this.angle % 360) * Math.PI) / 180) + 1);
    this.rect.y =
      ((window.global.CANVAS_HEIGHT - this.rect.height) / 2) *
      (Math.sin((this.ny * (this.angle % 360) * Math.PI) / 180) + 1);
    this.angle += this.angularSpeed;
  }
}

export class Wheel extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.type = 'wheel';
    this.image.src = 'assets/sprites/enemy4.png';
    this.behavior = 'leftSine';
    this.spriteWidth = 213;
    this.spriteHeight = 213;
    this.maxSpeed = 10;
    this.animationFrames = 7;

    this.rect.width = this.spriteWidth / this.spriteScale;
    this.rect.height = this.spriteHeight / this.spriteScale;

    this.moveInterval = Math.floor(Math.random() * 200 + 50);
    this.newX = this.rect.x;
    this.newY = this.rect.y;
  }

  move() {
    if (this.gameFrame % this.moveInterval === 0) {
      this.newX =
        Math.random() * (window.global.CANVAS_WIDTH - this.rect.width);
      this.newY =
        Math.random() * (window.global.CANVAS_HEIGHT - this.rect.height);
    }
    let dx = this.rect.x - this.newX;
    let dy = this.rect.y - this.newY;
    this.rect.x -= dx / 20;
    this.rect.y -= dy / 20;
  }
}
