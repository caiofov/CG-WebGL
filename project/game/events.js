function addListeners() {
    document.addEventListener("keydown", function (event) {
        var key = event.key;
        var z = 0, x = 0

        //movimentar no eixo Z
        if (["w", "W"].includes(key)) z = -1
        else if (["s", "S"].includes(key)) z = 1

        //movimentar no eixo X
        if (["a", "A"].includes(key)) x = -1
        else if (["d", "D"].includes(key)) x = 1
        z1+=0.8*z 
        x1+=0.8*x
        //restriçoes de movimento, casas para mover personagem: 0.0 , 0.8 e 1.6
        x1 = Math.max(0,Math.min(x1,1.6))
        moveCamera([x, 0, z])
    });
}