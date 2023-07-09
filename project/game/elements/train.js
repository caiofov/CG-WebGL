const TRAIN_DEFAULTS = {
    width: 0.5,
    height: 0.5,
    depth: 1,
    gap: 0.3,
    texture: [TEXTURES.thomasSide[1], TEXTURES.thomasFace[1], TEXTURES.thomasSide[1]]
}
var trains = []
var currentTrains = []


/**
 * Adiciona o trem de número `idx` do array `trains` para o `currentTrains`
 * @param {number} idx Número do trem (0 a 2)
 */
function addNewTrain(idx) {
    if (idx > -1) {
        currentTrains.push(trains[idx])
        return true
    }
    return false
}


/**
 * Gera a estrutura do trem para o índice dado
 * @param {number} num Número do trem (0 a 2)
 */
function makeTrain(num) {
    const x = num * (TRAIN_DEFAULTS.width + TRAIN_DEFAULTS.gap)
    return {
        x, z: 0,
        shape: parallelepiped(
            [x, 0, 0],
            TRAIN_DEFAULTS.width,
            TRAIN_DEFAULTS.height,
            TRAIN_DEFAULTS.depth),
        vertexIdx: num * 30
    }
}

function makeTrains() {
    for (let i = 0; i < 3; i++) {
        trains.push(makeTrain(i))
    }
    addNewTrain(Math.floor(Math.random() * 4) - 1)
}

function getAllTrainShapes() {
    return [...trains[0].shape, ...trains[1].shape, ...trains[2].shape]
}

function drawTrains(cam, mproj) {
    for (const train of currentTrains) {
        var m = translationMatrix(0, 0, train.z)
        var transforma = math.multiply(cam, m);
        transforma = math.multiply(mproj, transforma);
        setTransf(transforma)

        drawHexahedron(train.vertexIdx, TRAIN_DEFAULTS.texture)

    }
}