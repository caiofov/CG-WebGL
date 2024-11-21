/**
 * Guarda as principais informações do jogador
 */
const player = {
    x: 0,
    z: 25,
    shape: new Float32Array(),
    normals: new Float32Array(),
    objPath: "obj/tinker.obj",
    vPosition: { start: 0, end: 0 },
    colors: {
        body: [0, 0, 204, 255].map(c => c / 255),
        head: [255, 255, 0, 255].map(c => c / 255),
        gameOver: [255, 0, 0, 255].map(c => c / 255)
    }
}

/**
 * Inicializa o jogador (lê o arquivo `.obj` e atualizar o `target` da câmera)
 */
async function initPlayer() {
    const file = await readObjFile(player.objPath)

    player.shape = file.faces
    player.normals = file.normals
    camera.target = [player.x, 0, player.z]
    player.vPosition = addVertices(player.shape, player.normals)
}


/**
 * Desenha o jogador
 * @param {*} cam matriz da câmera
 * @param {*} mproj matriz da perspectiva
 */
function drawPlayer(cam, mproj) {
    var m = translationMatrix(player.x, 0, player.z)
    var transMatrix = math.multiply(cam, m);
    transMatrix = math.multiply(mproj, transMatrix);
    setTransfproj(transMatrix)

    //desenha os vértices com cor sólida
    withSolidColor((colorPtr) => {
        if (GAME.isRunning) {
            gl.uniform4fv(colorPtr, player.colors.body);
            drawInterval(player.vPosition.start, player.vPosition.start + 35);

            gl.uniform4fv(colorPtr, player.colors.head);
            drawInterval(player.vPosition.start + 36, player.vPosition.end);
        } else { //caso tenha dado Game Over, desenhar o player de outra cor
            gl.uniform4fv(colorPtr, player.colors.gameOver);
            drawInterval(player.vPosition.start, player.vPosition.end);
        }
    })
}

/**
 * Movimenta o jogador, respeitando os limites
 * @param {number} x o quanto mover no eixo X
 * @param {number} y o quanto mover no eixo Y
 * @param {number} z o quanto mover no eixo Z
 */
function movePlayer(x, y, z) {
    player.z += z
    player.y += y
    player.x += x

    //restriçoes de movimento, casas para mover personagem: 0.0 , 0.8 e 1.6
    player.x = Math.max(0, Math.min(player.x, 1.6))
    player.z = Math.max(6, Math.min(player.z, 37))

}

/**
 * @returns {number}  número do trilho que o player está
 */
function getPlayerRail() {
    return player.x / 0.8
}

/**
 * @param {{z:number idx:number}} object 
 * @returns {boolean} se o player colidiu com algum objeto
 */
function playerCollided(object, objDepth) {
    return object.z <= player.z && player.z <= (object.z + objDepth) && getPlayerRail() == object.idx
}