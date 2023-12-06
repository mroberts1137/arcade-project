export default class Entity {
  constructor(game, x, y) {
    this.game = game;
    this.gameFrame = 0;

    // state properties
    this.state = 'idle';
    this.markedForDeletion = false;
    this.collisionId = 0;
    this.outOfBounds = 'wrap'; // out-of-bounds behavior

    // coordinates/hitbox
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.width = 100;
    this.height = 100;
    this.hitbox = {
      x: x,
      y: y,
      width: 100,
      height: 100,
      scale: 0.75,
      xOffset: 0,
      yOffset: 0
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

  update(deltaTime) {
    ++this.gameFrame;
    this.move(deltaTime);
    // update hitbox
    this.hitbox.x = this.x + this.hitbox.xOffset;
    this.hitbox.y = this.y + this.hitbox.yOffset;

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
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
  }

  getAnimation(deltaTime) {
    this.animationTick += deltaTime;
    let sprite = this.spriteAnimations[this.state].loc;
    if (this.animationTick > this.animationSpeed) {
      this.animationTick = 0;
      this.animationFrame = (this.animationFrame + 1) % sprite.length;
    }
    return {
      frameX: sprite[this.animationFrame].x,
      frameY: sprite[this.animationFrame].y
    };
  }

  draw(deltaTime) {
    const { frameX, frameY } = this.getAnimation(deltaTime);

    if (window.debug.DRAW_HITBOX)
      this.game.ctx.strokeRect(
        this.hitbox.x,
        this.hitbox.y,
        this.hitbox.width,
        this.hitbox.height
      );
    this.game.ctx.drawImage(
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
}
