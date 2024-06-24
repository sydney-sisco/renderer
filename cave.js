let bgColourValue = 0;
let showDebug = false;
let frame = 0;

let canvasWidth;

let noiseFrame = 0;
let previousNoiseValue = 0;
let initialNoiseOffset;

const States = {
  START: 'start',
  GAME: 'game',
  GAME_OVER: 'gameOver'
};
let currentState;

const CaveGenerationModes = {
  RANDOM: 'random',
  NOISE: 'noise',
  TEST: 'test',
}
let caveGenerationMode = CaveGenerationModes.NOISE

const STARTING_DEPTH = -15;
let CAVE_HEIGHT, CAVE_WIDTH;
let INITIAL_SPEED, MAX_SPEED;
let SPEED;
let speedOutputEl;

const player = {}
player.y = 5
player.vel = 0
player.acc = -0.01

let score = 0
let max_score = 0

let looping = true;

// r-cube colours
const BLUE = '#0046ad'
const RED = '#b71234'
const YELLOW = '#ffd500'
const GREEN = '#009b48'
const ORANGE = '#ff5800'
const WHITE = '#ffffff'
const colours = [BLUE, RED, YELLOW, GREEN, ORANGE, WHITE]
const DEBUG_PINK = '#ff00ff'

let colours_index = 0;

let cubes = [];

function toggleDrawLoop() {
  if (looping) {
    noLoop();
  } else {
    loop();
  }
  looping = !looping;
}

// x:
// y:
// z: 
// colour:
//
// creates a row of cubes from (x-3 , y, z) to (x+2, y, z)
const generate_cube_row = (x, y, z, colour) => {
  cubes.push(new Cube(createVector(0, y, z), 0, 0, 0, colour, createVector(CAVE_WIDTH.value(),1,1)))
};

// x: x coord of the column
// y: 
// z: z coord of the column
// colour: the colour of the column
//
// creates a column of cubes from (x, -y , z) to (x, -(y + (CAVE_HEIGHT - 1)), z)
const generate_cube_col = (x, y, z, colour) => {
  cubes.push(new Cube(createVector(x, - (y + CAVE_HEIGHT.value() / 2), z), 0, 0, 0, colour, createVector(1,CAVE_HEIGHT.value() - 1,1)))
}

const generateCaveSlice = (y_offset, depth) => {
  generate_cube_row(0.5, 0 + y_offset, depth, colours[colours_index]);  
  generate_cube_row(0.5, -CAVE_HEIGHT.value() + y_offset, depth, colours[colours_index]);
  generate_cube_col(( - CAVE_WIDTH.value() / 2 ) - 0.5, 0 - y_offset, depth, colours[colours_index]);
  generate_cube_col( (CAVE_WIDTH.value() / 2 ) + 0.5, 0 - y_offset, depth, colours[colours_index]);

  // fill in gaps created when the cave jumps up or down by more than 1 unit
  if (y_offset - previousNoiseValue > 1) {
    // add cube rows above
    for (let i = 1; i <= y_offset - previousNoiseValue; i++) {
      generate_cube_row(0.5, -CAVE_HEIGHT.value() + y_offset - i, depth, colours[colours_index]);
    }

  }
  if (y_offset - previousNoiseValue < -1) {
    // add cube rows below
    for (let i = -1; i >= y_offset - previousNoiseValue; i--) {
      generate_cube_row(0.5, 0 + y_offset - i, depth, colours[colours_index])
    }
  }
  previousNoiseValue = y_offset
  colours_index++;
  if (colours_index >= colours.length) colours_index = 0;
}

function setup() {
  createCanvas(getCanvasWidth(), windowHeight);

  currentState = States.START;

  select('#toggleLoop').mousePressed(toggleDrawLoop);

  CAVE_HEIGHT = new PersistentSetting(createSlider(1, 32, 12), "CAVE_HEIGHT")
  CAVE_WIDTH = new PersistentSetting(createSlider(2, 10, 6, 2), "CAVE_WIDTH")
  INITIAL_SPEED = new PersistentSetting(createSlider(1, 32, 12), "INITIALSPEED");
  MAX_SPEED = new PersistentSetting(createSlider(1, 32, 4), "MAXSPEED")
  reset_speed()
  speedOutputEl = createDiv(`SPEED: ${SPEED}`)
}

