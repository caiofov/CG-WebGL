var SCORES = 0
var IS_RUNNING = true
/**@type {HTMLParagraphElement} */
const scoreboard = document.querySelector("#scoreboard")
/**@type {HTMLParagraphElement} */
const over = document.querySelector("#game-over")

/**Atualiza a pontuação */
function score() {
    SCORES += 1
    scoreboard.innerHTML = SCORES
}

/** Exibe mensagem de game over e para de rodar a animação */
function gameOver() {
    over.style.display = "block"
    IS_RUNNING = false
    // var loseContextExtension = gl.getExtension('WEBGL_lose_context');
    // if (loseContextExtension) {
    //     loseContextExtension.loseContext();
    // }
}