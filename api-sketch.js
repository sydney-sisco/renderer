let objects = [];
let bgColourValue = 0;
let showDebug = false;
let frame = 0;
const accumulator = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];

const CAVE_HEIGHT = 10;
let INITIAL_SPEED, MAX_SPEED;
let SPEED;
let speedOutput;

const player = {}
player.y = 0
player.vel = 0
player.acc = -0.01


let score = 0
let max_score = 0

let loopState = true;

const RED = '#E50000';
const PURPLE = '#770088';
const ORANGE = '#FF8D00';
const YELLOW = '#FFEE00';
const BLUE = '#004CFF';
const GREEN = '#028121';

const colours = [RED, ORANGE, YELLOW, GREEN, BLUE, PURPLE];
let colours_index = 0;
const STARTING_DEPTH = -10;

player_pos = null;

let cubes = [];

function toggleDrawLoop() {
  // Pause or resume loop depending on current state
  if (loopState) {
    noLoop();
  } else {
    loop();
  }
  loopState = !loopState; // Toggle the state
}

// x:
// y:
// z: 
// colour:
//
// creates a row of cubes from (x-3 , y, z) to (x+2, y, z)
const generate_cube_row = (x, y, z, colour) => {
  for (let i = -3; i <= 2; i++) {
    const cube_x = x + i
    console.log(cube_x);
    if (cube_x % 2 === 0.5 || cube_x % 2 === -0.5) {
      cubes.push(new Cube(createVector(cube_x, y, z), 0, 0, 0, colour))
    }
  }
};

// x: x coord of the column
// y: 
// z: z coord of the column
// colour: the colour of the column
//
// creates a column of cubes from (x, -y , z) to (x, -(y + (CAVE_HEIGHT - 1)), z)
const generate_cube_col = (x, y, z, colour) => {
  for (let i = 0; i < CAVE_HEIGHT; i++) {
    const cube_y = -(y+ i)
    if (cube_y % 2 === 1 || cube_y % 2 === -1) {
      cubes.push(new Cube(createVector(x, -(y+ i), z), 0, 0, 0, colour))
    }
  }
}

function setup() {
  createCanvas(800, 600);

  generate_cube_row(0.5, 0, STARTING_DEPTH, colours[colours_index]);  
  generate_cube_row(0.5, -CAVE_HEIGHT, STARTING_DEPTH, colours[colours_index]);
  generate_cube_col(-3.5, 0, STARTING_DEPTH, colours[colours_index]);
  generate_cube_col( 3.5, 0, STARTING_DEPTH, colours[colours_index]);

  player_pos = createVector(0, 0, 0);

  select('#toggleLoop').mousePressed(toggleDrawLoop);

  INITIAL_SPEED = new PersistentSetting(createSlider(1, 32, 16), "INITIALSPEED");
  MAX_SPEED = new PersistentSetting(createSlider(0, 32, 16), "MAXSPEED")
  SPEED = INITIAL_SPEED.value();
  speedOutput = createDiv(`${SPEED}`)

  colours_index++;
  frame++;
}

let y_climb = 0;

function draw() {
  background(bgColourValue);
  translate(width / 2, height / 2);

  if (frame !== 0 && frame % SPEED === 0) {
    score++;

    let noiseLevel = 2 * (frame / 100);
    let noiseScale = 1;
  
    // Scale the input coordinate.
    let nx = noiseScale * (frame / SPEED);
  
    // Compute the noise value.
    // let y = noiseLevel * noise(nx);
    let y = 0;

    // console.log('y:', y, 'nx:', nx, 'noiseLevel:', noiseLevel);

    generate_cube_row(0.5, 0 + y_climb, STARTING_DEPTH, colours[colours_index]);  
    generate_cube_row(0.5, -CAVE_HEIGHT + y_climb, STARTING_DEPTH, colours[colours_index]);
    generate_cube_col(-3.5, 0 - y_climb, STARTING_DEPTH, colours[colours_index]);
    generate_cube_col( 3.5, 0 - y_climb, STARTING_DEPTH, colours[colours_index]);
    // y_climb--;

    // cave go up or down
    // Returns a random integer from -1 to 1:
    climb = Math.floor(Math.random() * 3) - 1
    y_climb += climb

    colours_index++;
    if (colours_index >= colours.length) colours_index = 0;

    if (score % 10 === 0 && SPEED > MAX_SPEED.value()) {
      SPEED--;

      speedOutput.html(`${SPEED}`)
    }

  }

  cubes.forEach((cube, i)=> {
    // cube.rotate(0.001*i, 0.001*i, 0.001*i)

    if (cube.position.x > 7) {
      cube.position.x = - 7;
    }

    if (cube.position.x < -7) {
      cube.position.x = 7
    }

    // cube.shift(0, 0, 0.01);
    cube.shift(0, 0, 1.0/SPEED)
  })

  // remove cubes that have gone too far
  cubes = cubes.filter(cube => cube.position.z <= 2);

  // drop or rise
  if (keyIsPressed === true) {
    player.vel += -player.acc
  } else {
    player.vel += player.acc
  }
  // apply vel to pos
  player.y += player.vel
  // console.log(player_pos.y);

  // check for collision

  // get the y_climb of the cubes that are at the player's current position
  const cube_y = cubes[0].position.y

  console.log('cube_y:', cube_y, 'player.y:', player.y);


  const ceiling = cube_y - 0.5
  const floor = cube_y - CAVE_HEIGHT + 0.5
  const middle = ceiling - (CAVE_HEIGHT / 2)
  console.log('c:', ceiling, 'f:', floor, 'mid:', middle);
  if (-player.y > ceiling) {
    console.log(`you hit the floor!`);

    player.y = -middle
    player.vel = 0
    reset_score()
    reset_speed()
  }

  if (-player.y < floor) {
    console.log(`you hit the ceiling!`);

    player.y = -middle
    player.vel = 0
    reset_score()
    reset_speed()
  }

  for (let i = cubes.length - 1; i >= 0; i--) {
    renderCube(cubes[i], createVector(0, player.y, 0));
  }

  if (showDebug) {
    print_debug();
  }

  textSize(75);
  text(score, -350, 250);

  textSize(25)
  text(`max: ${max_score}`, -350, 285)

  frame++;
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
