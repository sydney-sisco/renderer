class Mover {
  constructor(x, y, v, m, c) {
    this.position = createVector(x, y);
    this.velocity = createVector(v.x, v.y);
    this.acceleration = createVector(0, 0);
    this.mass = m;
    this.radius = sqrt(this.mass) * 10;
    this.colour = c;
  }

  applyForce(force) {
    const f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  show() {
    stroke(255);
    strokeWeight(2);
    fill(color(this.colour));
    ellipse(this.position.x, this.position.y, this.radius * 2);
  }
}
