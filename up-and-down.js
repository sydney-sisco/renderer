let frame = 0
let bgColourValue = 200

const SPEED = 16
let RISE_SPEED = 0.1
let FALL_SPEED = RISE_SPEED

let score = 0

const player = {}
player.y = 0
player.vel = -10
player.acc = 0.42

function setup() {
  createCanvas(800, 600)


  // Create an input
  input = createInput('3')
  input.position(805, 5)

  frame++;
}


function draw() {
  background(bgColourValue)
  translate(width / 2, height / 2)


  draw_player(player.y)

  RISE_SPEED = Number(input.value())
  FALL_SPEED = RISE_SPEED
  text(RISE_SPEED, 5, 50)

  
  
  // if at border, keep inside and do not accel

  // keep player on the screen
  console.log(player.y);

  if (player.y > 300 || player.y < - 300) {
      if (player.y > 300) {
        player.y = 300
        player.vel = 0
      }
      if (player.y < -300) {
        player.y = - 300
        player.vel = 0
      }
  } else {
    // otherwise, accel
    
    // apply acc to vel
    // drop or rise
    if (keyIsPressed === true) {
      // rise
      player.vel += -player.acc
    } else {
      // fall
      player.vel += player.acc
    }

    // apply vel to pos
    player.y += player.vel
  }
}

function draw_player(y) {
  circle(50, y, 25)
}
