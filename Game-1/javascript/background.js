export default class Layer {
  constructor(game, image, speedModifier, x, y, width, height) {
    this.game = game;
    this.image = image;
    this.speedModifier = speedModifier;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = window.global.TICK_SPEED * this.speedModifier;
  }

  update(deltaTime) {
    this.speed = this.game.levelSpeed * this.speedModifier;
    if (this.x <= -this.width) this.x = 0;
    this.x = Math.floor(this.x - this.speed);
  }
  draw(ctx, deltaTime) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }
}
