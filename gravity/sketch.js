let frame = 0;
let showDebug = false;
// let movers = [];

let mover;
let attractor;

addSettings([
  {
    name: 'debug',
    type: 'button',
    cb: () => showDebug = !showDebug
  },
]);

function setup() {
  createCanvas(windowWidth, windowWidth);

  mover = new Mover(0, -100, 5);
  attractor = new Attractor(0, 0, 5);
}

function draw() {
  background(0);
  translate(width/2, height/2);

  mover.update();
  mover.show();

  attractor.attract(mover);
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
