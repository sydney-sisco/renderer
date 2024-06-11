let frame = 0;
let bgColourValue = 200;


function setup() {
  createCanvas(800, 600);



  frame++;
}


function draw() {
  // background(bgColourValue);ss
  // translate(width / 2, height / 2);
  

  // Set the noise level and scale.
  let noiseLevel = 100;
  let noiseScale = 0.02;

  // Scale the input coordinate.
  let x = frameCount;
  let nx = noiseScale * frameCount;

  // Compute the noise value.
  let y = noiseLevel * noise(nx);
  

  y = Math.round(y)
  console.log('y:', y, 'nx:', nx, 'noiseLevel:', noiseLevel);

  // Draw the line.
  line(x, 0, x, y);

  console.log(y);
}


const generate_noise = () => {

}
