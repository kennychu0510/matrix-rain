const {random, floor, min, max, sqrt, pow, exp, E, log, ceil} = Math;
const win = window;
const R = 0;
const G = 1;
const B = 2;
const A = 3;
const canvas = win.main;
const rect = canvas.getBoundingClientRect();
const ctx = canvas.getContext("2d");
const ratio = ceil(win.devicePixelRatio);
canvas.width = win.innerHeight * ratio;
canvas.height = win.innerHeight * ratio;
function drawBackground() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function pickRandomColor() {
  const num = floor(random() * 3);
  const colorMap = {
    0: "#003B00",
    1: "#008F11",
    2: "#00FF41"
  };
  return colorMap[num];
}
function getRandomX() {
  return floor(random() * (canvas.height + 100) / 10) * 10;
}
function getRandomChar() {
  const num = random() * (127 - 33) + 33;
  return String.fromCharCode(num);
}
const arrOfChar = [];
for (let i = 0; i < 100; i++) {
  arrOfChar.push(getRandomChar());
}
function getRandomFont() {
  return floor(random() * 6) * 10;
}
class MovingLine {
  constructor(ctx2) {
    this.ctx = ctx2;
    this.speed = random() * canvas.height / 200;
    this.start = 0;
    this.y = 0;
    this.x = 0;
    this.lineWidth = floor(random() * 3) * 2;
    this.color = pickRandomColor();
    this.length = 0;
    this.characters = [];
    this.textWidth = 30;
    this.fontSize = getRandomFont();
    this.initialize();
  }
  initialize() {
    this.x = getRandomX();
    this.length = floor(canvas.height / 4 + random() * canvas.height);
    for (let i = 0; i < this.length; i++) {
      this.characters.push(getRandomChar());
    }
  }
  shuffleText() {
    this.characters = [];
    for (let i = 0; i < this.length; i++) {
      this.characters.push(getRandomChar());
    }
  }
  draw() {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    ctx.moveTo(this.x, this.start);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    this.move();
  }
  drawText(tick) {
    ctx.font = this.fontSize + "px Comic Sans MS";
    ctx.fillStyle = this.color;
    ctx.textAlign = "center";
    if (tick % 3 === 0) {
      this.shuffleText();
    }
    for (let i = 0; i < this.length; i++) {
      ctx.fillText(this.characters[i], this.x, this.y - this.fontSize * i, this.textWidth);
    }
    this.move();
  }
  move() {
    this.y += this.speed;
    if (this.y > this.length) {
      this.start = this.y - this.length;
    }
    if (this.y > canvas.height) {
      this.y = 0;
      this.start = 0;
      this.x = getRandomX();
    }
  }
}
class MovingText {
  constructor(ctx2) {
    this.ctx = ctx2;
    this.char = "";
    this.initialize();
  }
  initialize() {
    this.char = getRandomChar();
  }
}
class Matrix {
  constructor(ctx2, seed = floor(random() * 200)) {
    this.ctx = ctx2;
    this.seed = seed;
    this.lines = [];
    this.tick = 0;
    this.seed = max(seed, 100);
    this.initialize();
  }
  initialize() {
    for (let i = 0; i < this.seed; i++) {
      this.lines.push(new MovingLine(ctx));
    }
  }
  draw() {
    drawBackground();
    this.lines.forEach((line) => {
      line.drawText(this.tick);
    });
    this.tick++;
  }
}
const matrix = new Matrix(ctx);
function loop() {
  matrix.draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
Object.assign(win, {
  canvas,
  matrix
});