function getCanvasWidth() {
  // Define the max aspect ratio (width to height)
  const maxAspectRatio = 0.65;
  
  // Calculate the aspect ratio of the window
  let windowAspectRatio = windowWidth/windowHeight;
  
  if (windowAspectRatio > maxAspectRatio) {
    // If the window aspect ratio is more than max, limit the canvas width to maintain aspect ratio
    return windowHeight * maxAspectRatio;
  } else {
    // Otherwise, use the full width of the window
    return windowWidth;
  }
}

function draw() {
  translate(width / 2, height / 2);

  switch (currentState) {
    case States.START:
      background(bgColourValue);
      drawStartScreen();
      break;
    case States.GAME:
      background(bgColourValue);
      drawGame();
      break;
    case States.GAME_OVER:
      drawGameOverScreen();
      break;
  }

  frame++
}

function windowResized() {
  resizeCanvas(getCanvasWidth(), windowHeight);
}

let isInteracting = false;

function touchStarted() {

  if (currentState === States.START) {
    reset_prev_noise_value();
    reset_frame();
    currentState = States.GAME;
  }

  if (currentState === States.GAME_OVER) {
    reset_frame();

    // generate initial cubes for start screen
    createInitialCubes()
    currentState = States.START
  }

  isInteracting = true;
  return false;
}

function touchEnded() {
  isInteracting = false;
  return false;
}

function keyPressed() {
  isInteracting = true;
}

function keyReleased() {
  isInteracting = false;
}

const drawGame = () => {
  if (frame % SPEED === 0) {
    score++;

    // cave go up or down
    let y_climb;
    if (caveGenerationMode === CaveGenerationModes.RANDOM) {
      // Returns a random integer from -1 to 1:
      climb = Math.floor(Math.random() * 3) - 1
      y_climb = previousNoiseValue + climb
    } else if (caveGenerationMode === CaveGenerationModes.NOISE) {
      // Set the noise level and scale.
      let noiseLevel = 100;
      let noiseScale = 0.02;
    
      // Scale the input coordinate.
      let nx = noiseScale * (noiseFrame++);
    
      // Compute the noise value.
      let y = noiseLevel * noise(nx);
      y = Math.round(y);

      // set the offset so that the generate cave lines up with the starting screen
      if (frame === 0) {
        initialNoiseOffset = y
        console.log('setting initial noise offset:', initialNoiseOffset
        );
      }
  
      const adjusted_y_climb = initialNoiseOffset - y
      y_climb = adjusted_y_climb

    } else if (caveGenerationMode === CaveGenerationModes.TEST) {
      y_climb = 0;
    }

    generateCaveSlice(y_climb, STARTING_DEPTH)

    if (score % 25 === 0 && SPEED > MAX_SPEED.value()) {
      SPEED--;
      speedOutputEl.html(`SPEED: ${SPEED}`)
    }

    // set initial player location based on the first cubes generated
    if (frame === 0) {
      const cube_y = cubes[0].position.y
      const ceiling = cube_y - 0.5
      const middle = ceiling - (CAVE_HEIGHT.value() / 2)
      player.y = -middle
    }
  }

  cubes.forEach((cube, i)=> {
    // cube.rotate(0.001*i, 0.001*i, 0.001*i) // drugs mode
    cube.shift(0, 0, 1.0/SPEED)
  })

  // remove cubes that have gone too far
  cubes = cubes.filter(cube => cube.position.z <= 2);

  // drop or rise
  if (isInteracting) {
    player.vel += -player.acc;
  } else {
    player.vel += player.acc;
  }
  // apply vel to pos
  player.y += player.vel

  // check for collision
  // get the y_climb of the cubes that are at the player's current position
  const cube_y = cubes[0].position.y

  const ceiling = cube_y - 0.5
  const floor = cube_y - CAVE_HEIGHT.value() + 0.5
  if (-player.y > ceiling) {
    console.log(`you hit the floor!`);

    player.vel = 0
    reset_speed()
    currentState = States.GAME_OVER
  }

  if (-player.y < floor) {
    console.log(`you hit the ceiling!`);

    player.vel = 0
    reset_speed()
    currentState = States.GAME_OVER
  }
  // const camera_vector = createVector(0, -player.y, 1)
  // const sortedCubes = cubes.slice().sort((a, b) => {
  //   const vec_a = p5.Vector.sub(camera_vector, a.position)
  //   const vec_b = p5.Vector.sub(camera_vector, b.position)
  //   return vec_a.mag() - vec_b.mag()
  // })

  // for (let i = sortedCubes.length - 1; i >= 0; i--) {
  //   render(sortedCubes[i], null, createVector(0, player.y, 0))
  // }
  for (let i = cubes.length - 1; i >= 0; i--) {
    render(cubes[i], null, createVector(0, player.y, 0))
  }

  if (showDebug) {
    print_debug();
  }

  print_score();
}

