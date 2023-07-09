const TRAIN_DEFAULTS = {
    width: 0.5,
    height: 0.5,
    depth: 5,
    gap: 0.3,
    speed: 0.1,
    /**@type {number[]} Array de texturas */
    texture: undefined //(não pode ser setado aqui porque as texturas ainda não foram carregadas) 
}
var trains = []
var currentTrains = []


/**
 * Adiciona o trem de número `idx` do array `trains` para o `currentTrains`
 * @param {number} idx Número do trem (0 a 2)
 * @returns {boolean} Se foi adicionado com sucesso ou não
 */
function addNewTrain(idx) {
    if (currentTrains.length >= 2) { return true } // não deixa todas os trilhos ficarem ocupados (no máximo 2 por vêz)
    idx = idx || Math.floor(Math.random() * 4) - 1
    if (idx > -1) {
        currentTrains.push({ ...trains[idx] })
        return true
    }
    return false
}

/**
 * Só para quando adicionar um trem //TODO: Não utilizado o loop, implementar isso na função addNewTrain
 */
function forceAddNewTrain() {
    while (!addNewTrain()) { }
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
        idx: num
    }
}

/** Inicializa todos os trens */
function makeTrains() {
    TRAIN_DEFAULTS.texture = [TEXTURES.thomasSide, TEXTURES.thomasFace, TEXTURES.thomasSide].map(t => t[1])
    for (let i = 0; i < 3; i++) {
        trains.push(makeTrain(i))
    }
    forceAddNewTrain()
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
    setTransf(transforma)

    drawHexahedron(train.idx * 30, TRAIN_DEFAULTS.texture)
}

/**
 * Movimenta o trem (checa colisões e limites de mapa)
 * @param {*} train 
 */
function moveTrain(train) {
    train.z += TRAIN_DEFAULTS.speed

    //checar colisão com o jogador
    if (playerCollided(train)) {
        gameOver()
        return
    }

    // caso o Z seja maior do que o meio do cenário, tentar gerar mais um trem. Isso só pode ocorrer uma vez para cada trem
    if (train.z > SCENARIO_DEFAULTS.middleZ && !train.middleAdded) {
        train.middleAdded = true //garante que não vai ser mais gerado trens para este trem
        addNewTrain()
    }
    // caso o Z seja maior do que o limite do cenário, descartar o trem e gerar um novo
    else if (train.z > SCENARIO_DEFAULTS.maxZ) {
        train.z = 0
        currentTrains.splice(currentTrains.indexOf(train), 1)
        score()
        forceAddNewTrain()
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