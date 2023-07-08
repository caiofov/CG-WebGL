/** Ângulo de rotação*/
var angle = 0;

/** @type {WebGLRenderingContext}*/
var gl;
/** @type {WebGLProgram}*/
var prog;

var player = {
    x: 0,
    z: 0
}

function configScene() {
    //Define coordenadas dos triângulos
    var coordTriangles = Float32Array.of(
        ...parallelepiped([0, 0, 0], 0.5, 0.5, 1),
        ...parallelepiped([0.8, 0, 0], 0.5, 0.5, 1),
        ...parallelepiped([1.6, 0, 0], 0.5, 0.5, 1),
        ...parallelepiped([0.0, 0.0, 0.0], 0.5, 0.5, 1));

    //Cria buffer na GPU e copia coordenadas para ele
    var bufPtr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufPtr);
    gl.bufferData(gl.ARRAY_BUFFER, coordTriangles, gl.STATIC_DRAW);

    setAttributePointer("position", 3, 5, 0)
    setAttributePointer("texCoord", 2, 5, 3)

    //submeter textura para gpu
    submitTextures()
}


function draw() {
    var mproj = createPerspective(10, gl.canvas.width / gl.canvas.height, 1, 50);
    var cam = createCamera()

    //translaçao em x e z para manter o objeto estático
    var txz = math.matrix(
        [[1.0, 0.0, 0.0, player.x],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, player.z],
        [0.0, 0.0, 0.0, 1.0]]);

    //trens
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var transforma = math.multiply(matrotY(angle), matrotX(angle));// Multiplicaçao de matr não é comutativa
    transforma = math.multiply(matrotZ(angle), transforma);
    transforma = math.multiply(cam, transforma);
    transforma = math.multiply(mproj, transforma);

    transforma = math.flatten(math.transpose(transforma))._data; //webGL multiplica por colunas (transpose necessario)

    transfPtr = gl.getUniformLocation(prog, "transf");
    gl.uniformMatrix4fv(transfPtr, false, transforma);

    drawHexahedron(0, [1, 0, 1])
    drawHexahedron(30, [1, 0, 1])
    drawHexahedron(60, [1, 0, 1])



    //personagem 
    var transforma2 = math.multiply(cam, txz);
    transforma2 = math.multiply(mproj, transforma2);
    transforma2 = math.flatten(math.transpose(transforma2))._data;
    transf2Ptr = gl.getUniformLocation(prog, "transf");
    gl.uniformMatrix4fv(transf2Ptr, false, transforma2);
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawHexahedron(90, [2])


    // angle += 0.1;

    requestAnimationFrame(draw);
}


function init() {
    initImages().then(() => {
        initGL();
        configScene();
        draw();
    })
    addListeners()
}