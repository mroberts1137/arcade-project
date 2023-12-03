export class Player {
  constructor(x, y) {
    this.playerImage = new Image();
    this.playerImage.src = 'assets/sprites/shadow_dog.png';
    this.spriteWidth = 575;
    this.spriteHeight = 523;
    this.spriteScale = 2;
    this.playerState = 'idle';
    this.gameFrame = 0;
    this.collisionId = 0;

    // coordinates/hitbox
    this.rect = {
      x: x,
      y: y,
      width: this.spriteWidth / this.spriteScale,
      height: this.spriteHeight / this.spriteScale
    };

    this.spriteAnimations = [];
    const animationStates = [
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

    // calculate sprite positions in sprite sheet:
    animationStates.forEach((state, index) => {
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
  update() {
    this.gameFrame++;
  }
  draw() {
    let animationFrame =
      Math.floor(this.gameFrame / window.global.TICK_SPEED) %
      this.spriteAnimations[this.playerState].loc.length;
    let frameX = this.spriteAnimations[this.playerState].loc[animationFrame].x;
    let frameY = this.spriteAnimations[this.playerState].loc[animationFrame].y;

    if (window.debug.DRAW_HITBOX) {
      switch (this.collisionId) {
        case 0:
          window.global.ctx.fillStyle = 'white';
          break;
        case 1:
          window.global.ctx.fillStyle = 'red';
          break;
      }
      window.global.ctx.fillRect(
        this.rect.x,
        this.rect.y,
        this.rect.width,
        this.rect.height
      );
    }
    window.global.ctx.drawImage(
      this.playerImage,
      frameX,
      frameY,
      this.spriteWidth,
      this.spriteHeight,
      this.rect.x,
      this.rect.y,
      this.rect.width,
      this.rect.height
    );
  }
}
