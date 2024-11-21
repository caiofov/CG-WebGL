const GAME = {
    scores: 0,
    isRunning: false,
    record: false
}

const RECORD = Number(localStorage.getItem('record')) ?? 0

/**@type {HTMLParagraphElement[]} */
const SCOREBOARD = document.querySelector("#live-scoreboard")
/**@type {HTMLDivElement} */
const GAME_OVER_MESSAGE = document.querySelector("#game-over-overlay")

/**Atualiza a pontuação */
function score() {
    GAME.scores += 1
    if (!GAME.record && GAME.scores > RECORD) {
        GAME.record = true
        document.querySelectorAll(".new-record").forEach(r => r.className = r.className.replace('d-none', 'd-flex'))
    } else if (GAME.record) {
        document.querySelector("#record").innerHTML = GAME.scores
    }
    SCOREBOARD.innerHTML = GAME.scores
}

/** Exibe mensagem de game over e para de rodar a animação */
function gameOver() {
    GAME.isRunning = false
    if (GAME.record) {
        localStorage.setItem('record', GAME.scores)
        document.querySelector("#record").innerHTML = GAME.scores
    }

    document.querySelector("#end-scoreboard").innerHTML = GAME.scores

    document.querySelectorAll(".show-end").forEach(e => e.className = e.className.replace("d-none", "d-flex"))

    // var loseContextExtension = gl.getExtension('WEBGL_lose_context');
    // if (loseContextExtension) {
    //     loseContextExtension.loseContext();
    // }
}