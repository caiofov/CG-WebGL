// import { createCamera, createPerspective } from "./camera";
var teximg = [];
var texSrc = ["gato.jpg", "cachorro.png"].map(e => `img/${e}`);
var loadTexs = 0;

/** Ângulo de rotação*/
var angle = 0;

/** @type {WebGLRenderingContext}*/
var gl;
/** @type {WebGLProgram}*/
var prog;



function loadTextures() {
    if (loadTexs == texSrc.length) {
        initGL();
        configScene();
        draw();
    }
}


function configScene() {
    //Define coordenadas dos triângulos
    var coordTriangles = box()

    //Cria buffer na GPU e copia coordenadas para ele
    var bufPtr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufPtr);
    gl.bufferData(gl.ARRAY_BUFFER, coordTriangles, gl.STATIC_DRAW);

    setAttributePointer("position", 3, 5, 0)
    setAttributePointer("texCoord", 2, 5, 3)

    //submeter textura para gpu
    submitTexture(0, teximg[0])
    submitTexture(1, teximg[1])

}


function draw() {
    var mproj = createPerspective(10, gl.canvas.width / gl.canvas.height, 1, 50);
    var cam = createCamera()
    //translacao em z
    var tz = math.matrix(
        [[1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, -5.0],
        [0.0, 0.0, 0.0, 1.0]]);


    var transforma = math.multiply(matrotY(angle), matrotX(angle));// Multiplicaçao de matr não é comutativa
    transforma = math.multiply(matrotZ(angle), transforma);
    transforma = math.multiply(cam, transforma);
    transforma = math.multiply(mproj, transforma);

    transforma = math.flatten(math.transpose(transforma))._data; //webGL multiplica por colunas (transpose necessario)

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

    angle += 0.1;

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
    addListeners()
}