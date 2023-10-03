function logMaxtrix(m) {
  const rows = m.length;
  const cols = m[0].length;

  console.log(rows, "x", cols);
  console.log('----------------');
  for (let i = 0; i < rows; i++) {
    let row = '';
    for (let j = 0; j < cols; j++) {
      row += m[i][j] + ' ';
    }
    console.log(row);
  }
  console.log('----------------\n');
};

function matmul(a, b) {

  // check if B is maybe a vector
  if (b[0] === undefined) {
    b = vectorTopoint(b);
  }

  const colsA = a[0].length;
  const rowsA = a.length;
  const colsB = b[0].length;
  const rowsB = b.length;

  // colsA must equal rowsB
  if (colsA != rowsB) {
    console.log('colsA must equal rowsB');
    return null;
  }

  const result = [];

  for (let i = 0; i < rowsA; i++) {
    result[i] = [];
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
};


const vectorTopoint = (v) => {
  const m = [];
  m.push([v.x]);
  m.push([v.y]);
  if (v.z || v.z === 0) {
    m.push([v.z]);
  }
  return m;
};

const matrixToVector = (m) => {
  const v = createVector();
  v.x = m[0][0];
  v.y = m[1][0];
  if (m.length > 2) {
    v.z = m[2][0];
  }
  return v;
};
