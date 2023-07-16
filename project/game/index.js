function configScene() {
    //Cria buffer na GPU e copia coordenadas para ele
    loadNormals()
    loadVertices()

    //submeter textura para gpu
    submitTextures()
}


function draw() {

    //elementos que se movem
    var mproj = createPerspective(10, gl.canvas.width / gl.canvas.height, 1, 50);
    var cam = createCamera()
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    updateTrains(cam, mproj)

    //fica parado, mas rotaciona
    drawCoin(cam, mproj)

    //elementos parados
    var transforma = identityMatrix();
    transforma = math.multiply(cam, transforma);
    transforma = math.multiply(mproj, transforma);
    setTransfproj(transforma)

    drawScenario()


    // Personagem - parado em relação à câmera
    drawPlayer(cam, mproj)

    if (GAME.isRunning) requestAnimationFrame(draw)

}

async function loadAllElements() {
    await initImages()
    await initPlayer()
    await initScenario()
    await initCoin()
}


function init() {
    loadAllElements().then(() => {
        initGL();
        makeTrains();
        configScene();
        draw();
    })

    addListeners()
}