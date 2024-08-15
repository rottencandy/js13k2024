import { resize } from "./canvas"
import { addRenderComp, } from "../components/render"

// prettier-ignore
const vertShader = `#version 300 es
precision lowp float;`+
"layout(location=0)in vec2 aPos;"+
"out vec2 vTex;"+

"void main() {"+
    "vec2 vwPos = aPos * 2. - 1.;"+
    "vTex = vec2(aPos.x, 1. - aPos.y);"+
    "gl_Position = vec4(vwPos, 0., 1.);"+
"}"

// prettier-ignore
const fragShader = `#version 300 es
precision lowp float;`+
"in vec2 vTex;"+
"out vec4 outColor;"+
"uniform sampler2D uTex;"+

"void main() {"+
    "outColor = texture(uTex, vTex);"+
"}"

export const setupPostProcess = (
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
) => {
    const gl = canvas.getContext("webgl2")!
    resize(canvas, width, height)
    canvas.width = width
    canvas.height = height
    gl.viewport(0, 0, width, height)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const vao = gl.createVertexArray()!
    const buf = gl.createBuffer()!
    const tex = gl.createTexture()!
    const prg = gl.createProgram()!
    const vert = gl.createShader(gl.VERTEX_SHADER)!
    const frag = gl.createShader(gl.FRAGMENT_SHADER)!

    gl.shaderSource(vert, vertShader)
    gl.shaderSource(frag, fragShader)
    gl.compileShader(vert)
    gl.compileShader(frag)
    gl.attachShader(prg, vert)
    gl.attachShader(prg, frag)
    gl.linkProgram(prg)
    if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
        console.error("Failed: " + gl.getProgramInfoLog(prg))
        console.error("Vert: " + gl.getShaderInfoLog(vert))
        console.error("Frag: " + gl.getShaderInfoLog(frag))
    }
    gl.useProgram(prg)

    gl.bindVertexArray(vao)
    gl.enableVertexAttribArray(0)
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
        gl.ARRAY_BUFFER,
        // prettier-ignore
        new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            0, 0,
            1, 1,
            0, 1,
        ]),
        gl.STATIC_DRAW,
    )
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)

    addRenderComp((ctx) => {
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            ctx.canvas,
        )
        gl.clearColor(1, 1, 1, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    })
}
