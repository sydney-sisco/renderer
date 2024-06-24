let r, b, g;

function setup() {
  createCanvas(400, 400);

  r = new PersistentSetting(createSlider(0, 255, 0), "red");
  g = new PersistentSetting(createSlider(0, 255, 0), "green");
  b = new PersistentSetting(createSlider(0, 255, 0), "blue");
}

function draw() {
  background(r.value(),  g.value(), b.value());
}
