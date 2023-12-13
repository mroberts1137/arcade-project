import Entity from './entity.js';

export default class Explosion extends Entity {
  constructor(game, x, y) {
    super(game, x, y);
    // sprite info
    this.image.src = 'assets/sprites/boom.png';
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.spriteScale = 0.7;
    this.animationSpeed = 50;
    this.state = 'default';

    //sound info
    this.sounds = new Audio();
    this.sounds.src = 'assets/sfx/SFX_Explosion_03.wav';

    // sprite-sheet animations/frames
    this.animationStates = [
      {
        name: 'default',
        frames: 5
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

    this.x = x - this.width * 0.5;
    this.y = y - this.height * 0.5;
    this.angle = Math.random() * 2 * Math.PI;
  }
  update(deltaTime) {
    super.update(deltaTime);
    if (this.animationFrame === 0) this.sounds.play();
    if (this.animationFrame >= 4) {
      this.markedForDeletion = true;
    }
  }
  draw(ctx, deltaTime) {
    ctx.save();
    ctx.translate(this.x + this.width * 0.5, this.y + this.height * 0.5);
    ctx.rotate(this.angle);
    ctx.translate(-this.x - this.width * 0.5, -this.y - this.height * 0.5);
    super.draw(ctx, deltaTime);
    ctx.restore();
  }
}
