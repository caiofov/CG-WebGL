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

	gl.deleteShader(shader);
	throw "Erro de compilação: " + gl.getShaderInfoLog(shader);

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

	gl.deleteProgram(prog);

	throw "Erro de linkagem: " + gl.getProgramInfoLog(prog)

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

function init() {

	/** @type {HTMLCanvasElement} */
	var canvas = document.getElementById("glcanvas1");
	var gl = getGL(canvas);
	var prog = getProgram(gl)

	gl.useProgram(prog);

	initScreen(gl)

	//Define coordenadas dos triângulos
	var coordTriangles = new Float32Array([
		-0.5, -0.5, 1.0, 0.0, 0.0, 1.0,
		0.5, -0.5, 0.0, 1.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 0.0, 1.0, 1.0,
		-1.0, 0.0, 1.0, 1.0, 0.0, 0.7,
		1.0, 0.0, 1.0, 0.0, 1.0, 0.7,
		0.0, 0.5, 0.0, 1.0, 1.0, 0.7
	]);

	//Cria buffer na GPU e copia coordenadas para ele
	var bufPtr = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufPtr);
	gl.bufferData(gl.ARRAY_BUFFER, coordTriangles, gl.STATIC_DRAW);

	//Pega ponteiro para o atributo "position" do vertex shader
	var positionPtr = gl.getAttribLocation(prog, "position");
	gl.enableVertexAttribArray(positionPtr);
	//Especifica a cópia dos valores do buffer para o atributo
	gl.vertexAttribPointer(positionPtr,
		2,        //quantidade de dados em cada processamento
		gl.FLOAT, //tipo de cada dado (tamanho)
		false,    //não normalizar
		6 * 4,      //tamanho do bloco de dados a processar em cada passo
		//0 indica que o tamanho do bloco é igual a tamanho
		//lido (2 floats, ou seja, 2*4 bytes = 8 bytes)
		0         //salto inicial (em bytes)
	);

	//Pega ponteiro para o atributo "color" do vertex shader
	var colorPtr = gl.getAttribLocation(prog, "color");
	gl.enableVertexAttribArray(colorPtr);
	//Especifica a cópia dos valores do buffer para o atributo
	gl.vertexAttribPointer(colorPtr,
		4,        //quantidade de dados em cada processamento
		gl.FLOAT, //tipo de cada dado (tamanho)
		false,    //não normalizar
		6 * 4,      //tamanho do bloco de dados a processar em cada passo
		//0 indica que o tamanho do bloco é igual a tamanho
		//lido (2 floats, ou seja, 2*4 bytes = 8 bytes)
		2 * 4       //salto inicial (em bytes)
	);


	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.TRIANGLES, 0, 6);
}