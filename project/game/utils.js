
function translationMatrix(x, y, z) {
    return math.matrix(
        [[1.0, 0.0, 0.0, x],
        [0.0, 1.0, 0.0, y],
        [0.0, 0.0, 1.0, z],
        [0.0, 0.0, 0.0, 1.0]]);
}
/**
 * Rotação para o eixo X
 * @param {number} angle ângulo de rotação
 */
function matrotX(angle) {
    return math.matrix(
        [[1.0, 0.0, 0.0, 0.0],
        [0.0, Math.cos(angle * Math.PI / 180.0), -Math.sin(angle * Math.PI / 180.0), 0.0],
        [0.0, Math.sin(angle * Math.PI / 180.0), Math.cos(angle * Math.PI / 180.0), 0.0],
        [0.0, 0.0, 0.0, 1.0]]
    )
}

/**
 * Rotação para o eixo Y
 * @param {number} angle ângulo de rotação
 */
function matrotY(angle) {
    return math.matrix(
        [[Math.cos(angle * Math.PI / 180.0), 0.0, -Math.sin(angle * Math.PI / 180.0), 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [Math.sin(angle * Math.PI / 180.0), 0.0, Math.cos(angle * Math.PI / 180.0), 0.0],
        [0.0, 0.0, 0.0, 1.0]]
    )
}

/**
 * Rotação para o eixo Z
 * @param {number} angle ângulo de rotação
 */
function matrotZ(angle) {
    return math.matrix(
        [[Math.cos(angle * Math.PI / 180.0), -Math.sin(angle * Math.PI / 180.0), 0.0, 0.0],
        [Math.sin(angle * Math.PI / 180.0), Math.cos(angle * Math.PI / 180.0), 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0]]
    )
}

function identityMatrix() {
    m = math.matrix(
        [[1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0]]);
    return m;
}