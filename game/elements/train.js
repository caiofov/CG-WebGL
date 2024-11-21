const TRAIN_DEFAULTS = {
    width: 0.5,
    height: 0.5,
    depth: 5,
    gap: 0.3,
    speed: 0.1,
    /**@type {number[]} Array de texturas */
    texture: undefined //(não pode ser setado aqui porque as texturas ainda não foram carregadas) 
}
const trains = []
const currentTrains = []


/**
 * Adiciona o trem de número `idx` do array `trains` para o `currentTrains`
 * @param {boolean} force Indica se deve obrigatoriamente gerar um trem
 * @returns {boolean} Se foi adicionado com sucesso ou não
 */
function addNewTrain(force) {
    if (currentTrains.length >= 2) { return true } // não deixa todas os trilhos ficarem ocupados (no máximo 2 por vez)

    idx = force ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 4) - 1

    if (idx > -1) {
        currentTrains.push({ ...trains[idx] })
        return true
    }
    return false
}

/**
 * Gera a estrutura do trem para o índice dado
 * @param {number} num Número do trem (0 a 2)
 */
function makeTrain(num) {
    const x = num * (TRAIN_DEFAULTS.width + TRAIN_DEFAULTS.gap)
    return {
        x, z: SCENARIO_DEFAULTS.minZ,
        shape: parallelepiped(
            [x, 0, 0],
            TRAIN_DEFAULTS.width,
            TRAIN_DEFAULTS.height,
            TRAIN_DEFAULTS.depth),
        normals: parallelepipedNormals(),
        idx: num,
        vPosition: { start: 0, end: 0 },
        texture: []
    }
}

/** Inicializa todos os trens */
function makeTrains() {
    for (let i = 0; i < 3; i++) {
        const t = makeTrain(i)
        t.vPosition = addVertices(t.shape, t.normals)
        t.texture = {
            side: TEXTURES.thomasSide[1], face: TEXTURES.thomasFace[1], ceil: TEXTURES.thomasCeil[1]
        }
        trains.push(t)
    }

    addNewTrain(true)
}

/** Retorna todos os vértices de todos os trens */
function getAllTrainShapes() {
    return [...trains[0].shape, ...trains[1].shape, ...trains[2].shape]
}

/**
 * Desenha o trem em sua posição atual
 * @param {*} cam Matriz da câmera
 * @param {*} mproj Matriz da perspectiva
 * @param {*} train Trem que será desenhado
 */
function drawTrain(cam, mproj, train) {
    var m = translationMatrix(0, 0, train.z)
    var transforma = math.multiply(cam, m);
    transforma = math.multiply(mproj, transforma);

    setTransfproj(transforma)

    setTexture(train.texture.face)
    drawInterval(train.vPosition.start, train.vPosition.start + 4)

    setTexture(train.texture.ceil)
    drawInterval(train.vPosition.start + 6, train.vPosition.start + 11)

    setTexture(train.texture.side)
    drawInterval(train.vPosition.start + 12, train.vPosition.end)

}

/**
 * Movimenta o trem (checa colisões e limites de mapa)
 * @param {*} train 
 */
function moveTrain(train) {
    train.z += TRAIN_DEFAULTS.speed

    //checar colisão com o jogador
    if (playerCollided(train, TRAIN_DEFAULTS.depth)) {
        gameOver()
        return
    }

    // caso o Z seja maior do que o meio do cenário, tentar gerar mais um trem. Isso só pode ocorrer uma vez para cada trem
    if (train.z > SCENARIO_DEFAULTS.middleZ && !train.middleAdded) {
        train.middleAdded = true //garante que não vai ser mais gerado trens para este trem
        addNewTrain(false)
    }
    // caso o Z seja maior do que o limite do cenário, descartar o trem e gerar um novo
    else if (train.z > SCENARIO_DEFAULTS.maxZ) {
        train.z = 0
        currentTrains.splice(currentTrains.indexOf(train), 1) //descarta o trem
        score() // jogador fez ponto
        TRAIN_DEFAULTS.speed += 0.01
        addNewTrain(true) //adiciona um trem novo
    }
}

/**
 * Atualiza a posição dos trens e os desenha
 * @param {*} cam 
 * @param {*} mproj 
 */
function updateTrains(cam, mproj) {
    for (const train of currentTrains) {
        moveTrain(train)
        drawTrain(cam, mproj, train)
    }
}