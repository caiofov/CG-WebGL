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
                const faces = []
                const lines = content.split('\n') //separa o conteúdo em linhas
                for (const line of lines) {
                    if (line.startsWith("#")) continue
                    const vs = line.trim().split(' ');
                    const type = vs.shift()

                    switch (type) { // vê o tipo do primeiro elemento da linha
                        case "v": //vértices
                            console.log(vs)
                            for (const v of vs) vertices.push(parseFloat(v))

                            vertices.push(0.0)
                            vertices.push(1.0)
                            console.log(vertices)
                            break;

                        case "f": //faces
                            for (const l of vs) {
                                let li = parseInt(l) - 1
                                for (let i = 0; i < 5; i++) faces.push(vertices[li * 5 + i])
                            }
                            break
                        default:
                            break;
                    }
                }
                resolve(faces);
                return faces
            })


    })
}