let frame = 0;
let objects = [];
let bgColourValue = 0;

let angleX = 0;
let angleY = 0;
let angleZ = 0;

const accumulator = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];

let touchStart = null;
let touchEnd = null;

addSettings([
  {
    name: 'Cube',
    type: 'button',
    cb: () => {
      reset()
      addCube();
    }
  },
  {
    name: 'Sphere',
    type: 'button',
    cb: () => {
      reset()
      addSphere();
    }
  },
  {
    name: 'Toggle Debug',
    type: 'checkbox',
    value: true,
  },
  {
    name: 'Loop',
    type: 'checkbox',
    value: true,
    cb: () => {
      if (settings['Loop'].value) {
        loop();
      }
      else {
        noLoop();
      }
    }
  },
  {
    name: 'next frame',
    type: 'button',
    cb: () => {
      redraw();
    }
  },
  {
    name: 'Mask',
    type: 'button',
    cb: async () => {
      reset();
      await parseFile('meshes/low_polygon_mask_V2.stl');
      const importedObject = new ImportedObject(
        createVector(0, 0, 0),
        0, 0, 0,
        255
      );
      objects.push(importedObject);
    }
  },
  {
    name: 'Sphere3',
    type: 'button',
    cb: async () => {
      reset();
      await parseFile('meshes/sphere3.obj');
      addImportedObject();
    }
  },
  {
    name: 'Sphere7',
    type: 'button',
    cb: async () => {
      reset();
      await parseFile('meshes/sphere7.obj');
      addImportedObject();
    }
  },
  {
    name: 'Sphere10',
    type: 'button',
    cb: async () => {
      reset();
      await parseFile('meshes/sphere10.obj');
      addImportedObject();
    }
  },
  {
    name: 'Sphere24',
    type: 'button',
    cb: async () => {
      reset();
      await parseFile('meshes/sphere24.obj');
      addImportedObject();
    }
  },
  {
    name: 'battery',
    type: 'button',
    cb: async () => {
      reset();
      await parseFile('meshes/battery.obj');
      addImportedObject();
    }
  },
  {
    name: 'airplane',
    type: 'button',
    cb: async () => {
      reset();
      await parseFile('meshes/11803_Airplane_v1_l1.obj');
      addImportedObject();
    }
  }
]);

function addCube() {
  objects.push(new Cube(
    createVector(0, 0, 0),
    0,
    0,
    0,
    255
  ));
}

function addSphere() {
  objects.push(new Sphere(
    createVector(0, 0, 0),
    0,
    0,
    0,
    255
  ));
}

function addImportedObject() {
  objects.push(new ImportedObject(
    createVector(0, 0, 0),
    0,
    0,
    0,
    255
  ));
}

function reset() {
  objects = [];
  angleX = .05;
  angleY = .025;
  angleZ = 0;
}

function setup() {
  createCanvas(windowWidth, windowWidth);
  
  reset()
  addCube()
}

function draw() {
  background(bgColourValue);

  const isDragging = touchStart && touchEnd;
  if (isDragging) {
    stroke('magenta');
    line(touchStart.x, touchStart.y, touchEnd.x, touchEnd.y)
  }

  translate(width / 2, height / 2);

  objects.forEach((object) => {
    object.rotate(angleX, angleY, angleZ);
    render(object);
  });

  decelerate();

  if (settings['Toggle Debug'].value) {
    print_debug();
  }

  frame++;
}

function decelerate() {
  // reduce angles by 1% each frame
  angleX *= 0.99;
  angleY *= 0.99;
  angleZ *= 0.99;

  // if the angles are very small, set them to 0
  if (abs(angleX) < 0.00001) {
    angleX = 0;
  }
  if (abs(angleY) < 0.00001) {
    angleY = 0;
  }
  if (abs(angleZ) < 0.00001) {
    angleZ = 0;
  }
}

function touchStarted() {

  // check if the user is touching the canvas
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return true;
  }

  bgColourValue = 16;
  touchEnd = null;
  touchStart = createVector(mouseX, mouseY);
  return false;
}

function touchMoved() {
  touchEnd = createVector(mouseX, mouseY);
  // return false;
}

function touchEnded() {

  // check if the user is touching the canvas
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    touchStart = null;
    return true;
  }
  touchEnd = createVector(mouseX, mouseY);

  // check if touchStart is the same as touchEnd
  if (touchStart?.x === touchEnd.x && touchStart?.y === touchEnd.y) {
    angleX = 0;
    angleY = 0;
    angleZ = 0;
    touchStart = null;
    touchEnd = null;
    return false;
  }

  bgColourValue = 0;
  

  // TODO: remove normalize to allow for speeds based on distance
  const touchVector = p5.Vector.sub(touchEnd, touchStart).normalize();
  console.log(touchVector);

  angleX += 0.2 * touchVector.y;
  angleY += 0.2 * touchVector.x;

  touchStart = null;
  touchEnd = null;

  // return false;
}

const print_debug = () => {
  stroke(255);
  strokeWeight(1);
  fill(255);
  textSize(12);
  text(`frame: ${frame}`, -width/2 + 8, -height/2 + 12);
  text(`frameRate: ${frameRate().toFixed(2)}`, -width/2 + 8, -height/2 + 24);
  text(`width: ${width}`, -width/2 + 8, -height/2 + 36);
  text(`angleX: ${angleX.toFixed(5)}`, -width/2 + 8, -height/2 + 48);
  text(`angleY: ${angleY.toFixed(5)}`, -width/2 + 8, -height/2 + 60);
}
