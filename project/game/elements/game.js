const GAME = {
    scores: 0,
    isRunning: false
}


/**@type {HTMLParagraphElement} */
const scoreboard = document.querySelector("#scoreboard")
/**@type {HTMLDivElement} */
const GAME_OVER_MESSAGE = document.querySelector("#game-over-overlay")

/**Atualiza a pontuação */
function score() {
    GAME.scores += 1
    scoreboard.innerHTML = GAME.scores
}

/** Exibe mensagem de game over e para de rodar a animação */
function gameOver() {
    GAME_OVER_MESSAGE.className = GAME_OVER_MESSAGE.className.replace("d-none", "d-flex")
    GAME.isRunning = false

    /**@type {HTMLDivElement} */
    const overlay = document.querySelector("#overlay")
    overlay.className = overlay.className.replace("d-none", "d-flex")

    // var loseContextExtension = gl.getExtension('WEBGL_lose_context');
    // if (loseContextExtension) {
    //     loseContextExtension.loseContext();
    // }
}