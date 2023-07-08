var teximg = [];
var texSrc = ["gato.jpg", "cachorro.png"].map(e => `img/${e}`);
var loadTexs = 0;

const TEXTURES = {
    thomasFace: ["img/thomas_face.png"],
    thomasSide: ["img/thomas_side.png"],
    sticker:["img/stick.png"],
    rail:["img/trilho.jpg"],
    campo1:["img/campo1.jpg"]
}

/**
 * Carrega uma textura específica
 * @param {number} idx índice onde irá guardar a textura na memória
 * @param {string} img path para o arquivo de imagem
 */
function submitTexture(idx, img) {
    var tex0 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + idx);
    gl.bindTexture(gl.TEXTURE_2D, tex0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
}



function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function initImages() {
    let count = 0
    for (const key in TEXTURES) {
        var img = await loadImage(TEXTURES[key][0]);
        TEXTURES[key].push(count)
        TEXTURES[key].push(img)
        count++
    }
}
function submitTextures() {
    for (const key in TEXTURES) {
        submitTexture(TEXTURES[key][1], TEXTURES[key][2])
    }
}