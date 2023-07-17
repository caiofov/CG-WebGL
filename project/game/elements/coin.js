
const COIN_DEFAULTS = {
    speed: 0.02,
    rotateSpeed: 1
}
const coin = {
    x: 0,
    y: -0.2,
    z: 32,
    idx: 0,
    shape: new Float32Array(),
    normals: new Float32Array(),
    texture: undefined,
    vPosition: { start: 0, end: 0 },
    rotateAngle: 0,
    color: [255, 255, 0, 255].map(c => c / 255),
    timestamp: new Date()
}

var deltaLight = 0
var lightDirection = 1

/** Move a moeda para uma posição aleatória */
function randomCoinPosition() {
    coin.idx = Math.floor(Math.random() * 3)
    coin.x = (coin.idx - 1) * (TRAIN_DEFAULTS.width + TRAIN_DEFAULTS.gap)
    coin.z = Math.floor(Math.random() * 25) + 10
    coin.timestamp = new Date()
}

/** Inicializa os vértices e a textura da moeda*/
async function initCoin() {
    const file = await readObjFile("obj/coin.obj")
    coin.shape = file.faces
    coin.normals = file.normals

    coin.vPosition = addVertices(coin.shape, coin.normals)
    coin.texture = TEXTURES.thomasFace[1]

    randomCoinPosition()
}

/**
 * Atualiza a posição e rotação da moeda e a desenha
 * @param {*} cam 
 * @param {*} mproj 
 */
function drawCoin(cam, mproj) {
    var transforma = math.multiply(matrotY(coin.rotateAngle), matrotX(coin.rotateAngle))
    var transforma = math.multiply(matrotZ(coin.rotateAngle), transforma)
    var transforma = math.multiply(translationMatrix(coin.x, coin.y, coin.z), transforma)
    var transformaproj = math.multiply(cam, transforma);
    transformaproj = math.multiply(mproj, transformaproj);

    setTransfproj(transformaproj)
    // setTransf(transforma)

    //desenha a moeda com uma cor sólida
    withSolidColor((colorPtr) => {
        gl.uniform4fv(colorPtr, coin.color);
        drawInterval(coin.vPosition.start, coin.vPosition.end, coin.texture)
    })


    if (playerCollided(coin, 0.5)) {
        for (let i = 0; i < 5; i++) score()

        TRAIN_DEFAULTS.speed += 0.01
        randomCoinPosition()
    }

    coin.rotateAngle += COIN_DEFAULTS.rotateSpeed

    updateLight()

    if ((new Date() - coin.timestamp) > 5000) {
        randomCoinPosition()
    }
}

function updateLight() {
    var pointPtr = gl.getUniformLocation(prog, "lightpos");
    gl.uniform3fv(pointPtr, [-coin.x + deltaLight, -(coin.y - 2), coin.z]);
    deltaLight += 0.05 * lightDirection
    if (deltaLight > 1) lightDirection = -1
    else if (deltaLight < -1) lightDirection = 1
}