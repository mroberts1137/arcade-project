/** @type {HTMLCanvasElement} */

import { Bat, Bat2, Ghost, Wheel, Worm, Ghost2, Spider } from './enemy.js';
import Player from './player.js';
import Layer from './background.js';

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = (canvas.width = 800);
const CANVAS_HEIGHT = (canvas.height = 600);

const pauseButton = document.querySelector('#pauseButton');
pauseButton.addEventListener('click', pauseGame);

/////////////////////////////////////////////////////////////////
// GLOBAL PROPERTIES
/////////////////////////////////////////////////////////////////

window.global = {
  TICK_SPEED: 5,
  CANVAS_WIDTH: CANVAS_WIDTH,
  CANVAS_HEIGHT: CANVAS_HEIGHT,
  ctx: ctx,
  FPS: 60,
  gamePaused: false
};

window.debug = {
  DRAW_HITBOX: false
};

const backgroundLayer1 = new Image();
backgroundLayer1.src = 'assets/backgrounds/layer-1.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = 'assets/backgrounds/layer-2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = 'assets/backgrounds/layer-3.png';
const backgroundLayer4 = new Image();
backgroundLayer4.src = 'assets/backgrounds/layer-4.png';
const backgroundLayer5 = new Image();
backgroundLayer5.src = 'assets/backgrounds/layer-5.png';

/////////////////////////////////////////////////////////////////
// GAME CLASS
/////////////////////////////////////////////////////////////////

class Game {
  constructor(ctx, canvasWidth, canvasHeight) {
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.enemies = [];
    this.backgrounds = [];
    this.player = new Player(this, 150, 320);
    this.player.state = 'run';
    this.#addNewEnemy();
    this.#addBackground();

    this.gameFrame = 0;
  }
  update(deltaTime) {
    // delete enemies marked for deletion
    this.enemies = this.enemies.filter((obj) => !obj.markedForDeletion);

    [...this.backgrounds, this.player, ...this.enemies].forEach((object) =>
      object.update(deltaTime)
    );
  }

  draw(deltaTime) {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    [...this.backgrounds, this.player, ...this.enemies].forEach((object) =>
      object.draw(deltaTime)
    );
  }

  #addNewEnemy() {
    this.enemies.push(new Bat(this, 200, 100));
    this.enemies.push(new Bat2(this, 200, 100));
    this.enemies.push(new Ghost(this, 200, 100));
    this.enemies.push(new Wheel(this, 200, 100));
    this.enemies.push(new Worm(this, 200, 500));
    this.enemies.push(new Ghost2(this, 200, 400));
    this.enemies.push(new Spider(this, 200, 0));
    this.enemies.push(new Spider(this, 400, 0));
    this.enemies.push(new Spider(this, 500, 0));
  }

  #addBackground() {
    this.backgrounds.push(new Layer(backgroundLayer1, 0.2));
    this.backgrounds.push(new Layer(backgroundLayer2, 0.4));
    this.backgrounds.push(new Layer(backgroundLayer3, 0.6));
    this.backgrounds.push(new Layer(backgroundLayer4, 0.8));
    this.backgrounds.push(new Layer(backgroundLayer5, 1));
  }
}

/////////////////////////////////////////////////////////////////
// GLOBAL FUNCTIONS
/////////////////////////////////////////////////////////////////

function pauseGame() {
  if (!window.global.gamePaused) {
    window.global.gamePaused = true;
    pauseButton.innerText = 'Play';
  } else {
    window.global.gamePaused = false;
    pauseButton.innerText = 'Pause';
  }
}

/////////////////////////////////////////////////////////////////
// GAME INITIALIZE
/////////////////////////////////////////////////////////////////

const game = new Game(ctx, canvas.width, canvas.height);

// wait until all assets are fully loaded before starting the game
window.addEventListener('load', () => {
  let prevTime = 0;
  function animate(timestamp) {
    if (!window.global.gamePaused) {
      let deltaTime = timestamp - prevTime;
      prevTime = timestamp;

      // iterate over all game objects and update/draw
      game.update(deltaTime);
      game.draw(deltaTime);

      game.player.collisionId = 0;
      game.enemies.forEach((enemy) => {
        if (game.player.checkCollision(enemy.hitbox))
          game.player.collisionId = 1;
      });

      game.gameFrame++;
    }
    requestAnimationFrame(animate);
  }

  /////////////////////////////////////////////////////////////////
  // GAME LOOP
  /////////////////////////////////////////////////////////////////

  animate(0);
});
