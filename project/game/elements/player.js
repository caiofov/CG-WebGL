/**
 * Guarda as principais informações do jogador
 */
var player = {
    x: 0,
    z: 25,
    /**@type {undefined | number[]} Array de vértices */
    shape: [],
    normals: [],
    objPath: "obj/tinker.obj",
    vPosition: { start: 0, end: 0 }
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
    player.colors = {
        body: [0, 0, 204, 255].map(c => c / 255),
        head: [255, 255, 0, 255].map(c => c / 255)
    }

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
    //setTransf(m)

    var colorPtr = gl.getUniformLocation(prog, "color");
    var isSolidPtr = gl.getUniformLocation(prog, "isSolid");

    gl.uniform1i(isSolidPtr, 1.0);


    gl.uniform4fv(colorPtr, player.colors.body);
    //corpo
    drawInterval(player.vPosition.start, player.vPosition.start + 35);

    gl.uniform4fv(colorPtr, player.colors.head);
    //cabeça
    drawInterval(player.vPosition.start + 36, player.vPosition.end);

    gl.uniform1i(isSolidPtr, 0);
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
    console.log(player.x, player.z)
}

function getPlayerRail() {
    return player.x / 0.8
}

/**
 * Verifica se o player colidiu com o trem
 * @param {{z:number idx:number}} train 
 */
function playerCollided(train) {
    return train.z <= player.z && player.z <= (train.z + TRAIN_DEFAULTS.depth) && getPlayerRail() == train.idx
}