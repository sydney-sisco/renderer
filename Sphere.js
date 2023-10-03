class Sphere extends RenderObject {
  constructor(position, angleX, angleY, angleZ, colour) {

    const points = () => {
      const points = [];
      points.push(createVector(0, 0, 0));
      points.push(createVector(0, 0, 1));
      points.push(createVector(0, 0, -1));
      points.push(createVector(0, 1, 0));
      points.push(createVector(0, -1, 0));
      points.push(createVector(1, 0, 0));
      points.push(createVector(-1, 0, 0));
      return points;
    };

    const triangles = [[0, 0, 0]];

    super(points(), triangles, position, angleX, angleY, angleZ, colour);
  }
}