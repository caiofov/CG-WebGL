
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

    /*
     Normais só necessitam ser do tipo  0,0,1,
                                        0,0,1, 
                                        0,0,1,
                                        0,0,1,
                                        0,0,1
            normal apontando para o eixo z (frente e verso do player)
                                        0,1,0,
                                        0,1,0, 
                                        0,1,0,
                                        0,1,0,
                                        0,1,0
                                    cima e baixo do player.. analogo para x
     */
    var aux = [
        //normais 
        //Quad 1
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0
    ]
    var normals = Float32Array.of(...aux, ...aux, ...aux,
        ...aux, ...aux, ...aux,
        ...aux, ...aux, ...aux,
        ...aux, ...aux, ...aux,
        ...aux, ...aux, ...aux,
        ...aux, ...aux, ...aux,
        ...aux, ...aux, ...aux,
        ...aux, ...aux, ...aux,
        ...aux, ...aux, ...aux,
    )
    var bufnormalPtr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufnormalPtr);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
    setAttributePointer("normal", 3, 0, 0);

    var lightDirectionPtr = gl.getUniformLocation(prog, "lightDirection");
    gl.uniform3fv(lightDirectionPtr, [-0.5, -1, -0.7]); //direçao da luz
    //necessario inverter vetor (negativo)
}