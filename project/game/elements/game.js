var SCORES = 0
const scoreboard = document.querySelector("#scoreboard")

/**Atualiza a pontuação */
function score() {
    SCORES += 1
    scoreboard.innerHTML = SCORES
}