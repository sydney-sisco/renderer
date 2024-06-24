// the original Cube, which is bad because the faces don't work with
// backface culling.

class BadCube extends RenderObject {
  constructor(position, angleX, angleY, angleZ, colour) {
    
    const points = () => {
      const points = [];
      points.push(createVector(-.5, -.5, -.5));
      points.push(createVector(.5, -.5, -.5));
      points.push(createVector(.5, .5, -.5));
      points.push(createVector(-.5, .5, -.5));
      points.push(createVector(-.5, -.5, .5));
      points.push(createVector(.5, -.5, .5));
      points.push(createVector(.5, .5, .5));
      points.push(createVector(-.5, .5, .5));
      return points;
    }

    const triangles = [[0, 1, 2],
    [0, 2, 3],
    [4, 5, 6],
    [4, 6, 7],
    [0, 4, 5],
    [0, 1, 5],
    [1, 5, 6],
    [1, 2, 6],
    [2, 6, 7],
    [2, 3, 7],
    [3, 7, 4],
    [3, 0, 4]];

    super(points(), triangles, position, angleX, angleY, angleZ, colour);
  }
}
