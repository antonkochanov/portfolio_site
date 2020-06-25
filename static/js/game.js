'use strict'

// Canvas элемент
let FIELD_WIDTH = document.documentElement.clientWidth - 100;
let FIELD_HEIGHT = document.documentElement.clientHeight - 100;

let canvas = document.getElementById('canvas');
canvas.width = FIELD_WIDTH;
canvas.height= FIELD_HEIGHT;
let ctx = canvas.getContext('2d');

// Игровая логика
// Есть один квадрат
// Квадрат не может заходить за границы стенок
// Квадрат управляется стрелками
// На квадрат действует сила тяготения
let x = 100;
let y = 75;
let g = 0.3;
let dvx = 0;
let dvy = 0;

let ball = new Ball(10, 10, 0, 0, true);
let secondBall = new Ball(10, 10, 1, 1, false);

ctx.beginPath()
// ctx.fillRect(x, y, 20, 20)
ctx.fillRect(ball.x, ball.y, 20, 20)
ctx.stroke()

// Состояние клавиш стрелочек
let arrowsPressed = {
  'w' : false,
  'a' : false,
  's' : false,
  'd' : false,
};

// начальная точка отсчета времени
let last = performance.now();
// промежуток времени между двумя шагами цикла
let dt = 0;
// требуемая частота игровой логики
let step = 1 / 60;
game();


function game() {
  input();
  // Следующий примем обеспечивает независимость игровой логики от загруженности системы.
  // Если между двумя шагами цикла пройдет время, большее чем step, то игровая логика будет рассчитана без отрисовки
  // до текущего момента в реальном времени
  let now = performance.now();
  dt += (now - last) / 1000;
  while (dt > step) {
    dt -= step;
    update();
  }
  last = now;
  render()
  requestAnimationFrame(game);
}

function input() {
  document.addEventListener('keydown', function(event) {
    if (event.code == "ArrowUp") {
      arrowsPressed['w'] = true;
    }
    if (event.code == "ArrowLeft") {
      arrowsPressed['a'] = true;
    }
    if (event.code == "ArrowDown") {
      arrowsPressed['s'] = true;
    }
    if (event.code == "ArrowRight") {
      arrowsPressed['d'] = true;
    }
  });
  document.addEventListener('keyup', function(event) {
    if (event.code == "ArrowUp") {
      arrowsPressed['w'] = false;
    }
    if (event.code == "ArrowLeft") {
      arrowsPressed['a'] = false;
    }
    if (event.code == "ArrowDown") {
      arrowsPressed['s'] = false;
    }
    if (event.code == "ArrowRight") {
      arrowsPressed['d'] = false;
    }
  });
}

function update() {
  // ball.vy += 0.01 * g;

  // if ((arrowsPressed['d'] || arrowsPressed['a']) && (arrowsPressed['s'] || arrowsPressed['w'])) {
  //   ball.vx += g * (1 / Math.sqrt(2)) * (+arrowsPressed['d'] - +arrowsPressed['a']);
  //   ball.vy += g * (1 / Math.sqrt(2)) * (+arrowsPressed['s'] - +arrowsPressed['w']);
  // } else {
  //   ball.vx += g * (+arrowsPressed['d'] - +arrowsPressed['a']);
  //   ball.vy += g * (+arrowsPressed['s'] - +arrowsPressed['w']);
  // }

  // move(dvx, dvy);
  ball.move();
  secondBall.move();
}

function render() {
  ctx.clearRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);
  // ctx.fillRect(x, y, 20, 20);
  ctx.fillRect(ball.x, ball.y, 20, 20);
  ctx.fillRect(secondBall.x, secondBall.y, 20, 20);
}

function move(dx, dy) {
  x += dx;
  y += dy;
  if (x >= FIELD_WIDTH - 20) {
    x = FIELD_WIDTH - 20;
    if (dvx < 1) dvx = 0;
    else dvx = -0.5 * dvx;
  }
  if (y >= FIELD_HEIGHT - 20) {
    y = FIELD_HEIGHT - 20;
    dvy = -0.5 * dvy;
  }
  if (x <= 0){
    x = 0;
    if (dvx > -1) dvx = 0;
    else dvx = -0.5 * dvx;
  }
  if (y <= 0){
    y = 0;
    dvy = -0.5 * dvy;
  }
}


function Ball(x, y, vx, vy, isControlled) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;

  this.isControlled = isControlled;

  this.move = function() {

    if (isControlled) {
      if ((arrowsPressed['d'] || arrowsPressed['a']) && (arrowsPressed['s'] || arrowsPressed['w'])) {
        this.vx += g * (1 / Math.sqrt(2)) * (+arrowsPressed['d'] - +arrowsPressed['a']);
        this.vy += g * (1 / Math.sqrt(2)) * (+arrowsPressed['s'] - +arrowsPressed['w']);
      } else {
        this.vx += g * (+arrowsPressed['d'] - +arrowsPressed['a']);
        this.vy += g * (+arrowsPressed['s'] - +arrowsPressed['w']);
      }
    }
    
    this.x += this.vx;
    this.y += this.vy;
    if (this.x >= FIELD_WIDTH - 20) {
      console.log("this.x >= FIELD_WIDTH - 20")
      this.x = FIELD_WIDTH - 20;
      // if (this.vx < 1) this.vx = 0;
      // else this.vx = -0.5 * this.vx;
      this.vx = -0.5 * this.vx;
    }
    if (this.y >= FIELD_HEIGHT - 20) {
      this.y = FIELD_HEIGHT - 20;
      this.vy = -0.5 * this.vy;
    }
    if (this.x <= 0){
      this.x = 0;
      // if (this.vx > -1) this.vx = 0;
      // else this.vx = -0.5 * this.vx;
      this.vx = -0.5 * this.vx;
    }
    if (this.y <= 0){
      this.y = 0;
      this.vy = -0.5 * this.vy;
    }
  }
}