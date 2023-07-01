/**
 * Retorna o elemento do webgl
 * @param {HTMLCanvasElement} canvas 
 * @returns {WebGLRenderingContext | false}
 */
function getGL(canvas) {
	var gl = canvas.getContext("webgl");
	if (gl) return gl;

	gl = canvas.getContext("experimental-webgl");
	if (gl) return gl;

	alert("Contexto WebGL inexistente! Troque de navegador!");
	return false;
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

	alert("Erro de compilação: " + gl.getShaderInfoLog(shader));

	gl.deleteShader(shader);
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {WebGLShader} vtxShader 
 * @param {WebGLShader} fragShader 
 * @returns {WebGLProgram | undefined}
 */
function createProgram(gl, vtxShader, fragShader) {
	var prog = gl.createProgram();
	gl.attachShader(prog, vtxShader);
	gl.attachShader(prog, fragShader);
	gl.linkProgram(prog);

	if (prog && gl.getProgramParameter(prog, gl.LINK_STATUS))
		return prog;

	alert("Erro de linkagem: " + gl.getProgramInfoLog(prog));

	gl.deleteProgram(prog);
}

function init() {

	/** @type {HTMLCanvasElement} */
	var canvas = document.getElementById("glcanvas1");

	var gl = getGL(canvas);

	if (gl) {
		//Inicializa shaders

		/** @type {string} */
		var vtxShSrc = document.getElementById("vertex-shader").text;

		/** @type {string} */
		var fragShSrc = document.getElementById("frag-shader").text;

		var vtxShader = createShader(gl, gl.VERTEX_SHADER, vtxShSrc);
		var fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShSrc);
		var prog = createProgram(gl, vtxShader, fragShader);

		gl.useProgram(prog);

		//Inicializa área de desenho: viewport e cor de limpeza; limpa a tela
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clearColor(0, 0, 0, 1);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	}

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
	/** @type {WebGLBuffer | null} */
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