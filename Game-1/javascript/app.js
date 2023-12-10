/** @type {HTMLCanvasElement} */

import {
  Bat,
  Bug,
  Bee,
  Wheel,
  Worm,
  Ghost2,
  Spider,
  Crawler
} from './enemy.js';
import Player from './player.js';
import Layer from './background.js';

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = (canvas.width = 800);
const CANVAS_HEIGHT = (canvas.height = 600);

/////////////////////////////////////////////////////////////////
// GLOBAL PROPERTIES
/////////////////////////////////////////////////////////////////

window.global = {
  TICK_SPEED: 0,
  CANVAS_WIDTH: CANVAS_WIDTH,
  CANVAS_HEIGHT: CANVAS_HEIGHT,
  ctx: ctx,
  FPS: 60,
  gamePaused: false
};

window.debug = {
  DRAW_HITBOX: false,
  DRAW_INFO: false
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

    this.pauseButton = document.querySelector('#pauseButton');
    this.pauseButton.addEventListener('click', () => {
      this.pauseGame();
    });
    this.muteButton = document.querySelector('#muteMusic');
    this.muteButton.addEventListener('click', () => {
      this.muteMusic();
    });

    this.inputHandler = new InputHandler();

    this.music = new Audio();
    this.music.src = 'assets/music/random_silly_chip_song.ogg';

    this.ctx.font = 'italic bold 30px Arial';

    this.enemies = [];
    this.backgrounds = [];
    this.#addBackground();
    this.playerStartX = 150;
    this.playerStartY = 482;
    this.player = new Player(
      this,
      this.playerStartX,
      this.playerStartY,
      this.inputHandler
    );

    this.gameFrame = 0;
    this.levelSpeed = 0;
    this.gamePause = false;
    this.ground = this.canvasHeight - 18;
    this.musicVolume = 1;

    this.startTime = 3000;
    this.startLevel();
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
      object.draw(this.ctx, deltaTime)
    );
    if (this.levelState === 'start') this.drawStartLevel();
    else this.displayStatusText();

    if (window.debug.DRAW_INFO) {
      this.ctx.textAlign = 'left';
      this.ctx.fillStyle = 'black';
      this.ctx.fillText(`Level State: ${this.levelState}`, 50, 100);
    }
  }

  #addNewEnemy() {
    // this.enemies.push(new Bat(this, 200, 100));
    this.enemies.push(
      new Bug(this, this.canvasWidth - 100, Math.random() * this.canvasHeight)
    );
    this.enemies.push(
      new Bee(this, this.canvasWidth - 100, Math.random() * this.canvasHeight)
    );
    // this.enemies.push(new Ghost(this, 200, 100));
    // this.enemies.push(new Wheel(this, 200, 100));
    // this.enemies.push(new Worm(this, 200, 500));
    // this.enemies.push(new Ghost2(this, 200, 400));
    // this.enemies.push(new Spider(this, 200, 0));
    // this.enemies.push(new Spider(this, 400, 0));
    // this.enemies.push(new Spider(this, 500, 0));
    this.enemies.push(new Crawler(this, 20, 500));
  }

  #addBackground() {
    this.backgrounds.push(new Layer(this, backgroundLayer1, 0.2));
    this.backgrounds.push(new Layer(this, backgroundLayer2, 0.4));
    this.backgrounds.push(new Layer(this, backgroundLayer3, 0.6));
    this.backgrounds.push(new Layer(this, backgroundLayer4, 0.8));
    this.backgrounds.push(new Layer(this, backgroundLayer5, 1));
  }

  pauseGame() {
    if (!this.gamePaused) {
      this.gamePaused = true;
      this.pauseButton.innerText = 'Play';
      this.music.pause();
    } else {
      this.gamePaused = false;
      this.pauseButton.innerText = 'Pause';
      this.music.play();
    }
  }

  startLevel() {
    this.levelState = 'start';
    this.levelSpeed = 0;
    this.enemies = [];

    setTimeout(() => {
      this.levelState = 'run';
      this.levelSpeed = 5;
      this.player.state = 'run';
      this.player.animationSpeed = 20;
      this.#addNewEnemy();

      this.music.loop = true;
      this.music.volume = this.musicVolume;
      this.music.play();
    }, this.startTime);
  }

  drawStartLevel() {
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText('Start!', canvas.width / 2 + 2, canvas.height / 2 + 2);
    this.ctx.fillStyle = 'green';
    this.ctx.fillText('Start!', canvas.width / 2, canvas.height / 2);
  }

  displayStatusText() {
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(`Health: ${this.player.health}`, 52, 52);
    this.ctx.fillStyle = 'lightblue';
    this.ctx.fillText(`Health: ${this.player.health}`, 50, 50);
  }

  muteMusic() {
    if (this.music.volume > 0) {
      this.music.volume = 0;
      this.muteButton.classList.add('line-through');
    } else {
      this.music.volume = 1;
      this.muteButton.classList.remove('line-through');
    }
  }
}

/////////////////////////////////////////////////////////////////
// InputHandler Class
/////////////////////////////////////////////////////////////////

class InputHandler {
  constructor() {
    this.keys = [];
    window.addEventListener('keydown', (e) => {
      if (
        (e.code === 'ArrowLeft' ||
          e.code === 'ArrowRight' ||
          e.code === 'ArrowUp' ||
          e.code === 'ArrowDown' ||
          e.code === 'Space') &&
        !this.keys.includes(e.code)
      ) {
        this.keys.push(e.code);
      }
    });
    window.addEventListener('keyup', (e) => {
      if (
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight' ||
        e.code === 'ArrowUp' ||
        e.code === 'ArrowDown' ||
        e.code === 'Space'
      ) {
        const idx = this.keys.indexOf(e.code);
        this.keys.splice(idx, 1);
      }
    });
  }
}

/////////////////////////////////////////////////////////////////
// GLOBAL FUNCTIONS
/////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////
// GAME INITIALIZE
/////////////////////////////////////////////////////////////////

const game = new Game(ctx, canvas.width, canvas.height);

// wait until all assets are fully loaded before starting the game
window.addEventListener('load', () => {
  let prevTime = 0;
  function animate(timestamp) {
    if (!game.gamePaused) {
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
