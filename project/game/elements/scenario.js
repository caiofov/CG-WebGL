const SCENARIO_DEFAULTS = {
    /**Z mínimo do cenário - onde os trens spawnam */
    minZ: 0,
    middleZ: 20,
    /**Z máximo do cenário - onde os trens somem */
    maxZ: 45
}

/**Retorna todos os vértices para carregar na cena */
function getAllShapes() {
    return Float32Array.of(
        ...getAllTrainShapes(), // Trens
        ...player.shape, // Personagem

        // Cenario(Trilhos)
        ...parallelepiped([1.8, -0.5, 0.0], 0.9, 0.1, 45),
        ...parallelepiped([1, -0.5, 0.0], 0.9, 0.1, 45),
        ...parallelepiped([0.1, -0.5, 0.0], 0.9, 0.1, 45),

        // Cenario(esquerda e direita)
        ...parallelepiped([4.9, 2.5, 0.0], 3.1, 3.0, 45),
        ...parallelepiped([-0.8, 2.5, 0.0], 3.1, 3.0, 45));
}