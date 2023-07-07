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
 * @param {{_data: number[][]}} pos 
 * @param {{_data: number[][]}} target 
 * @param {{_data: number[][]}} up 
 * @returns {{_data: number[][]}} Matriz da câmera
 */
function createCamera(pos, target, up) {
    var zc = math.subtract(pos, target);
    zc = math.divide(zc, math.norm(zc));

    var yt = math.subtract(up, pos);
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
    var mov = math.matrix([[1, 0, 0, -pos[0]],
    [0, 1, 0, -pos[1]],
    [0, 0, 1, -pos[2]],
    [0, 0, 0, 1]]);

    /**@type {{_data: number[][]}} */
    var cam = math.multiply(mt, mov);

    return cam;
}