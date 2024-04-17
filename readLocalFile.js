document.getElementById('fileSelectorButton').addEventListener('click', function() {
  document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64Content = e.target.result;
    const base64Data = base64Content.split(';base64,').pop();
    const decodedContent = atob(base64Data);
  
    // parse and render
    var obj = parseOBJ(decodedContent);
    importedMesh = obj;
    reset();
    addImportedObject();
  };
  reader.readAsDataURL(file);
});
