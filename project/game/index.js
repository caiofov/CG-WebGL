function configScene() {
    //Cria buffer na GPU e copia coordenadas para ele
    loadVertices(getAllShapes())

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

    if (GAME.isRunning) requestAnimationFrame(draw)

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