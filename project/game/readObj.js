/**
 * Ler um arquivo `.obj`
 * @param {string} filePath 
 * @returns 
 */
function readObjFile(filePath) {
    return new Promise((resolve, reject) => {
        fetch(filePath)
            .then((r) => r.text())
            .then((content) => {
                const lines = content.split('\n');
                const vertices = [];
                const faces = [];

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim().split(' ');
                    const type = line.shift();

                    switch (type) {
                        case "v":
                            vertices.push(parseFloat(line[0])) //x
                            vertices.push(parseFloat(line[1])) //y
                            vertices.push(parseFloat(line[2])) //z
                            vertices.push(parseFloat(line[3])) //tx
                            vertices.push(parseFloat(line[4])) //ty
                            break;
                        case "f":
                            const face = line.map((vertice) => {
                                const [index, , normal] = vertice.split('/');
                                return { index: parseInt(index) - 1, normal: parseInt(normal) - 1 };
                            });
                            faces.push(face);
                            break;
                        default:
                            break;
                    }

                }

                resolve(vertices);
                return vertices
            })
            .catch((erro) => {
                reject(erro);
            });
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