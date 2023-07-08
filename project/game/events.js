function addListeners() {
    document.addEventListener("keydown", function (event) {
        var key = event.key;
        var z = 0, x = 0
        if (key === "w" || key === "W") z = -1
        else if (key === "s" || key === "S") z = 1

        if (key === "a" || key === "A") x = -1
        else if (key === "d" || key === "D") x = 1

        moveCamera([x, 0, z])
        console.log("pos", camera.pos, "\ntarget", camera.target, "\nup", camera.up)
    });
}