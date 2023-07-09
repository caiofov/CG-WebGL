/**
 * Guarda as principais informações do jogador
 */
var player = {
    x: 0,
    z: 25,
    points: 0,
    /**@type {undefined | number[]} Array de vértices */
    shape: undefined,
    objPath: "obj/player.obj"
}

/**
 * Inicializa o jogador (lê o arquivo `.obj` e atualizar o `target` da câmera)
 */
async function initPlayer() {
    player.shape = await readObjFile(player.objPath)
    camera.target = [player.x, 0, player.z]
    // camera.pos[3] = player.z + 20
}


/**
 * Desenha o jogador
 * @param {*} cam matriz da câmera
 * @param {*} mproj matriz da perspectiva
 */
function drawPlayer(cam, mproj) {
    var transMatrix = math.multiply(cam, translationMatrix(player.x, 0, player.z));
    transMatrix = math.multiply(mproj, transMatrix);
    setTransf(transMatrix)

    drawHexahedron(90, [TEXTURES.sticker[1]])
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