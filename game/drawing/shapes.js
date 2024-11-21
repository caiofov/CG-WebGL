/**
 * Desenha todos os vértices dentro de um intervalo
 * @param {number} startIdx índice do vértice que irá começar a figura
 * @param {number} endIdx índice do vértice que irá terminar a figura
 */
function drawInterval(startIdx, endIdx) { //TODO; textura
    for (let i = startIdx; i <= endIdx; i += 3) {
        gl.drawArrays(gl.TRIANGLES, i, 3);
    }
}

/**
 * Habilita a cor sólida dos vértices para a execução da função recebida nos parâmetros
 * @param {(p:WebGLUniformLocation)=>{}} drawFunc Função de desenho
 */
function withSolidColor(drawFunc) {
    /**@type {WebGLUniformLocation} Ponteiro para variável que indica que o vértice deverá ser renderizado com cor sólida */
    var isSolidPtr = gl.getUniformLocation(prog, "isSolid");

    /**@type {WebGLUniformLocation} Ponteiro para variável que dá cor ao vértice */
    var colorPtr = gl.getUniformLocation(prog, "color");

    gl.uniform1i(isSolidPtr, 1.0);
    drawFunc(colorPtr)
    gl.uniform1i(isSolidPtr, 0.0);
}

/**
 * Calcula os vértices de um paralelepípedo
 * @param {number[]} pos Posição inicial do paralelepípedo
 * @param {number} w largura
 * @param {number} h altura
 * @param {number} d profundidade
 */
function parallelepiped(pos, w, h, d) {
    const [x, y, z] = pos
    const vertices = [
        [x - w, y - h, z + d],
        [x, y - h, z + d],
        [x - w, y, z + d],
        [x, y, z + d],

        [x - w, y, z],
        [x, y, z],
        [x - w, y - h, z],
        [x, y - h, z]
    ]
    return new Float32Array([

        // frente esquerdo
        ...vertices[0], 0.0, 1.0,
        ...vertices[1], 1.0, 1.0,
        ...vertices[2], 0.0, 0.0,
        //frente direito
        ...vertices[2], 0.0, 0.0,
        ...vertices[1], 1.0, 1.0,
        ...vertices[3], 1.0, 0.0,

        //cima esquerdo
        ...vertices[2], 0.0, 0.0,
        ...vertices[3], 0.0, 1.0,
        ...vertices[4], 1.0, 0.0,
        //cima direito
        ...vertices[4], 1.0, 0.0,
        ...vertices[3], 0.0, 1.0,
        ...vertices[5], 1.0, 1.0,

        //trás
        ...vertices[4], 0.0, 1.0,
        ...vertices[5], 0.0, 1.0,
        ...vertices[6], 0.0, 1.0,

        ...vertices[6], 0.0, 1.0,
        ...vertices[5], 0.0, 1.0,
        ...vertices[7], 0.0, 1.0,

        // baixo
        ...vertices[6], 0.0, 1.0,
        ...vertices[7], 0.0, 1.0,
        ...vertices[0], 0.0, 1.0,

        ...vertices[0], 0.0, 1.0,
        ...vertices[7], 0.0, 1.0,
        ...vertices[1], 0.0, 1.0,

        //direito esquerdo
        ...vertices[1], 0.0, 1.0,
        ...vertices[7], 1.0, 1.0,
        ...vertices[3], 0.0, 0.0,

        ...vertices[3], 0.0, 0.0,
        ...vertices[7], 1.0, 1.0,
        ...vertices[5], 1.0, 0.0,

        //esquerdo esquerdo
        ...vertices[6], 0.0, 1.0,
        ...vertices[0], 1.0, 1.0,
        ...vertices[4], 0.0, 0.0,

        ...vertices[4], 0.0, 0.0,
        ...vertices[0], 1.0, 1.0,
        ...vertices[2], 1.0, 0.0,
    ]);
}

function parallelepipedNormals() {
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
    return new Float32Array([
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,

        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
    ])
}