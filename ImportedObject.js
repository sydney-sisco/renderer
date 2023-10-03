class ImportedObject extends RenderObject {
  constructor(position, angleX, angleY, angleZ, colour) {
    const importedMesh = getImportedMesh();
    const vertices = importedMesh.vertices.map(v=>createVector(v[0], v[1], v[2]));
    const triangles = importedMesh.triangles;

    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let minZ = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;
    let maxZ = Number.MIN_VALUE;

    for (let vertex of vertices) {
      minX = Math.min(minX, vertex.x);
      minY = Math.min(minY, vertex.y);
      minZ = Math.min(minZ, vertex.z);
      maxX = Math.max(maxX, vertex.x);
      maxY = Math.max(maxY, vertex.y);
      maxZ = Math.max(maxZ, vertex.z);
    }

    let centerX = (minX + maxX) / 2;
    let centerY = (minY + maxY) / 2;
    let centerZ = (minZ + maxZ) / 2;

    for (let vertex of vertices) {
      vertex.x -= centerX;
      vertex.y -= centerY;
      vertex.z -= centerZ;
    }

    // model is now centered but not scaled

    let sizeX = maxX - minX;
    let sizeY = maxY - minY;
    let sizeZ = maxZ - minZ;

    let maxSize = Math.max(sizeX, sizeY, sizeZ);

    for (let vertex of vertices) {
      vertex.x /= maxSize;
      vertex.y /= maxSize;
      vertex.z /= maxSize;
    }

    super(vertices, triangles, position, angleX, angleY, angleZ, colour);
  }
}
