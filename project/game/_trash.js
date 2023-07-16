/**FUNÇÕES NÃO UTILIZADAS
 * foram implementadas mas, ao longo do projeto, 
 * percebemos que não tinha necessidade de utilizá-las */


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