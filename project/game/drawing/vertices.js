
const vertexManager = {
    vertices: [],
    normals: []
}

function addNormals(normals) {
    vertexManager.normals.push(...normals)
}

function addVertices(vertices, normals) {
    const oldLength = vertexManager.vertices.length
    const newLength = vertexManager.vertices.push(...vertices)
    if (normals) addNormals(normals)
    return { start: oldLength / 5, end: (newLength / 5) - 1 }
}

/**
 * Carrega os vértices para o webgl
 */
function loadVertices() {
    var bufPtr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufPtr);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexManager.vertices), gl.STATIC_DRAW);

    setAttributePointer("position", 3, 5, 0)
    setAttributePointer("texCoord", 2, 5, 3)
}

function loadNormals() {
    var bufnormalPtr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufnormalPtr);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexManager.normals), gl.STATIC_DRAW);
    setAttributePointer("normal", 3, 0, 0);

    var lightDirectionPtr = gl.getUniformLocation(prog, "lightDirection");
    gl.uniform3fv(lightDirectionPtr, [-0.3, -0.5, -1.0]); //PARA ONDE APONTA
    //necessario inverter vetor (negativo)
    var lightColorPtr = gl.getUniformLocation(prog,"lightColor");
    gl.uniform3fv(lightColorPtr,[1,1,1]);

    var lightposPtr = gl.getUniformLocation(prog,"lightpos");
    gl.uniform3fv(lightposPtr,[0.5,3,20]);//luz a direita da cena
}