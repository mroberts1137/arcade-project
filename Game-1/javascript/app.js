/** @type {HTMLCanvasElement} */

import { Bug, Bee, Crawler, Ghost } from './enemy.js';
import Player from './player.js';
import Layer from './background.js';
import Explosion from './explosion.js';
import Star from './star.js';

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

// wait until all assets are fully loaded before starting the game
window.addEventListener('load', () => {
  const backgroundLayer1 = new Image();
  backgroundLayer1.src = 'assets/backgrounds/layer-1.png';
  const backgroundLayer2 = new Image();
  backgroundLayer2.src = 'assets/backgrounds/layer-2.png';
  const backgroundLayer3 = new Image();
  backgroundLayer3.src = 'assets/backgrounds/layer-3.png';
  const backgroundLayer4 = new Image();
  backgroundLayer4.src = 'assets/backgrounds/layer-4.png';
  const backgroundGround = new Image();
  backgroundGround.src = 'assets/backgrounds/ground.png';

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
      // this.muteButton = document.querySelector('#muteMusic');
      // this.muteButton.addEventListener('click', () => {
      //   this.muteMusic();
      // });
      this.volumeSlider = document.querySelector('#musicVolume');
      this.volumeSlider.addEventListener('input', (e) => {
        this.setVolume(e.target.value / 100);
      });

      this.inputHandler = new InputHandler();

      this.music = new Audio();
      this.music.src = 'assets/music/random_silly_chip_song.ogg';

      this.heartFull = new Image();
      this.heartFull.src = 'assets/sprites/heart-full.png';
      this.heartEmpty = new Image();
      this.heartEmpty.src = 'assets/sprites/heart-empty.png';
      this.heartWidth = 40;

      this.ctx.font = 'italic bold 30px Arial';

      this.enemies = [];
      this.backgrounds = [];
      this.explosions = [];
      this.stars = [];
      this.#addBackground();
      this.playerStartX = 150;
      this.playerStartY = 400;
      this.player = new Player(
        this,
        this.playerStartX,
        this.playerStartY,
        this.inputHandler
      );

      this.gameFrame = 0;
      this.levelSpeed = 0;
      this.startSpeed = 3;
      this.gamePause = false;
      this.ground = this.canvasHeight - 100;
      this.musicVolume = 1;
      this.score = 0;
      this.highScore = 0;

      this.startTime = 3000;
      this.startLevel();

      this.spawnEnemyTimer = 4000;
      this.spawnEnemyTick = 0;
      this.spawnStarTimer = 3000;
      this.spawnStarTick = 0;
      this.speedUpTimer = 10000;
      this.speedUpTick = 10000;
    }
    update(deltaTime) {
      this.gameFrame++;
      this.spawnEnemyTick -= deltaTime;
      this.spawnStarTick -= deltaTime;
      this.speedUpTick -= deltaTime;
      if (this.spawnEnemyTick < 0) {
        this.spawnEnemyTick = this.spawnEnemyTimer;
        if (this.spawnEnemyTimer > 1000) this.spawnEnemyTimer -= 100;
        this.#addNewEnemy();
      }
      if (this.spawnStarTick < 0) {
        this.spawnStarTick = this.spawnStarTimer;
        if (this.spawnStarTimer > 1000) this.spawnStarTimer -= 100;
        this.createStar();
      }
      if (this.speedUpTick < 0) {
        this.speedUpTick = this.speedUpTimer;
        if (
          this.levelSpeed < 20 &&
          !this.gamePaused &&
          this.levelState === 'run' &&
          this.player.state !== 'dead'
        )
          this.levelSpeed += 1;
      }

      // delete enemies marked for deletion
      this.enemies = this.enemies.filter((obj) => !obj.markedForDeletion);
      this.explosions = this.explosions.filter((obj) => !obj.markedForDeletion);
      this.stars = this.stars.filter((obj) => !obj.markedForDeletion);

      [
        ...this.backgrounds,
        this.player,
        ...this.enemies,
        ...this.stars,
        ...this.explosions
      ].forEach((object) => object.update(deltaTime));
    }

    draw(deltaTime) {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      [
        ...this.backgrounds,
        this.player,
        ...this.enemies,
        ...this.stars,
        ...this.explosions
      ].forEach((object) => object.draw(this.ctx, deltaTime));

      if (this.levelState === 'start') this.drawStartLevel();
      else this.displayStatusText();

      if (window.debug.DRAW_INFO) {
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(`Level State: ${this.levelSpeed}`, 50, 100);
      }
    }

    #addNewEnemy() {
      if (
        !this.gamePaused &&
        this.levelState === 'run' &&
        this.player.state !== 'dead'
      ) {
        const enemyList = ['bug', 'crawler', 'bee', 'ghost'];
        const selection =
          enemyList[Math.floor(Math.random() * enemyList.length)];

        switch (selection) {
          case 'bug':
            this.enemies.push(
              new Bug(
                this,
                this.canvasWidth,
                Math.random() * (this.canvasHeight * 0.25) +
                  this.canvasHeight * 0.35
              )
            );
            break;
          case 'crawler':
            this.enemies.push(new Crawler(this, this.canvasWidth, this.ground));
            break;
          case 'bee':
            this.enemies.push(
              new Bee(
                this,
                this.canvasWidth,
                Math.random() * (this.canvasHeight * 0.25) +
                  this.canvasHeight * 0.15
              )
            );
            break;
          case 'ghost':
            this.enemies.push(
              new Ghost(this, this.canvasWidth, this.canvasHeight * 0.5)
            );
            break;
        }
      }
    }

    #addBackground() {
      this.backgrounds.push(
        new Layer(
          this,
          backgroundLayer1,
          0.2,
          0,
          0,
          this.canvasWidth,
          this.canvasHeight - 100
        )
      );
      this.backgrounds.push(
        new Layer(
          this,
          backgroundLayer2,
          0.4,
          0,
          0,
          this.canvasWidth,
          this.canvasHeight - 100
        )
      );
      this.backgrounds.push(
        new Layer(
          this,
          backgroundLayer3,
          0.6,
          0,
          0,
          this.canvasWidth,
          this.canvasHeight - 100
        )
      );
      this.backgrounds.push(
        new Layer(
          this,
          backgroundLayer4,
          0.8,
          0,
          0,
          this.canvasWidth,
          this.canvasHeight - 100
        )
      );
      this.backgrounds.push(
        new Layer(
          this,
          backgroundGround,
          1,
          0,
          this.canvasHeight - 100,
          this.canvasWidth,
          100
        )
      );
    }

    createExplosion(x, y) {
      this.explosions.push(new Explosion(this, x, y));
    }

    createStar(x, y) {
      if (
        !this.gamePaused &&
        this.levelState === 'run' &&
        this.player.state !== 'dead'
      ) {
        this.stars.push(
          new Star(
            this,
            this.canvasWidth,
            Math.random() * (this.canvasHeight * 0.3) + this.canvasHeight * 0.4
          )
        );
      }
    }

    checkPlayerCollisions() {
      this.player.collisionId = 0;
      this.enemies.forEach((enemy) => {
        if (this.player.checkCollision(enemy.hitbox)) {
          this.player.collisionId = 1;
          this.player.checkBounceOnEnemy(enemy);
        }
      });
      this.stars.forEach((star) => {
        if (this.player.checkCollision(star.hitbox)) {
          this.player.collisionId = 2;
          star.collect();
          this.score += 10;
          if (this.score > this.highScore) this.highScore = this.score;
        }
      });
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
      this.explosions = [];
      this.stars = [];
      this.spawnEnemyTimer = 4000;
      this.spawnEnemyTick = 0;
      this.spawnStarTimer = 3000;
      this.spawnStarTick = 0;
      this.speedUpTimer = 10000;
      this.speedUpTick = 10000;
      if (this.score > this.highScore) this.highScore = this.score;
      this.score = 0;

      setTimeout(() => {
        this.levelState = 'run';
        this.levelSpeed = this.startSpeed;
        this.player.state = 'run';
        this.player.animationSpeed =
          this.player.spriteProps[this.player.state].speed;

        this.music.loop = true;
        this.music.volume = this.musicVolume;
        this.music.play();
      }, this.startTime);
    }

    drawStartLevel() {
      this.ctx.font = 'italic bold 45px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = 'black';
      this.ctx.fillText('Start!', canvas.width / 2 + 2, canvas.height / 2 + 2);
      this.ctx.fillStyle = '#CC0044';
      this.ctx.fillText('Start!', canvas.width / 2, canvas.height / 2);
    }

    displayStatusText() {
      // player health
      for (let i = 1; i <= this.player.startHealth; i++) {
        if (this.player.health >= i)
          this.ctx.drawImage(
            this.heartFull,
            25 + (i - 1) * this.heartWidth,
            25,
            this.heartWidth,
            this.heartWidth
          );
        else
          this.ctx.drawImage(
            this.heartEmpty,
            25 + (i - 1) * this.heartWidth,
            25,
            this.heartWidth,
            this.heartWidth
          );
      }

      this.ctx.font = 'italic bold 30px Arial';
      // score
      this.ctx.textAlign = 'right';
      this.ctx.fillStyle = 'black';
      this.ctx.fillText(`Score: ${this.score}`, this.canvasWidth - 52, 52);
      this.ctx.fillStyle = '#004477';
      this.ctx.fillText(`Score: ${this.score}`, this.canvasWidth - 50, 50);

      // high score
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = 'black';
      this.ctx.fillText(
        `High Score: ${this.highScore}`,
        this.canvasWidth * 0.5,
        52
      );
      this.ctx.fillStyle = '#222277';
      this.ctx.fillText(
        `High Score: ${this.highScore}`,
        this.canvasWidth * 0.5,
        50
      );
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

    setVolume(volume) {
      this.musicVolume = volume;
      this.music.volume = volume;
    }
  }

  /////////////////////////////////////////////////////////////////
  // InputHandler Class
  /////////////////////////////////////////////////////////////////

  class InputHandler {
    constructor() {
      this.keys = [];
      window.addEventListener('keydown', (e) => {
        e.stopPropagation;
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

  let prevTime = 0;

  function animate(timestamp) {
    if (!game.gamePaused) {
      let deltaTime = timestamp - prevTime;
      prevTime = timestamp;

      // iterate over all game objects and update/draw
      game.update(deltaTime);
      game.draw(deltaTime);

      // check for enemy collisions with player
      game.checkPlayerCollisions();
    }
    requestAnimationFrame(animate);
  }

  /////////////////////////////////////////////////////////////////
  // GAME LOOP
  /////////////////////////////////////////////////////////////////

  animate(0);
});
