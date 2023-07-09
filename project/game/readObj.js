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
                const lines = content.split('\n')
                for (const line of lines) {
                    const vs = line.trim().split(' ');
                    const type = vs.shift();

                    switch (type) {
                        case "v":
                            for (let i = 0; i < 5; i++) {
                                vertices.push(parseFloat(vs[i]))
                            }
                            break;
                        default:
                            break;
                    }
                }
                resolve(vertices);

                return vertices
            })


    }).catch((erro) => {
        reject(erro);
    });
}



//TESTE
function logShape() {
    let count = 0
    let r = ""
    for (const element of parallelepiped([0.0, 0.0, 0.0], 0.5, 0.5, 1)) {

        count++
        if (count == 6) {
            r += "\nv "
            count = 1
        }
        r += element + ","
    }
    console.log(r)
}