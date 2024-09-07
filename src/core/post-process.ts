import { resize } from "./canvas"
import {
    GL_ARRAY_BUFFER,
    GL_BLEND,
    GL_COLOR_BUFFER_BIT,
    GL_FLOAT,
    GL_FRAGMENT_SHADER,
    GL_LINK_STATUS,
    GL_NEAREST,
    GL_ONE_MINUS_SRC_ALPHA,
    GL_RGBA,
    GL_SRC_ALPHA,
    GL_STATIC_DRAW,
    GL_TEXTURE_2D,
    GL_TEXTURE_MAG_FILTER,
    GL_TEXTURE_MIN_FILTER,
    GL_TRIANGLES,
    GL_UNSIGNED_BYTE,
    GL_VERTEX_SHADER,
} from "./gl-constants"

// source: https://www.shadertoy.com/view/WsVSzV

const WARP = 0.25
const SCAN = 0.25
const SCANLINE_RES = 720

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
    "vec2 uv = vTex;"+
    "vec2 dc = abs(0.5-uv);"+
    "dc *= dc;"+

    "uv.x -= 0.5; uv.x *= 1.0+(dc.y*(0.3*"+WARP+")); uv.x += 0.5;"+
    "uv.y -= 0.5; uv.y *= 1.0+(dc.x*(0.4*"+WARP+")); uv.y += 0.5;"+

    "if(uv.y > 1.0 || uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0)"+
        "outColor = vec4(0.0,0.0,0.0,1.0);"+
    "else{"+
        "float apply = abs(sin(vTex.y*"+SCANLINE_RES+".)*0.5*"+SCAN+");"+
        "outColor = vec4(mix(texture(uTex,uv).rgb,vec3(0.0),apply),1.0);"+
    "}"+

    //"outColor = texture(uTex, vTex);"+
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
    gl.enable(GL_BLEND)
    gl.blendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)

    const vao = gl.createVertexArray()!
    const buf = gl.createBuffer()!
    const tex = gl.createTexture()!
    const prg = gl.createProgram()!
    const vert = gl.createShader(GL_VERTEX_SHADER)!
    const frag = gl.createShader(GL_FRAGMENT_SHADER)!

    gl.shaderSource(vert, vertShader)
    gl.shaderSource(frag, fragShader)
    gl.compileShader(vert)
    gl.compileShader(frag)
    gl.attachShader(prg, vert)
    gl.attachShader(prg, frag)
    gl.linkProgram(prg)
    if (!gl.getProgramParameter(prg, GL_LINK_STATUS)) {
        console.error("Failed: " + gl.getProgramInfoLog(prg))
        console.error("Vert: " + gl.getShaderInfoLog(vert))
        console.error("Frag: " + gl.getShaderInfoLog(frag))
    }
    gl.useProgram(prg)

    gl.bindVertexArray(vao)
    gl.enableVertexAttribArray(0)
    gl.bindBuffer(GL_ARRAY_BUFFER, buf)
    gl.bufferData(
        GL_ARRAY_BUFFER,
        // prettier-ignore
        new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            0, 0,
            1, 1,
            0, 1,
        ]),
        GL_STATIC_DRAW,
    )
    gl.vertexAttribPointer(0, 2, GL_FLOAT, false, 0, 0)

    gl.bindTexture(GL_TEXTURE_2D, tex)
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST)
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST)

    return (ctx: CanvasRenderingContext2D) => {
        gl.texImage2D(
            GL_TEXTURE_2D,
            0,
            GL_RGBA,
            GL_RGBA,
            GL_UNSIGNED_BYTE,
            ctx.canvas,
        )
        gl.clearColor(0.3, 0.3, 0.3, 1)
        gl.clear(GL_COLOR_BUFFER_BIT)
        gl.drawArrays(GL_TRIANGLES, 0, 6)
    }
}
