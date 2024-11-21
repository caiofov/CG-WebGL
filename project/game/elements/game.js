const GAME = {
    scores: 0,
    isRunning: false,
    record: false
}


/**@type {HTMLParagraphElement[]} */
const SCOREBOARD = document.querySelectorAll(".scoreboard")
/**@type {HTMLDivElement} */
const GAME_OVER_MESSAGE = document.querySelector("#game-over-overlay")

/**Atualiza a pontuação */
function score() {
    GAME.scores += 1
    SCOREBOARD.map(p => p.innerHTML = GAME.scores)
}

/** Exibe mensagem de game over e para de rodar a animação */
function gameOver() {
    GAME.isRunning = false
    document.querySelectorAll(".show-end").forEach(e => e.className = e.className.replace("d-none", "d-flex"))

    // var loseContextExtension = gl.getExtension('WEBGL_lose_context');
    // if (loseContextExtension) {
    //     loseContextExtension.loseContext();
    // }
}