# Trabalho 2 - Computação Gráfica

![thumb](img/thumb.png)

Segundo trabalho da disciplina de **Computação Gráfica I** do semestre 2023.2

- Caio de Freitas Oliveira - 501375
- Matheus Ribeiro Alencar - 494711

## Como rodar:

Basta abrir o arquivo `index.html` em um servidor local.

## Sobre o jogo:

Inspirado no famoso _Subway Surfers_, o jogador deverá desviar dos trens para alcançar sua melhor pontuação. Além disso, ele pode também coletar moedas, que adicionarão mais pontos ao seu total.

Caso colida com um trem e queira recomeçar, será necessário recarregar a página.

## Sobre requisitos

- Câmera: A visão é em 3ª pessoa, podendo ser movida com as teclas `WASD`. O personagem do jogador também se move junto à câmera.
- Iluminação: Utilizamos o modelo de reflexão de Phong com luzes ambiente, direcional e especular. A luz da moeda é pontual e se move.
- Transformações: Foram realizadas translações para a moeda, jogador e trens. Além disso, a moeda também rotaciona.
- Todos os objetos tem textura, com exceção do jogador e da moeda, que possuem cor sólida.
- Utilizamos o **WebGL** como foi feito durante as aulas da disciplina. Além disso, também utilizamos a biblioteca **math.js** para realizar operações com matrizes.
- O jogador e a moeda são objetos carregados de OBJ a partir de um leitor implementador por nós.
