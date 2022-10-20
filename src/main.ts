const { random, floor, min, max, sqrt, pow, exp, E, log, ceil } = Math
const win = window as any

const R = 0
const G = 1
const B = 2
const A = 3

const canvas = win.main as HTMLCanvasElement
const rect = canvas.getBoundingClientRect()
const ctx = canvas.getContext('2d')!
const ratio = ceil(win.devicePixelRatio)
canvas.width = win.innerHeight * ratio
canvas.height = win.innerHeight * ratio

function drawBackground() {
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height);

}


// const scale = 25
// const w = floor(rect.width / scale)
// const h = floor(rect.height / scale)
// const n = w * h

// canvas.width = w
// canvas.height = h

// const context = canvas.getContext('2d')!
// const imageData = context.getImageData(0, 0, w, h)
// const data = imageData.data
// const len = w * h * 4

// for (let i = 0; i < len; i += 4) {
//   data[i + R] = 0
//   data[i + G] = 0
//   data[i + B] = 0
//   data[i + A] = 255
// }

// function tick() {
//   // TODO write your logic here
//   let offset = floor(random() * n) * 4
//   for (let i = 0; i < 3; i++) {
//     data[offset + i] = min(
//       255,
//       max(
//         0,
//         data[offset + i] + floor(((random() * 2 - 1) * 256) / 4 / sqrt(batch))
//       )
//     )
//   }
// }

// const batch = sqrt(w * h)

function pickRandomColor(): string {
  const num = floor(random() * 3)
  const colorMap: any = {
    0: '#003B00',
    1: '#008F11',
    2: '#00FF41'
  }
  return colorMap[num]
}

function getRandomX(): number {
  return floor(random() * (canvas.height + 100) / 10) * 10
}

function getRandomChar(): string {
  const num = random() * (127 - 33) + 33
  return String.fromCharCode(num)
}

const arrOfChar: string[] = []
for (let i = 0; i < 100; i++) {
  arrOfChar.push(getRandomChar())
}

function getRandomFont(): number {
  return floor(random() * 6) * 10
}
// console.log(arrOfChar)
// console.log(win.devicePixelRatio)
// ctx.font = "30px Comic Sans MS";
// ctx.fillStyle = "green";
// ctx.fillText(arrOfChar[0], canvas.width / 2, canvas.height / 2, 30)
// ctx.fillText(arrOfChar[1], canvas.width / 2, canvas.height / 2 + 40, 30)

class MovingLine {
  private speed = random() * canvas.height / 200
  private start = 0
  private y = 0
  private x = 0
  private lineWidth = floor(random() * 3) * 2
  private color = pickRandomColor()
  private length = 0
  private characters: string[] = []
  private textWidth = 30
  private fontSize = getRandomFont()

  constructor(public ctx: CanvasRenderingContext2D) {
    this.initialize()
  }

  initialize() {
    this.x = getRandomX()
    this.length = floor(canvas.height / 4 + random() * canvas.height)
    for (let i = 0; i < this.length; i++) {
      this.characters.push(getRandomChar())
    }
  }

  shuffleText() {
    this.characters = []
    for (let i = 0; i < this.length; i++) {
      this.characters.push(getRandomChar())
    }
  }

  draw() {
    ctx.strokeStyle = this.color
    ctx.lineWidth = this.lineWidth
    ctx.beginPath();
    ctx.moveTo(this.x, this.start);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    this.move()
  }

  drawText(tick: number) {
    ctx.font = this.fontSize + "px Comic Sans MS";
    ctx.fillStyle = this.color
    ctx.textAlign = "center";
    if (tick % 3 === 0) {
      this.shuffleText()
    }
    for (let i = 0; i < this.length; i++) {
      ctx.fillText(this.characters[i], this.x, this.y - this.fontSize * i, this.textWidth)
    }
    this.move()
  }

  move() {
    this.y += this.speed
    if (this.y > this.length) {
      this.start = this.y - this.length
    }
    if (this.y > canvas.height) {
      this.y = 0
      this.start = 0
      this.x = getRandomX()
    }
  }
}

class MovingText {
  char: string = ''
  constructor(public ctx: CanvasRenderingContext2D) {
    this.initialize()
  }

  initialize() {
    this.char = getRandomChar()
  }


}


class Matrix {
  lines: MovingLine[] = []
  tick = 0
  constructor(public ctx: CanvasRenderingContext2D, public seed: number = floor(random() * 200)) {
    this.seed = max(seed, 100)
    this.initialize()
  }

  initialize() {
    for (let i = 0; i < this.seed; i++) {
      this.lines.push(new MovingLine(ctx))
    }
  }

  draw() {
    drawBackground()

    this.lines.forEach((line) => {
      line.drawText(this.tick)
    })
    this.tick++
  }
}

const matrix = new Matrix(ctx)

function loop() {
  // for (let i = 0; i < batch; i++) {
  //   tick()
  // }
  // context.putImageData(imageData, 0, 0)
  // requestAnimationFrame(loop)
  matrix.draw()

  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

Object.assign(win, {
  canvas,
  matrix
  // context,
  // imageData,
  // loop,
  // data,
  // w,
  // h,
  // n,
  // len,
})
