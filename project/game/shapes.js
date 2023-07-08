function box(init, size) {

    return new Float32Array([
        //Quad 1
        //x         y       z       tx   ty
        -init[0], init[1], init[2], 0.0, 0.0,
        -init[0], -init[1], init[2], 0.0, 1.0,
        init[0], -init[1], init[2], 1.0, 1.0,
        init[0], init[1], init[2], 1.0, 0.0,
        -init[0], init[1], init[2], 0.0, 0.0,

        //Quad 2
        -init[0], -init[1], init[2], 1.0, 1.0,
        -init[0], init[1], init[2], 1.0, 0.0,
        -init[0], init[1], init[2] + size, 0.0, 0.0,
        -init[0], -init[1], init[2] + size, 0.0, 1.0,
        -init[0], -init[1], init[2], 1.0, 1.0,

        //Quad 3
        init[0], -init[1], init[2] + size, 1.0, 1.0,
        init[0], -init[1], init[2], 1.0, 0.0,
        -init[0], -init[1], init[2], 0.0, 0.0,
        -init[0], -init[1], init[2] + size, 0.0, 1.0,
        init[0], -init[1], init[2] + size, 1.0, 1.0
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
