/** @type {WebGLRenderingContext}*/
var gl;
/** @type {WebGLProgram}*/
var prog;
/**@type {HTMLCanvasElement} */
var canvas = document.getElementById("glcanvas1");

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
 * @param {WebGLRenderingContext} gl
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
 * Trata e altera o valor da variável `transf`
 * @param {{_data:number[][]}} value 
 */
function setTransf(value) {
    var transfPtr = gl.getUniformLocation(prog, "transf");
    value = math.flatten(math.transpose(value))._data; //webGL multiplica por colunas (transpose necessario)

    gl.uniformMatrix4fv(transfPtr, false, value);
}

/**
 * Carrega os vértices para o webgl
 * @param {number[]} vertices array com os vértices
 */
function loadVertices(vertices) {
    var bufPtr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufPtr);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    setAttributePointer("position", 3, 5, 0)
    setAttributePointer("texCoord", 2, 5, 3)
}


// ILUMINAÇÃO

function loadNormals(){

    /*
     Normais só necessitam ser do tipo  0,0,1,
                                        0,0,1, 
                                        0,0,1,
                                        0,0,1,
                                        0,0,1
            normal apontando para o eixo z (frente e verso do player)
                                        0,1,0,
                                        0,1,0, 
                                        0,1,0,
                                        0,1,0,
                                        0,1,0
                                    cima e baixo do player.. analogo para x
     */ 
    var aux = [
        //normais 
        //Quad 1
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0 
    ]
    var normals = Float32Array.of(...aux,...aux,...aux,
        ...aux,...aux,...aux,
        ...aux,...aux,...aux,
        ...aux,...aux,...aux,
        ...aux,...aux,...aux,
        ...aux,...aux,...aux,
        ...aux,...aux,...aux,
        ...aux,...aux,...aux,
        ...aux,...aux,...aux,
              )
    var bufnormalPtr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufnormalPtr);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
    setAttributePointer("normal", 3, 0, 0);
    
    var lightDirectionPtr = gl.getUniformLocation(prog, "lightDirection");
    gl.uniform3fv(lightDirectionPtr, [-0.5, -1, -0.7]); //direçao da luz
    //necessario inverter vetor (negativo)
}