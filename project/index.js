var teximg = [];
var texSrc = ["gato.jpg", "cachorro.png"].map(e => `img/${e}`);
var loadTexs = 0;

/** Ângulo de rotação*/
var angle = 0;

/**Distância focal */
var df = 2.0

/** @type {WebGLRenderingContext}*/
var gl;
/** @type {WebGLProgram}*/
var prog;

/**
 * Retorna o elemento do webgl
 * @param {HTMLCanvasElement} canvas 
 * @returns {WebGLRenderingContext}
 */
function getGL(canvas) {
    let gl = canvas.getContext("webgl");
    if (gl) return gl;

    gl = canvas.getContext("experimental-webgl");
    if (gl) return gl;

    throw "Contexto WebGL inexistente! Troque de navegador!"
}

/**
 * Cria o shader
 * @param {WebGLRenderingContext} gl 
 * @param {number} shaderType 
 * @param {string} shaderSrc 
 * @returns {WebGLShader}
 */
function createShader(gl, shaderType, shaderSrc) {
    let shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSrc);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        return shader;
    throw "Erro de compilação: " + gl.getShaderInfoLog(shader);

    gl.deleteShader(shader);

}

/**
 * Cria o programa e linka os shaders
 * @param {WebGLShader} vtxShader 
 * @param {WebGLShader} fragShader 
 * @returns {WebGLProgram}
 */
function createProgram(gl, vtxShader, fragShader) {
    let prog = gl.createProgram();
    if (!prog) throw "Erro de criação do programa"

    gl.attachShader(prog, vtxShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);

    if (gl.getProgramParameter(prog, gl.LINK_STATUS)) return prog;
    throw "Erro de linkagem: " + gl.getProgramInfoLog(prog)

    gl.deleteProgram(prog);


}



function loadTextures() {
    if (loadTexs == texSrc.length) {
        initGL();
        configScene();
        draw();
    }
}

function initGL() {

    var canvas = document.getElementById("glcanvas1");

    gl = getGL(canvas);
    if (gl) {
        //Inicializa shaders
        var vtxShSrc = document.getElementById("vertex-shader").text;
        var fragShSrc = document.getElementById("frag-shader").text;

        var vtxShader = createShader(gl, gl.VERTEX_SHADER, vtxShSrc);
        var fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShSrc);
        prog = createProgram(gl, vtxShader, fragShader);

        gl.useProgram(prog);

        //Inicializa área de desenho: viewport e cor de limpeza; limpa a tela
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.DEPTH_TEST); // profundidade, perspectiva
        gl.enable(gl.CULL_FACE); // não renderiza faces que estão de costas -> util para polígonos fechados

    }
}

function submitTexture(idx, img) {
    var tex0 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + idx);
    gl.bindTexture(gl.TEXTURE_2D, tex0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
}


/**
 * 
 * @param {string} attributeName 
 * @param {number} dataQtde 
 * @param {number} blockSize 
 * @param {number} initialJump 
 */
function setAttributePointer(attributeName, dataQtde, blockSize, initialJump) {
    //Pega ponteiro para o atributo do vertex shader
    var pointer = gl.getAttribLocation(prog, attributeName);

    gl.enableVertexAttribArray(pointer);
    //Especifica a cópia dos valores do buffer para o atributo
    gl.vertexAttribPointer(pointer,
        dataQtde,       //quantidade de dados em cada processamento
        gl.FLOAT,       //tipo de cada dado (tamanho)
        false,          //não normalizar
        blockSize * 4,  //tamanho do bloco de dados a processar em cada passo (2 floats, ou seja, 2*4 bytes = 8 bytes)
        initialJump * 4 // salto inicial (em bytes)
    );
}

function configScene() {
    //Define coordenadas dos triângulos
    var coordTriangles = new Float32Array([
        //Quad 1
        //x   y    z    tx   ty
        -0.5, 0.5, 0.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 0.0, 1.0,
        0.5, -0.5, 0.0, 1.0, 1.0,
        0.5, 0.5, 0.0, 1.0, 0.0,
        -0.5, 0.5, 0.0, 0.0, 0.0,

        //Quad 2
        -0.5, -0.5, 0.0, 1.0, 1.0,
        -0.5, 0.5, 0.0, 1.0, 0.0,
        -0.5, 0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 1.0, 0.0, 1.0,
        -0.5, -0.5, 0.0, 1.0, 1.0,

        //Quad 3
        0.5, -0.5, 1.0, 1.0, 1.0,
        0.5, -0.5, 0.0, 1.0, 0.0,
        -0.5, -0.5, 0.0, 0.0, 0.0,
        -0.5, -0.5, 1.0, 0.0, 1.0,
        0.5, -0.5, 1.0, 1.0, 1.0
    ]);

    //Cria buffer na GPU e copia coordenadas para ele
    var bufPtr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufPtr);
    gl.bufferData(gl.ARRAY_BUFFER, coordTriangles, gl.STATIC_DRAW);

    setAttributePointer("position", 3, 5, 0)
    setAttributePointer("texCoord", 2, 5, 3)

    //submeter textura para gpu
    submitTexture(0, teximg[0])
    submitTexture(1, teximg[1])

    //insere o valor da distância focal
    dfPtr = gl.getUniformLocation(prog, "df")
    gl.uniform1f(dfPtr, df)
}

/**
 * Desenha um quadrado (dois triângulos)
 * @param {number} startIdx índice do primeiro vértice do quadrado no array de vértices
 */
function drawSquare(startIdx) {
    gl.drawArrays(gl.TRIANGLES, startIdx, 3);
    gl.drawArrays(gl.TRIANGLES, startIdx + 2, 3);
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

function draw() {
    var transforma = math.multiply(matrotX(angle), matrotY(angle))
    transforma = math.multiply(transforma, matrotZ(angle))
    transforma = math.flatten(transforma)._data

    transfPtr = gl.getUniformLocation(prog, "transf");
    gl.uniformMatrix4fv(transfPtr, false, transforma);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //desenha triângulos - executa shaders
    var texPtr = gl.getUniformLocation(prog, "tex");
    gl.uniform1i(texPtr, 0);
    drawSquare(0)

    gl.uniform1i(texPtr, 1);
    drawSquare(5)

    gl.uniform1i(texPtr, 0);
    gl.drawArrays(gl.TRIANGLES, 10, 3);
    gl.uniform1i(texPtr, 1);
    gl.drawArrays(gl.TRIANGLES, 12, 3);

    angle++;

    requestAnimationFrame(draw);
}


function init() {
    for (i = 0; i < texSrc.length; i++) {
        teximg[i] = new Image();
        teximg[i].src = texSrc[i];
        teximg[i].onload = function () {
            loadTexs++;
            loadTextures();
        }
    }
}