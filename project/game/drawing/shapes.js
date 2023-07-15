/**
 * Desenha todos os vértices dentro de um intervalo
 * @param {number} startIdx índice do vértice que irá começar a figura
 * @param {number} endIdx índice do vértice que irá terminar a figura
 */
function drawInterval(startIdx, endIdx) { //TODO; textura
    for (let i = startIdx; i <= endIdx; i += 3) {
        console.log(i)
        gl.drawArrays(gl.TRIANGLES, i, 3);
    }
}

/**
 * Desenha um quadrado (dois triângulos)
 * @param {number} startIdx índice do primeiro vértice do quadrado no array de vértices
 */
function drawSquare(startIdx) {
    gl.drawArrays(gl.TRIANGLES, startIdx, 3);
    gl.drawArrays(gl.TRIANGLES, startIdx + 2, 3);
}

/**
 * Desenha um hexaedro
 * @param {number} startIdx Índice do primeiro vértice do hexaedro no array de vértices do webgl
 * @param {number[]} texIdxOrder Ordem dos índices da textura para aplicar em cada quadrado desenhado
 */
function drawHexahedron(startIdx, texIdxOrder) {
    var texPtr = gl.getUniformLocation(prog, "tex");
    var count = 0
    texIdxOrder = texIdxOrder || []
    for (let i = startIdx; i < startIdx + (5 * 6); i += 5) {
        var texIdx = Math.min(count, texIdxOrder.length - 1)
        gl.uniform1i(texPtr, texIdxOrder[texIdx]);
        drawSquare(i)
        count++
    }
}

/**
 * Calcula os vértices de um paralelepípedo
 * @param {number[]} pos Posição inicial do paralelepípedo
 * @param {number} h altura
 * @param {number} w largura
 * @param {number} d profundidade
 */
function parallelepiped(pos, w, h, d) {
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
        x, y - h, z, 0.0, 1.0,
        x, y, z, 0.0, 0.0,
        x, y, z + d, 1.0, 0.0,
        x, y - h, z + d, 1.0, 1.0,
        x, y - h, z, 0.0, 1.0,

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