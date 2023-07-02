/**
 * Retorna o elemento do webgl
 * @param {HTMLCanvasElement} canvas 
 * @returns {WebGLRenderingContext}
 */
function getGL(canvas) {
	var gl = canvas.getContext("webgl");
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
	var shader = gl.createShader(shaderType);
	gl.shaderSource(shader, shaderSrc);
	gl.compileShader(shader);

	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
		return shader;
	throw "Erro de compilação: " + gl.getShaderInfoLog(shader);

	gl.deleteShader(shader);

}

/**
 * Cria o programa e linka os shaders
 * @param {WebGLRenderingContext} gl 
 * @param {WebGLShader} vtxShader 
 * @param {WebGLShader} fragShader 
 * @returns {WebGLProgram}
 */
function createProgram(gl, vtxShader, fragShader) {
	var prog = gl.createProgram();
	if (!prog) throw "Erro de criação do programa"

	gl.attachShader(prog, vtxShader);
	gl.attachShader(prog, fragShader);
	gl.linkProgram(prog);

	if (gl.getProgramParameter(prog, gl.LINK_STATUS)) return prog;
	throw "Erro de linkagem: " + gl.getProgramInfoLog(prog)

	gl.deleteProgram(prog);


}

/**
 * Inicializa os shaders e cria o programa
 * @param {WebGLRenderingContext} gl 
 * @returns {WebGLProgram}
 */
function getProgram(gl) {
	//Inicializa shaders

	/** @type {string} */
	var vtxShSrc = document.getElementById("vertex-shader").text;

	/** @type {string} */
	var fragShSrc = document.getElementById("frag-shader").text;

	var vtxShader = createShader(gl, gl.VERTEX_SHADER, vtxShSrc);
	var fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShSrc);

	return createProgram(gl, vtxShader, fragShader);
}

/**
 * Inicializa área de desenho: viewport e cor de limpeza; limpa a tela
 * @param {WebGLRenderingContext} gl 
 */
function initScreen(gl) {
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clearColor(0, 0, 0, 1);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

function triangles() {
	return new Float32Array([
		-0.5, -0.5, 1.0, 0.0, 0.0, 1.0,
		0.5, -0.5, 0.0, 1.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 0.0, 1.0, 1.0,
		-1.0, 0.0, 1.0, 1.0, 0.0, 0.7,
		1.0, 0.0, 1.0, 0.0, 1.0, 0.7,
		0.0, 0.5, 0.0, 1.0, 1.0, 0.7
	]);
}

function square() {
	return new Float32Array([
		-0.5, 0.5, 1.0, 1.0, 1.0, 1.0,
		-0.5, -0.5, 1.0, 1.0, 1.0, 1.0,
		0.5, -0.5, 1.0, 1.0, 1.0, 1.0,
		// 0.5, -0.5, 1.0, 1.0, 1.0, 1.0, --> Repetindo o drawArrays do webgl não precisa dessa redundância
		0.5, 0.5, 1.0, 1.0, 1.0, 1.0,
		-0.5, 0.5, 1.0, 1.0, 1.0, 1.0
	]);
}

/** Quadrado com textura */
function square_with_tex() {
	return new Float32Array([
		-0.5, 0.5, 0.0, 0.0,
		-0.5, -0.5, 0.0, 1.0,
		0.5, -0.5, 1.0, 1.0,
		0.5, 0.5, 1.0, 0.0,
		-0.5, 0.5, 1.0, 1.0,
	]);
}

/**
 * Desenha dois triângulos
 * @param {WebGLRenderingContext} gl 
 */
function draw_triangles(gl) {
	gl.drawArrays(gl.TRIANGLES, 0, 6); // a partir do vértice 0, desenha 2 triângulos (6 vértices)
}

/**
 * Desenha um quadrado
 * @param {WebGLRenderingContext} gl 
 */
function draw_square(gl) {
	gl.drawArrays(gl.TRIANGLES, 0, 3);
	gl.drawArrays(gl.TRIANGLES, 2, 6); // vai repetir o vértice 3 (para não precisar ser redundante no quadrado)
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {WebGLProgram} prog
 * @param {string} attributeName 
 * @param {number} dataQtde 
 * @param {number} blockSize 
 * @param {number} initialJump 
 */
function setAttributePointer(gl, prog, attributeName, dataQtde, blockSize, initialJump) {
	//Pega ponteiro para o atributo do vertex shader
	var pointer = gl.getAttribLocation(prog, attributeName);

	gl.enableVertexAttribArray(pointer);
	//Especifica a cópia dos valores do buffer para o atributo
	gl.vertexAttribPointer(pointer,
		dataQtde,        //quantidade de dados em cada processamento
		gl.FLOAT, //tipo de cada dado (tamanho)
		false,    //não normalizar
		blockSize * 4,      //tamanho do bloco de dados a processar em cada passo
		//0 indica que o tamanho do bloco é igual a tamanho
		//lido (2 floats, ou seja, 2*4 bytes = 8 bytes)
		initialJump * 4         //salto inicial (em bytes)
	);
}

/**
 * Cria buffer na GPU e copia coordenadas para ele
 * @param {WebGLRenderingContext} gl 
 * @param {Float32Array} coord 
 */
function addCoordinatesToBuffer(gl, coord) {
	var bufPtr = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufPtr);
	gl.bufferData(gl.ARRAY_BUFFER, coord, gl.STATIC_DRAW);
}

function init() {

	/** @type {HTMLCanvasElement} */
	var canvas = document.getElementById("glcanvas1");
	var gl = getGL(canvas);
	var prog = getProgram(gl)

	gl.useProgram(prog);

	initScreen(gl)

	//Define coordenadas dos triângulos e adiciona ao buffer
	var coordTriangles = square()
	addCoordinatesToBuffer(gl, coordTriangles)

	setAttributePointer(gl, prog, "position", 2, 6, 0)
	setAttributePointer(gl, prog, "color", 4, 6, 2)

	gl.clear(gl.COLOR_BUFFER_BIT);
	draw_square(gl)
}