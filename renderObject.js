class RenderObject {

  constructor(points, triangles, position, angleX, angleY, angleZ, color) {
    this.points = points;
    this.triangles = triangles;
    this.position = position;
    this.angleX = angleX;
    this.angleY = angleY;
    this.angleZ = angleZ;
    this.color = color;
  }

  setAngleX = (angle) => {
    this.angleX = angle;
  }

  setAngleY = (angle) => {
    this.angleY = angle;
  }

  setAngleZ = (angle) => {
    this.angleZ = angle;
  }

  rotateX = (angle) => {
    this.angleX += angle;
  }

  rotateY = (angle) => {
    this.angleY += angle;
  }

  rotateZ = (angle) => {
    this.angleZ += angle;
  }

  rotate = (x, y, z) => {
    this.angleX += x;
    this.angleY += y;
    this.angleZ += z;
  }

};
