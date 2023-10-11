class Attractor {
  constructor(x, y, m) {
    this.position = createVector(x, y);
    this.mass = m;
    this.radius = sqrt(this.mass) * 10;
    this.G = 50; // gravitational constant
  }

  attract(mover) {
    let force = p5.Vector.sub(this.position, mover.position);
    let distanceSq = force.magSq();

    let strength = (this.mass * mover.mass / distanceSq) * this.G;

    force.setMag(strength);
    mover.applyForce(force);
  }

  show() {
    stroke(255);
    strokeWeight(2);
    fill(255, 165, 0)
    ellipse(this.position.x, this.position.y, this.radius * 2);
  }
}
