function parseOBJ(text) {
  var lines = text.split('\n');
  var vertices = [];
  var triangles = [];
  for (var i = 0; i < lines.length; i++) {
      var parts = lines[i].trim().split(' ');
      if (parts[0] === 'v') {
          // Parse vertex line
          vertices.push([
              parseFloat(parts[1]), 
              parseFloat(parts[2]), 
              parseFloat(parts[3])
          ]);
      } else if (parts[0] === 'f') {
          // Parse polygon line
          triangles.push([
              parseInt(parts[1]) - 1, 
              parseInt(parts[2]) - 1, 
              parseInt(parts[3]) - 1
          ]);
      }
  }
  return { vertices, triangles };
}
class UniqueVertices {
  constructor() {
    this.vertices = new Set();
  }

  addVertex = (vertex) => {
    this.vertices.add(JSON.stringify(vertex));
  
    // Return the index of the vertex
    return Array.from(this.vertices).indexOf(JSON.stringify(vertex));
  }
}
function parseSTL(text) {
  let lines = text.split('\n');
  let vertices = new UniqueVertices();
  let triangles = [];
  let currentTriangleVertices = [];

  lines.forEach(line => {
    const parts = line.trim().split(' ');
  
    if (parts[0] === 'vertex') {
      const vertex = [
        parseFloat(parts[1]),
        parseFloat(parts[2]),
        parseFloat(parts[3])
      ];
  
      const vertexIndex = vertices.addVertex(vertex);  // Fetch the position of the vertex from our custom class method
      currentTriangleVertices.push(vertexIndex);  // Add the index instead of the vertex itself 💾👈
    }
    
    if (parts[0] === 'endloop') {
      triangles.push(currentTriangleVertices);
      currentTriangleVertices = [];
    }
  });

  return {
    vertices: // Convert the Set to an array
      Array.from(vertices.vertices)
      // Convert each stringified vertex back to a vertex array
      .map(vertex => JSON.parse(vertex)),
    triangles: triangles
  };
};

async function parseFile(filePath) {
  // const filePath = '/path/to/your/file.obj';  // Adjust your file path 

  // Checking file extension
  var extension = filePath.split('.').pop().toLowerCase();

  // Fetch file from server
  await fetch(filePath)
    .then(response => response.text())
    .then(data => {
      if (extension === 'obj') {
        var obj = parseOBJ(data);
        importedMesh = obj;
      } else if (extension === 'stl') {
        var stl = parseSTL(data);
        importedMesh = stl;
      } else {
        alert('File format not supported!');
      }
      console.log(`imported ${extension} file:`, importedMesh);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

let importedMesh = null;
getImportedMesh = () => {
  return importedMesh;
};

