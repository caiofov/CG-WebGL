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

function drawPlayer(cam, mproj) {
    var transforma2 = math.multiply(cam, playerTranslationMatrix());
    transforma2 = math.multiply(mproj, transforma2);
    transforma2 = math.flatten(math.transpose(transforma2))._data;

    var transfPtr = gl.getUniformLocation(prog, "transf");
    gl.uniformMatrix4fv(transfPtr, false, transforma2);

    drawHexahedron(90, [TEXTURES.sticker[1]])
}