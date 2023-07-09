const GAME = {
    scores: 0,
    isRunning: true
}


/**@type {HTMLParagraphElement} */
const scoreboard = document.querySelector("#scoreboard")
/**@type {HTMLParagraphElement} */
const over = document.querySelector("#game-over")

/**Atualiza a pontuação */
function score() {
    GAME.scores += 1
    scoreboard.innerHTML = GAME.scores
}

/** Exibe mensagem de game over e para de rodar a animação */
function gameOver() {
    over.style.display = "block"
    GAME.isRunning = false
    // var loseContextExtension = gl.getExtension('WEBGL_lose_context');
    // if (loseContextExtension) {
    //     loseContextExtension.loseContext();
    // }
}