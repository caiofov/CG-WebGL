const camera = {
    pos: [0, 1, 40],
    target: [0, 0, 0],
    up: [0, 2, 40]
}
var campos = [camera.pos[0]-3.5,camera.pos[1],camera.pos[2]-5];

/**
 * Faz o cálculo da perspectiva
 * @param {number} fovy Ângulo (*em ângulos*) do campo de visão do eixo Y *(igual ao `fovx` se a tela for quadrada)*
 * @param {number} aspect *Aspect ratio* - proporções da tela (é uma fração)
 * @param {number} near coordenada Z de clipping mínimo
 * @param {number} far coordenada Z de clipping máximo
 * @returns {{_data: number[][]}} Matriz
 */
function createPerspective(fovy, aspect, near, far) {
    fovy = fovy * Math.PI / 180.0; //converter para radianos

    var fy = 1 / math.tan(fovy / 2.0);
    var fx = fy / aspect;
    var B = -2 * far * near / (far - near);
    var A = -(far + near) / (far - near);

    /**@type {{_data: number[][]}} */
    var proj = math.matrix(
        [[fx, 0.0, 0.0, 0.0],
        [0.0, fy, 0.0, 0.0],
        [0.0, 0.0, A, B],
        [0.0, 0.0, -1.0, 0.0]]);//garante divisão por -z

    return proj;
}

/**
 * Cria uma câmera
 * @returns {{_data: number[][]}} Matriz da câmera
 */
function createCamera() {
    var zc = math.subtract(camera.pos, camera.target);
    zc = math.divide(zc, math.norm(zc));

    var yt = math.subtract(camera.up, camera.pos);
    yt = math.divide(yt, math.norm(yt));

    var xc = math.cross(yt, zc);
    xc = math.divide(xc, math.norm(xc));

    var yc = math.cross(zc, xc);
    yc = math.divide(yc, math.norm(yc));

    /**@type {{_data: number[][]}} */
    var mt = math.inv(math.transpose(math.matrix([xc, yc, zc])));

    mt = math.resize(mt, [4, 4], 0);
    mt._data[3][3] = 1;

    /**@type {{_data: number[][]}} */
    var mov = math.matrix([[1, 0, 0, -camera.pos[0]],
    [0, 1, 0, -camera.pos[1]],
    [0, 0, 1, -camera.pos[2]],
    [0, 0, 0, 1]]);

    /**@type {{_data: number[][]}} */
    var cam = math.multiply(mt, mov);

    return cam;
}

/**
 * Movimenta a câmera, respeitando os limites
 * @param {number} x o quanto mover no eixo X
 * @param {number} y o quanto mover no eixo Y
 * @param {number} z o quanto mover no eixo Z
 */
function moveCamera(x, y, z) {
    camera.pos[0] += x
    camera.pos[1] += y
    camera.pos[2] += z

    camera.target[0] = player.x
    camera.target[2] = player.z

    // Restriçoes de movimento, so 3 casas para mover a camera 0.0 , 0.8 e 1.6
    camera.target[0] = Math.max(0, Math.min(camera.target[0], 1.6))
    camera.target[2] = Math.max(6, Math.min(camera.target[2], 37))
    camera.pos[0] = Math.max(0, Math.min(camera.pos[0], 1.6))
    camera.pos[2] = Math.max(21, Math.min(camera.pos[2], 52))

    camera.up = [camera.pos[0], camera.pos[1] + 1, camera.pos[2]]
}