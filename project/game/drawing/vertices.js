
const vertexManager = {
    vertices: []
}

/**
 * Carrega os vértices para o webgl
 */
function loadVertices() {
    var bufPtr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufPtr);
    gl.bufferData(gl.ARRAY_BUFFER, vertexManager.vertices, gl.STATIC_DRAW);

    setAttributePointer("position", 3, 5, 0)
    setAttributePointer("texCoord", 2, 5, 3)
}

function addVertices(vertices) {
    const oldLength = vertexManager.vertices.length
    const newLength = vertexManager.vertices.push(...vertices)
    return { start: oldLength, end: newLength }
}