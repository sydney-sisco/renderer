let frame = 0;
let objects = [];
let bgColourValue = 0;

let addAccel = false;
let accelX = 0;
let accelY = 0;
let accelZ = 0;

let accumulator;

let touchStart = null; // for drawing the line
let touchPrevious = null;
let touchCurrent = null;
const TOUCH_SENSITIVITY = 0.01;

let showDebug = true;

addSettings([
  {
    name: 'XRotation',
    type: 'slider',
    min: -Math.PI,
    max: Math.PI,
    step: 0.01,
    startingValue: 0,
    cb: (value) => {
      objects.forEach((object) => {
        object.setAngleX(value);
      });
    }
  },
  {
    name: 'YRotation',
    type: 'slider',
    min: -Math.PI,
    max: Math.PI,
    step: 0.01,
    startingValue: 0,
    cb: (value) => {
      objects.forEach((object) => {
        object.setAngleY(value);
      });
    }
  },
  {
    name: 'ZRotation',
    type: 'slider',
    min: -Math.PI,
    max: Math.PI,
    step: 0.01,
    startingValue: 0,
    cb: (value) => {
      objects.forEach((object) => {
        object.setAngleZ(value);
      });
    }
  },
  {
    name: 'XPos',
    type: 'slider',
    min: -10,
    max: 10,
    step: 0.1,
    startingValue: 0,
    cb: (value) => {
      objects.forEach((object) => {
        object.setXPos(value);
      });
    }
  },
  {
    name: 'YPos',
    type: 'slider',
    min: -10,
    max: 10,
    step: 0.1,
    startingValue: 0,
    cb: (value) => {
      objects.forEach((object) => {
        object.setYPos(value);
      });
    }
  },
  {
    name: 'ZPos',
    type: 'slider',
    min: -10,
    max: 10,
    step: 0.1,
    startingValue: 0,
    cb: (value) => {
      objects.forEach((object) => {
        object.setZPos(value);
      });
    }
  },
  // {
  //   name: 'Sphere',
  //   type: 'button',
  //   cb: () => {
  //     reset()
  //     addSphere();
  //   }
  // },
  // {
  //   name: 'Loop',
  //   type: 'checkbox',
  //   value: true,
  //   cb: () => {
  //     if (settings['Loop'].value) {
  //       loop();
  //     }
  //     else {
  //       noLoop();
  //     }
  //   }
  // },
  // {
  //   name: 'next frame',
  //   type: 'button',
  //   cb: () => {
  //     redraw();
  //   }
  // },
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
  // {
  //   name: 'Sphere10',
  //   type: 'button',
  //   cb: async () => {
  //     reset();
  //     await parseFile('meshes/sphere10.obj');
  //     addImportedObject();
  //   }
  // },
  {
    name: 'Sphere24',
    type: 'button',
    cb: async () => {
      reset();
      await parseFile('meshes/sphere24.obj');
      addImportedObject();
    }
  },
  // {
  //   name: 'battery',
  //   type: 'button',
  //   cb: async () => {
  //     reset();
  //     await parseFile('meshes/battery.obj');
  //     addImportedObject();
  //   }
  // },
  {
    name: 'airplane',
    type: 'button',
    cb: async () => {
      reset();
      await parseFile('meshes/11803_Airplane_v1_l1.obj');
      addImportedObject();
      accelX = 0.1;
      accelY = 0.1;
    }
  },
  {
    name: 'cube',
    type: 'button',
    cb: () => {
      reset()
      addCube();
    }
  },
  {
    name: 'bad cube',
    type: 'button',
    cb: () => {
      reset()
      addBadCube();
    }
  },
  {
    name: 'reset',
    type: 'button',
    cb: () => {
      reset();
    }
  },
  {
    name: 'debug',
    type: 'button',
    cb: () => showDebug = !showDebug
  },
  {
    name: 'toggle accel',
    type: 'button',
    cb: () => addAccel = !addAccel
  },
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

function addBadCube() {
  objects.push(new BadCube(
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

const addSphere7 = async () => {
  reset();
  await parseFile('meshes/sphere10.obj');
  addImportedObject();
};

function addImportedObject() {
  objects.push(new ImportedObject(
    createVector(0, 0, 0),
    0,
    0,
    0,
    255
  ));

  if (addAccel) {
    accelX = 0.05;
    accelY = 0.025;
  }

    // angleX = .05;
  // angleY = .025;
}

function reset() {
  objects = [];

  accelX = 0;
  accelY = 0;
  // angleX = .05;
  // angleY = .025;
  accelZ = 0;

  accumulator = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ];
}

function setup() {
  createCanvas(windowWidth, windowWidth);
  
  reset()
  // addCube()
  addSphere7()
}

function draw() {
  background(bgColourValue);

  const isDragging = touchStart && touchPrevious;
  if (isDragging) {
    stroke('magenta');
    line(touchStart.x, touchStart.y, touchPrevious.x, touchPrevious.y)
  }

  translate(width / 2, height / 2);

  objects.forEach((object) => {
    object.rotate(accelX, accelY, accelZ);
    render(object, accumulator);
  });

  decelerate();

  if (showDebug) {
    print_debug();
  }

  frame++;
}

function decelerate() {
  // reduce angles by 1% each frame
  accelX *= 0.99;
  accelY *= 0.99;
  accelZ *= 0.99;

  // if the angles are very small, set them to 0
  if (abs(accelX) < 0.00001) {
    accelX = 0;
  }
  if (abs(accelY) < 0.00001) {
    accelY = 0;
  }
  if (abs(accelZ) < 0.00001) {
    accelZ = 0;
  }
}

function touchStarted() {

  // check if the user is touching the canvas
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return true;
  }

  bgColourValue = 16;
  touchStart = createVector(mouseX, mouseY);
  touchPrevious = touchStart;
  return false;
}

function touchMoved() {
  // check if the user is touching the canvas
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return true;
  }

  touchCurrent = createVector(mouseX, mouseY);

  // check if previous is the same as current
  if (touchPrevious?.x === touchCurrent.x && touchPrevious?.y === touchCurrent.y) {
    return false;
  }

  const touchVector = p5.Vector.sub(touchCurrent, touchPrevious);
  console.log('touchVector:', touchVector);

  // construct a rotation matrix about the X axis with some sensitivity_constant * delta_x
  const rotationX = (angle) => {
    return [
      [1.0, 0.0, 0.0],
      [0.0, cos(angle), -sin(angle)],
      [0.0, sin(angle), cos(angle)]
    ];
  };
  const rotX = rotationX(TOUCH_SENSITIVITY * - touchVector.y);

  // Construct another rotation matrix about the Y axis for the other component.
  const rotationY = (angle) => {
    return [
      [cos(angle), 0.0, sin(angle)],
      [0.0, 1.0, 0.0],
      [-sin(angle), 0.0, cos(angle)]
    ];
  };
  const rotY = rotationY(TOUCH_SENSITIVITY * touchVector.x);

  // Multiply one, then the other onto the accumulator.
  accumulator = matmul(rotX, accumulator);
  accumulator = matmul(rotY, accumulator);

  // return false;

  touchPrevious = touchCurrent;
}

function touchEnded() {
  bgColourValue = 0;

  // check if the user is touching the canvas
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    touchStart = null;
    return true;
  }
  touchCurrent = createVector(mouseX, mouseY);

  // check if touchStart is the same as touchEnd
  if (touchStart?.x === touchCurrent.x && touchStart?.y === touchCurrent.y) {
    accelX = 0;
    accelY = 0;
    accelZ = 0;
    touchStart = null;
    touchCurrent = null;
    touchPrevious = null;
    return false;
  }

  const touchVector = p5.Vector.sub(touchCurrent, touchPrevious);
  console.log(touchVector);

  // accelX += 0.2 * touchVector.y;
  // accelY += 0.2 * touchVector.x;

  touchStart = null;
  touchCurrent = null;
  touchPrevious = null;

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
  text(`accelX: ${accelX.toFixed(5)}`, -width/2 + 8, -height/2 + 48);
  text(`accelY: ${accelY.toFixed(5)}`, -width/2 + 8, -height/2 + 60);
}

let previousValues = [];

function updateMatrixContent(matrixContent) {
  let flattenedContent = [].concat(...matrixContent);
  const matrixContainer = document.getElementById("matrix");
  matrixContainer.innerHTML = '';

  flattenedContent.forEach((value, i) => {
    const matrixCell = document.createElement('div');
    matrixCell.textContent = value.toFixed(5);
    matrixCell.className = 'matrix-item';
    if (previousValues[i] !== undefined) {
      const difference = Math.abs(value - previousValues[i]);
      // logExtremeValues(difference);
      const green = value >= previousValues[i] ? 255 : Math.round(25500 * difference);
      const red = value < previousValues[i] ? 255 : Math.round(25500 * difference);
      matrixCell.style.color = `rgb(${red}, ${green}, 0)`;
    }
    previousValues[i] = value;
    if(value >= 0) {
      matrixCell.style.textIndent = '10px';
    }
    matrixContainer.appendChild(matrixCell);
  });
}

// let maxVal = -Infinity;
// let minVal = Infinity;

// function logExtremeValues(value) {
//   if (value > maxVal) {
//     maxVal = value;
//     console.log('New maximum value: ' + maxVal);
//   }
//   if (value < minVal) {
//     minVal = value;
//     console.log('New minimum value: ' + minVal);
//   }
// }
