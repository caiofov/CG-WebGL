/**
 * Desenha um quadrado (dois triângulos)
 * @param {number} startIdx índice do primeiro vértice do quadrado no array de vértices
 */
function drawSquare(startIdx) {
    gl.drawArrays(gl.TRIANGLES, startIdx, 3);
    gl.drawArrays(gl.TRIANGLES, startIdx + 2, 3);
}

/**
 * Cálcula os vértices de um paralelepípedo
 * @param {number[]} pos Posição inicial do paralelepípedo
 * @param {number} h altura
 * @param {number} w largura
 * @param {number} d profundidade
 */
function parallelepiped(pos, h, w, d) {
    const [x, y, z] = pos
    return new Float32Array([
        //Trás
        //x    y  z  tx   ty
        x - w, y, z, 0.0, 0.0,
        x - w, y - h, z, 0.0, 1.0,
        x, y - h, z, 1.0, 1.0,
        x, y, z, 1.0, 0.0,
        x - w, y, z, 0.0, 0.0,

        //Frente
        x - w, y, z + d, 0.0, 0.0,
        x - w, y - h, z + d, 0.0, 1.0,
        x, y - h, z + d, 1.0, 1.0,
        x, y, z + d, 1.0, 0.0,
        x - w, y, z + d, 0.0, 0.0,

        //Esquerda
        x - w, y - h, z, 1.0, 1.0,
        x - w, y, z, 1.0, 0.0,
        x - w, y, z + d, 0.0, 0.0,
        x - w, y - h, z + d, 0.0, 1.0,
        x - w, y - h, z, 1.0, 1.0,

        //Direita
        x, y - h, z, 1.0, 1.0,
        x, y, z, 1.0, 0.0,
        x, y, z + d, 0.0, 0.0,
        x, y - h, z + d, 0.0, 1.0,
        x, y - h, z, 1.0, 1.0,

        //Baixo
        x, y - h, z + d, 1.0, 1.0,
        x, y - h, z, 1.0, 0.0,
        x - w, y - h, z, 0.0, 0.0,
        x - w, y - h, z + d, 0.0, 1.0,
        x, y - h, z + d, 1.0, 1.0,

        //Cima
        x, y, z + d, 1.0, 1.0,
        x, y, z, 1.0, 0.0,
        x - w, y, z, 0.0, 0.0,
        x - w, y, z + d, 0.0, 1.0,
        x, y, z + d, 1.0, 1.0
    ]);
}