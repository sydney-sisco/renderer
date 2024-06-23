class Cube extends RenderObject {
  constructor(position, angleX, angleY, angleZ, colour, scale) {


    
    const points = () => {
      const points = [];
      points.push(createVector(.5, -.5, .5));
      points.push(createVector(.5, -.5, -.5));
      points.push(createVector(.5, .5, -.5));
      points.push(createVector(.5, .5, .5));
      points.push(createVector(-.5, .5, .5));
      points.push(createVector(-.5, .5, -.5));
      points.push(createVector(-.5, -.5, -.5));
      points.push(createVector(-.5, -.5, .5));

      if (scale) {
        for (let i = 0; i < points.length; i++) {
          const point_x = points[i].x * scale.x
          const point_y = points[i].y * scale.y
          const point_z = points[i].z * scale.z
          points[i] = createVector(point_x, point_y, point_z)
        }
      }

      return points;
    }

    const triangles = [
      [0, 1, 2], // good
      [0, 2, 3], // good
      [4, 5, 6], // good
      [4, 6, 7], // good
      [3, 4, 7], // fixed
      [3, 7, 0], // fixed
      [7, 6, 1], // fixed
      [7, 1, 0], // fixed
      [3, 2, 5], // fixed 
      [3, 5, 4], // fixed
      [1, 6, 5], // fixed
      [1, 5, 2]  // fixed
    ];

    super(points(), triangles, position, angleX, angleY, angleZ, colour);
  }
}
