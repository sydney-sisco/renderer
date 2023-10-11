let frame = 0;
let showDebug = false;
// let movers = [];

let attractor;
let planets = [];

addSettings([
  {
    name: 'debug',
    type: 'button',
    cb: () => showDebug = !showDebug
  },
]);

function setup() {
  createCanvas(windowWidth, windowWidth);

  let earth = new Mover(0, -100, new p5.Vector(1.5, 0), 1, 'blue'); // earth
  planets.push(earth);
  let mars = new Mover(-100, 0, new p5.Vector(0, -1.75), .66, 'red'); // mars
  planets.push(mars);
  
  attractor = new Attractor(0, 0, 5);
}

function draw() {
  background(0, 10);
  translate(width/2, height/2);

  for (planet of planets) {
    planet.update();
    planet.show();

    attractor.attract(planet);
  }

  attractor.show();

  if (showDebug) {
    print_debug();
  }

  frame++;
}

const print_debug = () => {
  stroke(255);
  strokeWeight(1);
  fill(255);
  textSize(12);
  text(`frame: ${frame}`, -width/2 + 8, -height/2 + 12);
  text(`frameRate: ${frameRate().toFixed(2)}`, -width/2 + 8, -height/2 + 24);
  text(`width: ${width}`, -width/2 + 8, -height/2 + 36);
}
