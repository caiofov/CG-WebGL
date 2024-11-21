/**
 * Ler um arquivo `.obj`
 * @param {string} filePath Caminho ate o arquivo
 * @returns {PromiseLike<{faces: number[];normals: number[];}>}
 */
function readObjFile(filePath) {
    return fetch(filePath)
        .then((r) => r.text())
        .then((content) => {
            const vertices = [];
            const faces = []
            const textures = []
            const normals = []

            content = content.replace('//', ' ')
            for (const line of content.split('\n')) { //separa o conteúdo em linhas
                if (line.startsWith("#")) continue //comentários
                const vs = line.replace('//', ' ').replace("/", " ").trim().split(' ');
                const type = vs.shift()

                switch (type) { // vê o tipo do primeiro elemento da linha
                    case "v": //vértices
                        const vertx = []
                        for (const v of vs) vertx.push(parseFloat(v))
                        vertices.push(vertx)
                        break;

                    case "vn": //normal:
                        for (const n of vs) normals.push(parseFloat(n))
                        break

                    case "vt": //textura
                        textures.push([parseFloat(vs[0]), parseFloat(vs[1])])
                        break

                    case "f": //faces
                        for (const l of vs) {
                            let li = parseInt(l) - 1
                            if (vertices[li]) for (const v of vertices[li]) faces.push(v)
                            if (textures[li]) for (const t of textures[li]) faces.push(t)
                        }
                        break
                    default:
                        break;
                }
            }

            return { faces: faces, normals: normals }
        })



}