const print_score = () => {

  const EDGE_OFFSET = 25
  const BOTTOM_OFFSET = 25

  const x_offset = getCanvasWidth() / 2
  const y_offset = windowHeight / 2

  fill('white')
  stroke('black')

  // left side
  textAlign(LEFT, BOTTOM)
  textSize(25)
  text('score:', -x_offset + EDGE_OFFSET, y_offset - BOTTOM_OFFSET - 65)
  textSize(60);
  text(score, -x_offset + EDGE_OFFSET, y_offset - BOTTOM_OFFSET)

  // right side
  textAlign(RIGHT, BOTTOM)
  textSize(25)
  text('max:', x_offset - EDGE_OFFSET, y_offset - BOTTOM_OFFSET - 65)
  textSize(60)
  text(max_score, x_offset - EDGE_OFFSET, y_offset - BOTTOM_OFFSET)
}

const createInitialCubes = () => {
  for (let i = 2; i >= STARTING_DEPTH; i--) {
    generateCaveSlice(0, i)
  }
}

function drawStartScreen() {
  reset_score()
  reset_speed()

  player.y = 0 + (CAVE_HEIGHT.value() / 2)


  if (frame % SPEED === 0) {
    generateCaveSlice(0, STARTING_DEPTH)
  }
    
  cubes.forEach((cube, i)=> {
    cube.shift(0, 0, 1/SPEED)
  })
  // remove cubes that have gone too far
  cubes = cubes.filter(cube => cube.position.z <= 2);
  
  // sort cubes by distance to camera so they are rendered back to front
  const camera_vector = createVector(0, -player.y, 1)

  const sortedCubes = cubes.slice().sort((a, b) => {
    const vec_a = p5.Vector.sub(camera_vector, a.position)
    const vec_b = p5.Vector.sub(camera_vector, b.position)
    return vec_a.mag() - vec_b.mag()
  })

  for (let i = sortedCubes.length - 1; i >= 0; i--) {
    render(sortedCubes[i], null, createVector(0, player.y, 0))
  }

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text('Tap to Start', 0, 0 + 60);
  textSize(24)
  text('Press and hold to go up', 0, 0 - 70)
  text('Release to go down', 0, 0 - 40)
}

function drawGameOverScreen() {
  reset_cubes();

  fill(255);
  stroke('black')
  textAlign(CENTER, CENTER);
  textSize(32);
  text('Game Over', 0, 0 - 70);
  textSize(24);
  text(`Score: ${score}`, 0, 10)
  if (is_high_score()) {
    fill(colours[colours_index])
    text('New high score!', 0, -30)
    fill(255)

    if (frame % 15 === 0) {
      colours_index++
      if (colours_index >= colours.length) colours_index = 0;
    }
  }
  textSize(32);
  text('Tap to Retry', 0, 0 + 60);
}

function mousePressed() {
  if (currentState === States.START) {
    reset_prev_noise_value();
    reset_frame()
    currentState = States.GAME;
  }

  if (currentState === States.GAME_OVER) {
    // generate initial cubes for start screen
    reset_frame();
    createInitialCubes();

    currentState = States.START
  }

  isInteracting = true
}

function mouseReleased() {
  isInteracting = false
}

const reset_cubes = () => {
  cubes = []
}

const is_high_score = () => {
  return score > max_score
}

const reset_score = () => {
  if (score > max_score) {
    max_score = score
  }
  score = 0
}

const reset_speed = () => {
  SPEED = INITIAL_SPEED.value()
}

const reset_player_pos = () => {
  player.y = 0 + (CAVE_HEIGHT.value() / 2);
}

const reset_prev_noise_value = () => {
  previousNoiseValue = 0
}

const reset_frame = () => {
  frame = 0
}
