/**
 * Ler um arquivo `.obj`
 * @param {string} filePath Caminho ate o arquivo
 * @returns 
 */
function readObjFile(filePath) {
    return new Promise((resolve) => {
        fetch(filePath)
            .then((r) => r.text())
            .then((content) => {
                const vertices = [];
                const lines = content.split('\n') //separa o conteúdo em linhas
                for (const line of lines) {
                    const vs = line.trim().split(' ');

                    switch (vs.shift()) { // vê se o primeiro elemento é do tipo "v"
                        case "v":
                            for (let i = 0; i < 5; i++) vertices.push(parseFloat(vs[i]))
                            break;
                        default:
                            break;
                    }
                }
                resolve(vertices);

                return vertices
            })


    })
}