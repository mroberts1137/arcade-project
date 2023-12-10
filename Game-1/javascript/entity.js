export default class Entity {
  constructor(game, x, y) {
    this.game = game;
    this.gameFrame = 0;

    // state properties
    this.state = 'idle';
    this.markedForDeletion = false;
    this.collisionId = 0;
    this.outOfBounds = 'wrap'; // out-of-bounds behavior
    this.edgeOfBounds = 'wrap'; // behavior for reaching edge of screen

    // coordinates/hitbox
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.frictionX = 0;
    this.frictionY = 0;
    this.maxVx = 0.5;
    this.maxVy = 0.5;
    this.solid = false;
    this.width = 100;
    this.height = 100;
    this.hitbox = {
      x: x,
      y: y,
      width: 100,
      height: 100,
      scale: 0.75,
      xOffset: 0,
      yOffset: 0,
      left: x,
      right: 100,
      top: y,
      bottom: 100
    };

    // sprite/animation properties
    this.image = new Image();
    this.spriteWidth = 100;
    this.spriteHeight = 100;
    this.spriteScale = 1;
    this.animationTick = 0;
    this.animationSpeed = 50;
    this.animationFrame = 0;
    this.spriteAnimations = []; // spriteSheet[animation] = { frame x, frame y }
    this.animationStates = []; // { animation state, frames }
  }

  ////////////////////////////////////////////////////////////
  // MOTION/LOGIC FUNCTIONS
  ////////////////////////////////////////////////////////////

  update(deltaTime) {
    ++this.gameFrame;
    this.move(deltaTime);
    // update hitbox
    this.hitbox.x = this.x + this.hitbox.xOffset;
    this.hitbox.y = this.y + this.hitbox.yOffset;
    this.hitbox.left = this.x + this.hitbox.xOffset;
    this.hitbox.right = this.x + this.hitbox.xOffset + this.hitbox.width;
    this.hitbox.top = this.y + this.hitbox.yOffset;
    this.hitbox.bottom = this.y + this.hitbox.yOffset + this.hitbox.height;

    // edge-of-bounds
    const leftEOB = this.x <= 0;
    const rightEOB = this.x >= this.game.canvasWidth - this.width;
    const topEOB = this.y <= 0;
    const bottomEOB = this.y >= this.game.canvasHeight - this.height;

    // out-of-bounds
    const leftOOB = this.x < -this.width;
    const rightOOB = this.x > this.game.canvasWidth;
    const topOOB = this.y < -this.height;
    const bottomOOB = this.y > this.game.canvasHeight;
    switch (this.outOfBounds) {
      case 'wrap':
        if (rightOOB) this.x = -this.width;
        if (leftOOB) this.x = this.game.canvasWidth;
        if (bottomOOB) this.y = -this.height;
        if (topOOB) this.y = this.game.canvasHeight;
        break;
      case 'delete':
        if (leftOOB || rightOOB || topOOB || bottomOOB) {
          this.markedForDeletion = true;
        }
        break;
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
    if (Math.abs(this.vx + this.ax) < this.maxVx) this.vx += this.ax;
    if (Math.abs(this.vy + this.ay) < this.maxVy) this.vy += this.ay;
    switch (this.edgeOfBounds) {
      case 'wrap':
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        break;
      case 'stop':
        if (
          this.hitbox.left + this.vx * deltaTime > 0 &&
          this.hitbox.right + this.vx * deltaTime <= this.game.canvasWidth
        ) {
          this.x += this.vx * deltaTime;
        } else {
          this.vx = 0;
          this.ax = 0;
        }
        if (
          this.hitbox.top + this.vy * deltaTime > 0 &&
          this.hitbox.bottom + this.vy * deltaTime <= this.game.canvasHeight
        ) {
          this.y += this.vy * deltaTime;
        } else {
          this.vy = 0;
          this.ay = 0;
        }
        break;
    }
  }

  placeFree(x, y) {
    if (y < this.game.ground) {
      return true;
    } else return false;
  }

  checkCollision(rect) {
    if (
      this.hitbox.x > rect.x + rect.width ||
      this.hitbox.x + rect.width < rect.x ||
      this.hitbox.y > rect.y + rect.height ||
      this.hitbox.y + rect.height < rect.y
    )
      return false;
    else return true;
  }

  updateHitbox(
    spriteWidth,
    spriteHeight,
    spriteScale,
    scale,
    xOffset,
    yOffset
  ) {
    this.width = Math.floor(spriteWidth * spriteScale);
    this.height = Math.floor(spriteHeight * spriteScale);
    this.hitbox.width = Math.floor(this.width * scale);
    this.hitbox.height = Math.floor(this.height * scale);
    this.hitbox.xOffset = Math.floor((1 - scale) * this.width * 0.5);
    this.hitbox.yOffset = Math.floor(this.height - this.hitbox.height);
    this.hitbox.x = this.x + this.hitbox.xOffset;
    this.hitbox.y = this.y + this.hitbox.yOffset;
    this.hitbox.left = this.x + this.hitbox.xOffset;
    this.hitbox.right = this.x + this.hitbox.xOffset + this.hitbox.width;
    this.hitbox.top = this.y + this.hitbox.yOffset;
    this.hitbox.bottom = this.y + this.hitbox.yOffset + this.hitbox.height;
  }

  ////////////////////////////////////////////////////////////
  // DRAWING FUNCTIONS
  ////////////////////////////////////////////////////////////

  draw(ctx, deltaTime) {
    const { frameX, frameY } = this.getAnimation(deltaTime);

    if (window.debug.DRAW_HITBOX)
      ctx.strokeRect(
        this.hitbox.x,
        this.hitbox.y,
        this.hitbox.width,
        this.hitbox.height
      );
    ctx.drawImage(
      this.image,
      frameX,
      frameY,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  getAnimation(deltaTime) {
    this.animationTick += deltaTime;
    try {
      let sprite = this.spriteAnimations[this.state].loc;
      if (this.animationTick > this.animationSpeed) {
        this.animationTick = 0;
        this.animationFrame = (this.animationFrame + 1) % sprite.length;
      }
      // in case sprite states have changed mid-animation and have different frame counts
      this.animationFrame = this.animationFrame % sprite.length;
      return {
        frameX: sprite[this.animationFrame].x,
        frameY: sprite[this.animationFrame].y
      };
    } catch (error) {
      console.log(error.message);
    }
  }

  getSpriteAnimations() {
    // calculate sprite positions in sprite sheet:
    this.animationStates.forEach((state, index) => {
      let frames = {
        loc: []
      };
      for (let i = 0; i < state.frames; i++) {
        let positionX = i * this.spriteWidth;
        let positionY = index * this.spriteHeight;
        frames.loc.push({ x: positionX, y: positionY });
      }
      this.spriteAnimations[state.name] = frames;
    });
  }
}
