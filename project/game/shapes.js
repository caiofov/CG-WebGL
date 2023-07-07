function box() {
    return new Float32Array([
        //Quad 1
        //x   y    z    tx   ty
        -0.5, 0.5, 0.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 0.0, 1.0,
        0.5, -0.5, 0.0, 1.0, 1.0,
        0.5, 0.5, 0.0, 1.0, 0.0,
        -0.5, 0.5, 0.0, 0.0, 0.0,

        //Quad 2
        -0.5, -0.5, 0.0, 1.0, 1.0,
        -0.5, 0.5, 0.0, 1.0, 0.0,
        -0.5, 0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 1.0, 0.0, 1.0,
        -0.5, -0.5, 0.0, 1.0, 1.0,

        //Quad 3
        0.5, -0.5, 1.0, 1.0, 1.0,
        0.5, -0.5, 0.0, 1.0, 0.0,
        -0.5, -0.5, 0.0, 0.0, 0.0,
        -0.5, -0.5, 1.0, 0.0, 1.0,
        0.5, -0.5, 1.0, 1.0, 1.0
    ]);
}

/**
 * Desenha um quadrado (dois triângulos)
 * @param {number} startIdx índice do primeiro vértice do quadrado no array de vértices
 */
function drawSquare(startIdx) {
    gl.drawArrays(gl.TRIANGLES, startIdx, 3);
    gl.drawArrays(gl.TRIANGLES, startIdx + 2, 3);
}
