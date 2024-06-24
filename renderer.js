let showPoints = false;

const togglePoints = () => {
  showPoints = !showPoints;
};

// addSettings([
//   {
//     name: 'projection',
//     type: 'select',
//     value: 'perspective',
//     options: ['perspective', 'orthographic']
//   },
//   {
//     name: 'renderMultiple',
//     type: 'slider',
//     value: 2000,
//     startingValue: 2000,
//     min: 400,
//     max: 4000,
//     step: 10,
//   },
//   {
//     name: 'points',
//     type: 'button',
//     cb: togglePoints
//   },
// ]);

const renderSetting = {
  'projection': {
    value: 'perspective'
  },
  'renderMultiple': {
    value: 2000
  },
}

// settings['projection'].value === 'orthographic'

const orthographicProjectionMatrix = [
  [1, 0, 0],
  [0, 1, 0]
];

const rotationX = (angle) => {
  return [
    [1.0, 0.0, 0.0],
    [0.0, cos(angle), -sin(angle)],
    [0.0, sin(angle), cos(angle)]
  ];
};

const rotationY = (angle) => {
  return [
    [cos(angle), 0.0, sin(angle)],
    [0.0, 1.0, 0.0],
    [-sin(angle), 0.0, cos(angle)]
  ];
};

const rotationZ = (angle) => {
  return [
    [cos(angle), -sin(angle), 0.0],
    [sin(angle), cos(angle), 0.0],
    [0.0, 0.0, 1.0]
  ];
};

// TODO: extract projection stuff from this and DELETE it
const renderCube = (cube, camera_vector) => {

  stroke(cube.color);
  // strokeWeight(8);
  noFill();

  const rotationX = [
    [1.0, 0.0, 0.0],
    [0.0, cos(cube.angleX), -sin(cube.angleX)],
    [0.0, sin(cube.angleX), cos(cube.angleX)]
  ];
  
  const rotationY = [
    [cos(cube.angleY), 0.0, sin(cube.angleY)],
    [0.0, 1.0, 0.0],
    [-sin(cube.angleY), 0.0, cos(cube.angleY)]
  ];
  
  const rotationZ = [
    [cos(cube.angleZ), -sin(cube.angleZ), 0.0],
    [sin(cube.angleZ), cos(cube.angleZ), 0.0],
    [0.0, 0.0, 1.0]
  ];

  // const unitCube = cube;

  const projectedPoints = [];
  // strokeWeight(8);
  // loop through points to draw them
  for (let i = 0; i < cube.points.length; i++) {
    let rotated = matmul(rotationZ, cube.points[i]);
    rotated = matmul(rotationX, rotated);
    rotated = matmul(rotationY, rotated);

    // add the position of the cube
    rotated[0][0] += cube.position.x;
    rotated[1][0] += cube.position.y;
    rotated[2][0] += cube.position.z;

    // add the position of the camera
    rotated[0][0] += camera_vector.x;
    rotated[1][0] += camera_vector.y;
    rotated[2][0] += camera_vector.z;

    let projection;
    if (renderSetting['projection'].value === 'orthographic') {
      projection = orthographicProjectionMatrix;
    } else {

      const distance = 3.0;
      // const distance = variables['zoom'].value;
      const z = 1.0 / (distance - rotated[2][0]);
      projection = [
        [z, 0.0, 0.0],
        [0.0, z, 0.0]
      ];
    }

    const projected2d = matmul(projection, rotated);
    const v = matrixToVector(projected2d);
    v.mult(200);
    strokeWeight(4);
    point(v.x, v.y);
    projectedPoints[i] = v;
  }

  // connect points
  for (let i = 0; i < 4; i++) {
    connect(i, (i + 1) % 4, projectedPoints);
    connect(i + 4, ((i + 1) % 4) + 4, projectedPoints);
    connect(i, i + 4, projectedPoints);
  }
};

const connect = (i, j, points)=>{
  line(points[i].x, points[i].y, points[j].x, points[j].y);
}

const shade = (normal) => {
  const light = createVector(1, 1, 1).normalize();
  // const normalizedNormal = normal.normalize();
  let light_intensity = p5.Vector.dot(normal, light);
  light_intensity = min(0, light_intensity);
  return color(light_intensity * -255);
}

// renders a mesh
const render = (o, accumulator, camera_vector) => {
  stroke(255);
  noFill();

  // multiply rotation matrices together with the accumulator
  let rotation = matmul(matmul(rotationZ(o.angleZ), rotationX(o.angleX)), rotationY(o.angleY))
  if (accumulator) {
    rotation = matmul(rotation, accumulator)
  }

  const projectedPoints = [];
  for (let i = 0; i < o.points.length; i++) {
    // apply rotation
    const rotated = matmul(rotation, o.points[i]);

    // add position of the object
    rotated[0][0] += o.position.x;
    rotated[1][0] += o.position.y;
    rotated[2][0] += o.position.z;

    if (camera_vector) {
      // add the position of the camera
      rotated[0][0] += camera_vector.x;
      rotated[1][0] += camera_vector.y;
      rotated[2][0] += camera_vector.z;
    }

    let projection;
    if (renderSetting['projection'].value === 'orthographic') {
      projection = orthographicProjectionMatrix;
    } else {

      const distance = 3.0;
      // const distance = variables['zoom'].value;
      const z = 1.0 / (distance - rotated[2][0]);
      projection = [
        [z, 0.0, 0.0],
        [0.0, z, 0.0]
      ];
    }

    const projected2d = matmul(projection, rotated);
    const v = matrixToVector(projected2d);
    v.mult(renderSetting['renderMultiple'].value * 0.1);
    strokeWeight(4);

    if(showPoints) {
      point(v.x, v.y);
    }
    projectedPoints[i] = v;
  }

  // connect points
  for (let i = 0; i < o.triangles.length; i++) {
    const t = o.triangles[i];

    // backface culling
    const edge1 = p5.Vector.sub(projectedPoints[t[1]], projectedPoints[t[0]]);
    const edge2 = p5.Vector.sub(projectedPoints[t[2]], projectedPoints[t[0]]);
    const normal = p5.Vector.cross(edge1, edge2).normalize();

    if (normal.z > 0) {
      stroke('black')
      strokeWeight(1);
      fill(o.color);
      // fill('rgba(255, 255, 255, 0.25)');
      triangle(
        projectedPoints[t[0]].x,
        projectedPoints[t[0]].y,
        projectedPoints[t[1]].x,
        projectedPoints[t[1]].y,
        projectedPoints[t[2]].x,
        projectedPoints[t[2]].y,
      );
    }
  }
}
