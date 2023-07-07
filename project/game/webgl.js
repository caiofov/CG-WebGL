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

function initGL() {
    /**@type {HTMLCanvasElement} */
    var canvas = document.getElementById("glcanvas1");

    gl = getGL(canvas);

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
    //gl.enable(gl.CULL_FACE); // não renderiza faces que estão de costas -> util para polígonos fechados

}

/**
 * Carrega uma textura específica
 * @param {number} idx índice onde irá guardar a textura na memória
 * @param {string} img path para o arquivo de imagem
 */
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