var teximg = [];
var texSrc = ["img/gato.jpg", "img/cachorro.png"];
var loadTexs = 0;
var gl;
var prog;
var df = 2.0;

var angle = 0;

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

function init()
{
    for(i = 0; i < texSrc.length; i++)
    {
        teximg[i] = new Image();
        teximg[i].src = texSrc[i];
        teximg[i].onload = function()
        {
            loadTexs++;
    	    loadTextures();
        }
    }
}

function loadTextures()
{
    if(loadTexs == texSrc.length)
    {
       initGL();
       configScene();
       draw();
    }
}

function initGL()
{

	var canvas = document.getElementById("glcanvas1");
	
	gl = getGL(canvas);
	if(gl)
	{
        //Inicializa shaders
 		var vtxShSrc = document.getElementById("vertex-shader").text;
		var fragShSrc = document.getElementById("frag-shader").text;

        var vtxShader = createShader(gl, gl.VERTEX_SHADER, vtxShSrc);
        var fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShSrc);
        prog = createProgram(gl, vtxShader, fragShader);	
        
        gl.useProgram(prog);

        //Inicializa Ã¡rea de desenho: viewport e cor de limpeza; limpa a tela
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.enable( gl.BLEND );
        gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
        gl.enable(gl.DEPTH_TEST);
        //gl.enable(gl.CULL_FACE);

    }
}   


function configScene()
{    
	//Define coordenadas dos triÃ¢ngulos
	var coordTriangles = new Float32Array([
						//Quad 1
							-0.5,  0.5, 0.0, 0.0, 0.0, 
							-0.5, -0.5, 0.0, 0.0, 1.0, 
							0.5, -0.5, 0.0, 1.0, 1.0,
							0.5,  0.5, 0.0, 1.0, 0.0, 
							-0.5,  0.5, 0.0, 0.0, 0.0,
						//Quad 2
						-0.5, -0.5, 0.0, 1.0, 1.0, 
						-0.5,  0.5, 0.0, 1.0, 0.0, 
						-0.5,  0.5, 1.0, 0.0, 0.0,
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
	
	//Pega ponteiro para o atributo "position" do vertex shader
	gl.setAttributePointer(gl,prog,"position",3,5,0)
	
	// var positionPtr = gl.getAttribLocation(prog, "position");
	// gl.enableVertexAttribArray(positionPtr);
	// //Especifica a cÃ³pia dos valores do buffer para o atributo
	// gl.vertexAttribPointer(positionPtr, 
	// 						3,        //quantidade de dados em cada processamento
	// 						gl.FLOAT, //tipo de cada dado (tamanho)
	// 						false,    //nÃ£o normalizar
	// 						5*4,      //tamanho do bloco de dados a processar em cada passo
	// 									//0 indica que o tamanho do bloco Ã© igual a tamanho
	// 									//lido (2 floats, ou seja, 2*4 bytes = 8 bytes)
	// 						0         //salto inicial (em bytes)
	// 						);
	
	gl.setAttributePointer(gl,prog,"texCoord",2,5,3)
	// var texcoordPtr = gl.getAttribLocation(prog, "texCoord");
	// gl.enableVertexAttribArray(texcoordPtr);
	// //Especifica a cÃ³pia dos valores do buffer para o atributo
	// gl.setAttributePointer(texcoordPtr, 
	// 						2,        //quantidade de dados em cada processamento
	// 						gl.FLOAT, //tipo de cada dado (tamanho)
	// 						false,    //nÃ£o normalizar
	// 						5*4,      //tamanho do bloco de dados a processar em cada passo
	// 									//0 indica que o tamanho do bloco Ã© igual a tamanho
	// 									//lido (2 floats, ou seja, 2*4 bytes = 8 bytes)
	// 						3*4       //salto inicial (em bytes)
	// 						);
							
	//submeter textura para gpu
	var tex0 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, tex0);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);        
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, teximg[0]);
	
	var tex1 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, tex1);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);        
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, teximg[1]);
	
	dfPtr = gl.getUniformLocation(prog, "df");
	gl.uniform1f(dfPtr, df);
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

function square_with_text() {
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


function draw()
{
        var matrotZ = [Math.cos(angle*Math.PI/180.0), -Math.sin(angle*Math.PI/180.0), 0.0, 0.0, 
                       Math.sin(angle*Math.PI/180.0),  Math.cos(angle*Math.PI/180.0), 0.0, 0.0,
                       0.0,    0.0,   1.0, 0.0,
                       0.0,    0.0,   0.0, 1.0];
                      
        var matrotY = [Math.cos(angle*Math.PI/180.0), 0.0, -Math.sin(angle*Math.PI/180.0), 0.0, 
                       0.0, 1.0, 0.0, 0.0,
                       Math.sin(angle*Math.PI/180.0),  0.0, Math.cos(angle*Math.PI/180.0), 0.0,
                       0.0,    0.0,   0.0, 1.0];
                      
        var matrotX = [ 1.0, 0.0, 0.0, 0.0,
        			    0.0, Math.cos(angle*Math.PI/180.0), -Math.sin(angle*Math.PI/180.0), 0.0, 
                        0.0, Math.sin(angle*Math.PI/180.0),  Math.cos(angle*Math.PI/180.0), 0.0,
                        0.0,    0.0,   0.0 ,1.0];                               
                      
        transfPtr = gl.getUniformLocation(prog, "transf");
        gl.uniformMatrix4fv(transfPtr, false, matrotX);
        
        
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
        
        //desenha triÃ¢ngulos - executa shaders
        var texPtr = gl.getUniformLocation(prog, "tex");
        gl.uniform1i(texPtr, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.drawArrays(gl.TRIANGLES, 2, 3);
        
        gl.uniform1i(texPtr, 1);
        gl.drawArrays(gl.TRIANGLES, 5, 3);
        gl.drawArrays(gl.TRIANGLES, 7, 3);
        
        gl.uniform1i(texPtr, 0);
        gl.drawArrays(gl.TRIANGLES, 10, 3);
        gl.uniform1i(texPtr, 1);
        gl.drawArrays(gl.TRIANGLES, 12, 3);
        
        
        
        angle++;
	    
	    requestAnimationFrame(draw);
}



// function init() {

// 	/** @type {HTMLCanvasElement} */
// 	var canvas = document.getElementById("glcanvas1");
// 	var gl = getGL(canvas);
// 	var prog = getProgram(gl)

// 	gl.useProgram(prog);

// 	initScreen(gl)

// 	//Define coordenadas dos triângulos
// 	var coordTriangles = square()

// 	//Cria buffer na GPU e copia coordenadas para ele
// 	var bufPtr = gl.createBuffer();
// 	gl.bindBuffer(gl.ARRAY_BUFFER, bufPtr);
// 	gl.bufferData(gl.ARRAY_BUFFER, coordTriangles, gl.STATIC_DRAW);

// 	//Pega ponteiro para o atributo "position" do vertex shader

// 	setAttributePointer(gl, prog, "position", 2, 6, 0)
// 	setAttributePointer(gl, prog, "color", 4, 6, 2)

// 	gl.clear(gl.COLOR_BUFFER_BIT);
// 	draw_square(gl)
// }