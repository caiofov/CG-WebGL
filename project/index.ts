function getGL(canvas: HTMLCanvasElement): WebGLRenderingContext | RenderingContext | false {
    var webgl = canvas.getContext("webgl");
    if (webgl) return webgl;

    var exp_webgl = canvas.getContext("experimental-webgl");
    if (exp_webgl) return exp_webgl;

    alert("Contexto WebGL inexistente! Troque de navegador!");
    return false;
}

function createShader(gl, shaderType, shaderSrc) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSrc);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        return shader;

    alert("Erro de compilação: " + gl.getShaderInfoLog(shader));

    gl.deleteShader(shader);
}

function createProgram(gl, vtxShader, fragShader) {
    var prog = gl.createProgram();
    gl.attachShader(prog, vtxShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);

    if (gl.getProgramParameter(prog, gl.LINK_STATUS))
        return prog;

    alert("Erro de linkagem: " + gl.getProgramInfoLog(prog));

    gl.deleteProgram(prog);
}

function init() {
    var canvas = document.querySelector<HTMLCanvasElement>("#glcanvas1");

    var gl = getGL(canvas);
    if (gl) {
        //Inicializa shaders
        var vtxShSrc = document.querySelector<HTMLScriptElement>("#vertex-shader")?.text;
        var fragShSrc = document.querySelector<HTMLScriptElement>("frag-shader")?.text;

        var vtxShader = createShader(gl, gl.VERTEX_SHADER, vtxShSrc);
        var fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShSrc);
        var prog = createProgram(gl, vtxShader, fragShader);

        gl.useProgram(prog);

        //Define coordenadas dos triângulos
        var coordTriangles = new Float32Array([
            -0.5, 0.0,
            0.5, 0.0,
            0.0, 0.5
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
            0,        //tamanho do bloco de dados a processar em cada passo
            //0 indica que o tamanho do bloco é igual a tamanho
            //lido (2 floats, ou seja, 2*4 bytes = 8 bytes)
            0         //salto inicial (em bytes)
        );

        //Inicializa Ã¡rea de desenho: viewport e cor de limpeza; limpa a tela
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        //desenha triÃ¢ngulos - executa shaders
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

}