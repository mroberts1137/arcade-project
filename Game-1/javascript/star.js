import Entity from './entity.js';

export default class Star extends Entity {
  constructor(game, x, y) {
    super(game, x, y);

    // sprite info
    this.image.src = 'assets/sprites/star.png';
    this.spriteWidth = 256;
    this.spriteHeight = 256;
    this.spriteScale = 0.2;
    this.animationSpeed = 50;

    this.outOfBounds = 'delete';

    // sound info
    this.sound = new Audio();
    this.sound.src = 'assets/sfx/star.wav';

    // sprite-sheet animations/frames
    this.animationStates = [
      {
        name: 'idle',
        frames: 6
      }
    ];
    this.getSpriteAnimations();

    // coordinates/hitbox
    this.updateHitbox(
      this.spriteWidth,
      this.spriteHeight,
      this.spriteScale,
      1,
      0,
      0
    );

    // object specific parameters
    this.value = 10;
    this.angle = 0;
    this.angleSpeed = 10;
    this.amplitude = 1;
  }

  move(deltaTime) {
    super.move(deltaTime);
    this.direction = Math.random() * 360;
    this.x -= this.game.levelSpeed;
    this.y += this.amplitude * Math.sin(((this.angle % 360) * Math.PI) / 180);
    this.angle += this.angleSpeed;
  }

  collect() {
    this.sound.play();
    this.markedForDeletion = true;
  }
}
