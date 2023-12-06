import Entity from './entity.js';

export default class Player extends Entity {
  constructor(game, x, y) {
    super(game, x, y);
    // sprite info
    this.image.src = 'assets/sprites/shadow_dog.png';
    this.spriteWidth = 575;
    this.spriteHeight = 523;
    this.spriteScale = 0.5;

    this.state = 'idle';

    // coordinates/hitbox
    this.width = this.spriteWidth * this.spriteScale;
    this.height = this.spriteHeight * this.spriteScale;
    this.hitbox.scale = 0.75;
    this.hitbox.width = this.width * this.hitbox.scale;
    this.hitbox.height = this.height * this.hitbox.scale;
    this.hitbox.xOffset = (1 - this.hitbox.scale) * this.width * 0.5;
    this.hitbox.yOffset = this.height - this.hitbox.height;
    this.hitbox.x = this.x + this.hitbox.xOffset;
    this.hitbox.y = this.y + this.hitbox.yOffset;

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

  move() {}
}
