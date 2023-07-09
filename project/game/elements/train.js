const TRAIN_DEFAULTS = {
    width: 0.5,
    height: 0.5,
    depth: 1,
    gap: 0.3
}
var trains = []

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
}

function getAllTrainShapes() {
    return [...trains[0].shape, ...trains[1].shape, ...trains[2].shape]
}