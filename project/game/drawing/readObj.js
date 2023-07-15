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
                const textures = []
                const lines = content.split('\n') //separa o conteúdo em linhas
                for (const line of lines) {
                    if (line.startsWith("#")) continue
                    const vs = line.trim().split(' ');
                    const type = vs.shift()

                    switch (type) { // vê o tipo do primeiro elemento da linha
                        case "v": //vértices
                            const vertx = []
                            for (const v of vs) vertx.push(parseFloat(v))
                            vertices.push(vertx)
                            break;

                        case "vt": //textura
                            textures.push([parseFloat(vs[0]), parseFloat(vs[1])])
                            break

                        case "f": //faces
                            for (const l of vs) {
                                let li = parseInt(l) - 1
                                for (const v of vertices[li]) faces.push(v)
                                for (const t of textures[li]) faces.push(t)
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