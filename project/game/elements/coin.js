
const COIN_DEFAULTS = {
    speed: 0.02,
    rotateSpeed: 1
}
const coin = {
    x: 0.2,
    y: -0.1,
    z: 0,
    shape: new Float32Array(),
    normals: new Float32Array(),
    texture: undefined,
    vPosition: { start: 0, end: 0 },
    rotateAngle: 0
}

async function initCoin() {
    const file = await readObjFile("obj/coin.obj")
    coin.shape = file.faces
    coin.normals = file.normals
    console.log(coin.shape)
    coin.vPosition = addVertices(coin.shape, coin.normals)
    coin.texture = TEXTURES.thomasFace[1]
}


function drawCoin(cam, mproj) {
    var transforma = math.multiply(translationMatrix(0, 0, coin.z), matrotY(coin.rotateAngle));
    transforma = math.multiply(cam, transforma);
    transforma = math.multiply(mproj, transforma);
    setTransfproj(transforma)
    drawInterval(coin.vPosition.start, coin.vPosition.end, coin.texture)
    coin.z += COIN_DEFAULTS.speed
    coin.rotateAngle += COIN_DEFAULTS.rotateSpeed
}