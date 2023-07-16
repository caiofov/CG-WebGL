const SCENARIO_DEFAULTS = {
    /**Z mínimo do cenário - onde os trens spawnam */
    minZ: 0,
    middleZ: 20,
    /**Z máximo do cenário - onde os trens somem */
    maxZ: 45
}

/**
 * Retorna um objeto no formato dos elementos do cenário
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @param {number} w 
 * @param {number} h 
 * @param {number} d 
 * @returns {{shape:Float32Array normals:Float32Array vPosition:{start:number end:number} texture:number|undefined}}
 */
function newScenarioElement(x, y, z, w, h, d) {
    return {
        shape: parallelepiped([x, y, z], w, h, d),
        normals: parallelepipedNormals(),
        vPosition: { start: 0, end: 0 },
        texture: undefined //não pode inicializar a textura aqui porque elas ainda não foram carregadas
    }
}

/**
 * Retorna um objeto no formato da parece do cenário
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @returns {{shape:Float32Array normals:Float32Array vPosition:{start:number end:number} texture:number|undefined}}
 */
function newWall(x, y, z) {
    return newScenarioElement(x, y, z, 3.1, 3.0, 45)
}

//Paredes
const wallLeft = newWall(4.9, 2.5, 0.0)
const wallRight = newWall(-0.8, 2.5, 0.0)
const walls = [wallLeft, wallRight]
//trilho
const rail = newScenarioElement(1.8, -0.5, 0.0, 2.7, 0.1, 45)
//tunel
const tunnel = newScenarioElement(2, 3, 0.0, 3, 4.5, 4)

const scenarioElements = [rail, ...walls, tunnel]

/**Inicializa os vértices e as texturas de todos os elementos do cenário */
function initScenario() {
    //inicializa o trilho
    rail.vPosition = addVertices(rail.shape, rail.normals)
    rail.texture = TEXTURES.rail[1]

    tunnel.vPosition = addVertices(tunnel.shape, tunnel.normals)
    tunnel.texture = TEXTURES.tunnel[1]

    //inicializa as paredes do mapa
    for (const wall of walls) {
        wall.vPosition = addVertices(wall.shape, wall.normals)
        wall.texture = TEXTURES.campo1[1]
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