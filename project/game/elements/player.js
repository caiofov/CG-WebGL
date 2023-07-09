/**
 * Guarda as principais informações do jogador
 */
var player = {
    x: 0,
    z: 0,
    /**@type {undefined | number[]} Array de vértices */
    shape: undefined,
    objPath: "obj/player.obj"
}

async function initPlayer() {
    player.shape = await readObjFile(player.objPath)
}

function playerTranslationMatrix() {
    return math.matrix(
        [[1.0, 0.0, 0.0, player.x],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, player.z],
        [0.0, 0.0, 0.0, 1.0]]);
}