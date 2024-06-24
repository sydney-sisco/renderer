let frame = 0;
let bgColourValue = 0;


function setup() {
  createCanvas(800, 600);



  frame++;
}


function draw() {
  background(bgColourValue);
  translate(width / 2, height / 2);

  
  frame++;
}
