const TRAIN_DEFAULTS = {
    width: 0.5,
    height: 0.5,
    depth: 1,
    gap: 0.3,
    texture: [TEXTURES.thomasSide[1], TEXTURES.thomasFace[1], TEXTURES.thomasSide[1]]
}
var trains = []
var currentTrains = []

function addNewTrains() {
    for (let i = 0; i < 1; i++) {
        // gera número aleatório de -1 a 2
        //Se for -1, nenhum trem vai ser adicionado àquele trilho
        var idx = Math.floor(Math.random() * 4) - 1;

        if (idx > -1) currentTrains.push(trains[idx])

    }
    if (!currentTrains.length) currentTrains.push(trains[0])
}

/**
 * 
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
            TRAIN_DEFAULTS.depth)
    }
}

function makeTrains() {
    for (let i = 0; i < 3; i++) {
        trains.push(makeTrain(i))
    }
    addNewTrains()
}

function getAllTrainShapes() {
    return [...trains[0].shape, ...trains[1].shape, ...trains[2].shape]
}

function drawTrains(cam, mproj) {
    for (const train of currentTrains) {
        var m = translationMatrix(train.x, 0, train.z)

        var transforma = math.multiply(cam, m);
        transforma = math.multiply(mproj, transforma);
        setTransf(transforma)

        drawHexahedron(0, TRAIN_DEFAULTS.texture)
        drawHexahedron(30, TRAIN_DEFAULTS.texture)
        drawHexahedron(60, TRAIN_DEFAULTS.texture)
    }
}