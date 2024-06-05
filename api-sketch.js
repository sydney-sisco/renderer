let objects = [];
let bgColourValue = 0;
let showDebug = false;
let frame = 0;
const accumulator = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];

const SPEED = 16;
const RISE_SPEED = 0.1;
const FALL_SPEED = RISE_SPEED;

let score;

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

const cubes = [];

function addImportedObject() {
  objects.push(new ImportedObject(
    createVector(0, 0, 0),
    0,
    0,
    0,
    255
  ));

  // if (addAccel) {
  //   accelX = 0.05;
  //   accelY = 0.025;
  // }

    // angleX = .05;
  // angleY = .025;
}

const generate_cube_row = (x, y, z, colour) => {
  for (let i = -3; i <= 2; i++) {
    if (i % 2 === 1 || i % 2 === -1 ) {
      continue;
    }
    cubes.push(new Cube(createVector(x + i, y, z), 0, 0, 0, colour));
  }
};

const generate_cube_col = (x, y, z, colour) => {
  for (let i = -3; i <= 3; i++) {
    if (i % 2 === 1 || i % 2 === -1 ) {
      continue;
    }
    cubes.push(new Cube(createVector(x, y+ i, z), 0, 0, 0, colour));
  }
}

function setup() {
  createCanvas(800, 600);

  // const init = async () => {
  //   await parseFile('meshes/sphere3.obj');
  //   addImportedObject();
  // }
  // init();

  generate_cube_row(0.5, 3, STARTING_DEPTH, colours[colours_index]);  
  generate_cube_row(0.5, -3, STARTING_DEPTH, colours[colours_index]);
  generate_cube_col(-3.5, 0, STARTING_DEPTH, colours[colours_index]);
  generate_cube_col( 3.5, 0, STARTING_DEPTH, colours[colours_index]);

  player_pos = createVector(0, 0, 0);

  score = 0;
  colours_index++;
  frame++;
}

function draw() {
  background(bgColourValue);
  translate(width / 2, height / 2);



  if (frame % SPEED === 0) {
    score++;

    let noiseLevel = 2;
    let noiseScale = 1;
  
    // Scale the input coordinate.
    let x = frameCount;
    let nx = noiseScale * x;
  
    // Compute the noise value.
    // let y = noiseLevel++ * noise(nx);
    let y = 0;

    console.log('y:', y, 'nx:', nx);

    generate_cube_row(0.5, 3 + y, STARTING_DEPTH, colours[colours_index]);  
    generate_cube_row(0.5, -3 + y, STARTING_DEPTH, colours[colours_index]);
    generate_cube_col(-3.5, 0 + y, STARTING_DEPTH, colours[colours_index]);
    generate_cube_col( 3.5, 0 + y, STARTING_DEPTH, colours[colours_index]);
    colours_index++;
    if (colours_index >= colours.length) colours_index = 0;
  }

  // objects.forEach((object) => {
  //   render(object, accumulator);
  // });

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
  cubes.forEach((cube,i)=>{
    if (cube.position.z > 2){
      cubes.splice(i, 1);
    }
  })

  // drop or rise
  if (keyIsPressed === true) {
    // drop
    player_pos.y += RISE_SPEED
  } else {
    // rise
    player_pos.y -= FALL_SPEED
  }
  // console.log(player_pos.y);
  if (player_pos.y > 2.5) {player_pos.y = 2.5}
  if (player_pos.y < -2.5) {player_pos.y = - 2.5}

  cubes.forEach((cube, i)=>{
  })

  for (let i = cubes.length - 1; i >= 0; i--) {
    renderCube(cubes[i], player_pos);
  }

  if (showDebug) {
    print_debug();
  }

  textSize(75);
  text(score, -350, 250);

  frame++;
}
