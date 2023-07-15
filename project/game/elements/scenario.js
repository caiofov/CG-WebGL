const SCENARIO_DEFAULTS = {
    /**Z mínimo do cenário - onde os trens spawnam */
    minZ: 0,
    middleZ: 20,
    /**Z máximo do cenário - onde os trens somem */
    maxZ: 45
}


const rail1 = {
    shape: parallelepiped([1.8, -0.5, 0.0], 0.9, 0.1, 45),
    vPosition: { start: 0, end: 0 },
    texture: []
}
const rail2 = {
    shape: parallelepiped([1, -0.5, 0.0], 0.9, 0.1, 45),
    vPosition: { start: 0, end: 0 },
    texture: []
}
const rail3 = {
    shape: parallelepiped([0.1, -0.5, 0.0], 0.9, 0.1, 45),
    vPosition: { start: 0, end: 0 },
    texture: []
}

const wallLeft = {
    shape: parallelepiped([4.9, 2.5, 0.0], 3.1, 3.0, 45),
    vPosition: { start: 0, end: 0 },
    texture: []

}

const wallRight = {
    shape: parallelepiped([-0.8, 2.5, 0.0], 3.1, 3.0, 45),
    vPosition: { start: 0, end: 0 },
    texture: []
}

const rails = [rail1, rail2, rail3]
const walls = [wallLeft, wallRight]
const scenarioElements = [...rails, ...walls]

function initScenario() {
    //inicializa os trilhos
    for (const rail of rails) {
        rail.vPosition = addVertices(rail.shape)
        rail.texture = [[rail.vPosition.start, TEXTURES.rail[1]]]
    }
    //inicializa as paredes do mapa
    for (const wall of walls) {
        wall.vPosition = addVertices(wall.shape)
        wall.texture = [[wall.vPosition.start, TEXTURES.campo1[1]]]
    }

}

/**
 * Desenha cada elemento do cenário
 */
function drawScenario() {
    for (const element of scenarioElements) {
        drawInterval(element.vPosition.start, element.vPosition.end, element.texture)
    }
}

/**Retorna todos os vértices para carregar na cena */
function getAllShapes() {
    return Float32Array.of(
        ...getAllTrainShapes(), // Trens
        ...player.shape, // Personagem

    )
}