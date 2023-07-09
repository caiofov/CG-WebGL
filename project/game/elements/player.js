/**
 * Guarda as principais informações do jogador
 */
var player = {
    x: 0,
    z: 25,
    /**@type {undefined | number[]} Array de vértices */
    shape: undefined,
    objPath: "obj/player.obj"
}

async function initPlayer() {
    player.shape = await readObjFile(player.objPath)
    camera.target = [player.x, 0, player.z]
    // camera.pos[3] = player.z + 20
}


function drawPlayer(cam, mproj) {
    var transMatrix = math.multiply(cam, translationMatrix(player.x, 0, player.z));
    transMatrix = math.multiply(mproj, transMatrix);
    setTransf(transMatrix)

    drawHexahedron(90, [TEXTURES.sticker[1]])
}

function movePlayer(x, y, z) {
    player.z += z
    player.y += y
    player.x += x

    //restriçoes de movimento, casas para mover personagem: 0.0 , 0.8 e 1.6
    player.x = Math.max(0, Math.min(player.x, 1.6))
}