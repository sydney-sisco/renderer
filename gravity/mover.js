class Mover {
  constructor(x, y, m) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity = createVector(1.5, 0);
    this.acceleration = createVector(0, 0);
    this.mass = m;
    this.radius = sqrt(this.mass) * 10;
  }

  applyForce(force) {
    const f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  edges() {
    if (this.position.y >= (height/2) - this.radius) {
      this.position.y = (height / 2) - this.radius;
      this.velocity.y *= -1;
    }

    if (this.position.x >= (width/2) - this.radius) {
      this.position.x = (width / 2) - this.radius;
      this.velocity.x *= -1;
    } else if (this.position.x <= (-width/2) + this.radius) {
      this.position.x = (-width / 2) + this.radius;
      this.velocity.x *= -1;
    }
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  show() {
    stroke(255);
    strokeWeight(2);
    fill(0, 0, 255);
    ellipse(this.position.x, this.position.y, this.radius * 2);
  }
}
