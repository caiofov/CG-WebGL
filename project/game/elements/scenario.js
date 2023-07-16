const SCENARIO_DEFAULTS = {
    /**Z mínimo do cenário - onde os trens spawnam */
    minZ: 0,
    middleZ: 20,
    /**Z máximo do cenário - onde os trens somem */
    maxZ: 45
}


const rail1 = {
    shape: parallelepiped([1.8, -0.5, 0.0], 0.9, 0.1, 45),
    normals: parallelepipedNormals(),
    vPosition: { start: 0, end: 0 },
    texture: []
}
const rail2 = {
    shape: parallelepiped([1, -0.5, 0.0], 0.9, 0.1, 45),
    normals: parallelepipedNormals(),
    vPosition: { start: 0, end: 0 },
    texture: []
}
const rail3 = {
    shape: parallelepiped([1.8, -0.5, 0.0], 2.7, 0.1, 45),
    normals: parallelepipedNormals(),
    vPosition: { start: 0, end: 0 },
    texture: []
}

const wallLeft = {
    shape: parallelepiped([4.9, 2.5, 0.0], 3.1, 3.0, 45),
    normals: parallelepipedNormals(),
    vPosition: { start: 0, end: 0 },
    texture: []

}

const wallRight = {
    shape: parallelepiped([-0.8, 2.5, 0.0], 3.1, 3.0, 45),
    normals: parallelepipedNormals(),
    vPosition: { start: 0, end: 0 },
    texture: []
}

const tunnel = {
    shape: parallelepiped([2, 3, 0.0], 3, 4.5, 4),
    normals: parallelepipedNormals(),
    vPosition: { start: 0, end: 0 },
    texture: []

}

const rails = [rail3]
const walls = [wallLeft, wallRight]
const tunnel_ = [tunnel]
const scenarioElements = [...rails, ...walls, ...tunnel_]

function initScenario() {
    //inicializa os trilhos
    for (const rail of rails) {
        rail.vPosition = addVertices(rail.shape, rail.normals)
        rail.texture = TEXTURES.rail[1]
    }
    //inicializa as paredes do mapa
    for (const wall of walls) {
        wall.vPosition = addVertices(wall.shape, wall.normals)
        wall.texture = TEXTURES.campo1[1]
    }
    for (const t of tunnel_) {
        t.vPosition = addVertices(t.shape, t.normals)
        t.texture = [[t.vPosition.start, TEXTURES.tunnel[1]]]
    }

}

/**
 * Desenha cada elemento do cenário
 */
function drawScenario() {
    for (const element of scenarioElements) {
        setTexture(element.texture)
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