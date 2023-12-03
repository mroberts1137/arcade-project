export default class Layer {
  constructor(image, speedModifier) {
    this.image = image;
    this.speedModifier = speedModifier;
    this.x = 0;
    this.y = 0;
    this.width = 2400;
    this.height = 700;
    this.speed = window.global.TICK_SPEED * this.speedModifier;
  }

  update() {
    this.speed = window.global.TICK_SPEED * this.speedModifier;
    if (this.x <= -this.width) this.x = 0;
    this.x = Math.floor(this.x - this.speed);
  }
  draw() {
    window.global.ctx.drawImage(
      this.image,
      this.x,
      this.y,
      this.width,
      this.height
    );
    window.global.ctx.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }
}
