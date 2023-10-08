addSettings([
  // {
  //   name: 'projection',
  //   type: 'select',
  //   value: 'orthographic',
  //   options: ['perspective', 'orthographic']
  // },
  {
    name: 'renderMultiple',
    type: 'slider',
    value: 2000,
    startingValue: 2000,
    min: 400,
    max: 4000,
    step: 10,
  },
  {
    name: 'points',
    type: 'checkbox',
    value: false,
  },
]);

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
const renderCube = (cube) => {

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

  const unitCube = new Cube(0, 0, 0);

  const projectedPoints = [];
  // strokeWeight(8);
  // loop through points to draw them
  for (let i = 0; i < unitCube.points.length; i++) {
    let rotated = matmul(rotationZ, unitCube.points[i]);
    rotated = matmul(rotationX, rotated);
    rotated = matmul(rotationY, rotated);

    // add the position of the cube
    rotated[0][0] += cube.position.x;
    rotated[1][0] += cube.position.y;
    rotated[2][0] += cube.position.z;

    let projection;
    if (settings['projection'].value === 'orthographic') {
      projection = orthographicProjectionMatrix;
    } else {

      // const distance = 4.0;
      const distance = variables['zoom'].value;
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

const shade = (normal) => {
  const light = createVector(1, 1, 1).normalize();
  // const normalizedNormal = normal.normalize();
  let light_intensity = p5.Vector.dot(normal, light);
  light_intensity = min(0, light_intensity);
  return color(light_intensity * -255);
}

const render = o => {
  stroke(255);
  // strokeWeight(8);
  noFill();

  // multiply rotation matrices together
  const rotation = matmul(matmul(rotationZ(o.angleZ), rotationX(o.angleX)), rotationY(o.angleY));
  console.log('rotation: ', rotation);


updateMatrixContent(rotation);

  const projectedPoints = [];
  for (let i = 0; i < o.points.length; i++) {
    // apply rotation
    let rotated = matmul(rotationZ(o.angleZ), o.points[i]);
    rotated = matmul(rotationX(o.angleX), rotated);
    rotated = matmul(rotationY(o.angleY), rotated);

    const projected2d = matmul(orthographicProjectionMatrix, rotated);
    const v = matrixToVector(projected2d);
    v.mult(settings['renderMultiple'].value * 0.1);
    strokeWeight(4);

    if(settings['points'].value) {
      point(v.x, v.y);
    }
    projectedPoints[i] = v;
  }

  // connect points
  for (let i = 0; i < o.triangles.length; i++) {
    const t = o.triangles[i];

    // backface culling
    // const edge1 = p5.Vector.sub(projectedPoints[t[1]], projectedPoints[t[0]]);
    // const edge2 = p5.Vector.sub(projectedPoints[t[2]], projectedPoints[t[0]]);
    // const normal = p5.Vector.cross(edge1, edge2).normalize();

    // if (normal.z < 0) {

      // const colour = shade(normal);

      strokeWeight(1);
      // fill(colour);
      triangle(
        projectedPoints[t[0]].x,
        projectedPoints[t[0]].y,
        projectedPoints[t[1]].x,
        projectedPoints[t[1]].y,
        projectedPoints[t[2]].x,
        projectedPoints[t[2]].y,
      );
    }
  // }

}
