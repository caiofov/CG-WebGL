const GAME = {
    scores: 0,
    isRunning: false
}


/**@type {HTMLParagraphElement} */
const scoreboard = document.querySelector("#scoreboard")
/**@type {HTMLDivElement} */
const GAME_OVER_MESSAGE = document.querySelector("#game-over")

/**Atualiza a pontuação */
function score() {
    GAME.scores += 1
    scoreboard.innerHTML = GAME.scores
}

/** Exibe mensagem de game over e para de rodar a animação */
function gameOver() {
    GAME_OVER_MESSAGE.className = GAME_OVER_MESSAGE.className.replace("d-none", "d-block")
    GAME.isRunning = false

    // var loseContextExtension = gl.getExtension('WEBGL_lose_context');
    // if (loseContextExtension) {
    //     loseContextExtension.loseContext();
    // }
}