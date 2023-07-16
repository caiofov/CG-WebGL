
const COIN_DEFAULTS = {
    speed: 0.02,
    rotateSpeed: 1
}
const coin = {
    x: 0,
    y: -0.2,
    z: 32,
    shape: new Float32Array(),
    normals: new Float32Array(),
    texture: undefined,
    vPosition: { start: 0, end: 0 },
    rotateAngle: 0,
    color: [255, 255, 0, 255].map(c => c / 255)
}
function randomCoinPosition() {
    return { x: (Math.floor(Math.random() * 3) - 1) * (TRAIN_DEFAULTS.width + TRAIN_DEFAULTS.gap), z: Math.floor(Math.random() * 30) + 5 }
}
async function initCoin() {
    const file = await readObjFile("obj/coin.obj")
    coin.shape = file.faces
    coin.normals = file.normals
    console.log(coin.shape)
    coin.vPosition = addVertices(coin.shape, coin.normals)
    coin.texture = TEXTURES.thomasFace[1]

    const randomPos = randomCoinPosition()
    coin.x = randomPos.x
    coin.z = randomPos.z
}

function drawCoin(cam, mproj) {
    var transforma = math.multiply(matrotY(coin.rotateAngle), matrotX(coin.rotateAngle))
    var transforma = math.multiply(matrotZ(coin.rotateAngle), transforma)
    var transforma = math.multiply(translationMatrix(coin.x, coin.y, coin.z), transforma)
    var transformaproj = math.multiply(cam, transforma);
    transformaproj = math.multiply(mproj, transformaproj);

    setTransfproj(transformaproj)
    // setTransf(transforma)
    withSolidColor((colorPtr) => {
        gl.uniform4fv(colorPtr, coin.color);
        drawInterval(coin.vPosition.start, coin.vPosition.end, coin.texture)
    })
    coin.rotateAngle += COIN_DEFAULTS.rotateSpeed
}