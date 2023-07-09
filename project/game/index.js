function configScene() {
    //Define coordenadas dos triângulos
    var coordTriangles = Float32Array.of(
        // Trens
        ...getAllTrainShapes(),

        // Personagem
        ...player.shape,

        // Cenario(Trilhos)
        ...parallelepiped([1.8, -0.5, 0.0], 0.9, 0.1, 45),
        ...parallelepiped([1, -0.5, 0.0], 0.9, 0.1, 45),
        ...parallelepiped([0.1, -0.5, 0.0], 0.9, 0.1, 45),

        // Cenario(esquerda e direita)
        ...parallelepiped([4.9, 2.5, 0.0], 3.1, 3.0, 45),
        ...parallelepiped([-0.8, 2.5, 0.0], 3.1, 3.0, 45));

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
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    updateTrains(cam, mproj)

    var transforma = identityMatrix();
    transforma = math.multiply(cam, transforma);
    transforma = math.multiply(mproj, transforma);
    setTransf(transforma)


    // Trilhos
    drawHexahedron(120, [TEXTURES.rail[1]])
    drawHexahedron(150, [TEXTURES.rail[1]])
    drawHexahedron(180, [TEXTURES.rail[1]])

    //Cenário
    drawHexahedron(210, [TEXTURES.campo1[1]])
    drawHexahedron(240, [TEXTURES.campo1[1]])


    // Personagem - parado em relação à câmera
    drawPlayer(cam, mproj)

    if (IS_RUNNING) requestAnimationFrame(draw)

}

async function loadAllElements() {
    await initImages()
    await initPlayer()
}


function init() {
    loadAllElements().then(() => {
        initGL();
        makeTrains()
        configScene();
        draw();
    })


    addListeners()
}