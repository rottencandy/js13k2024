import { $ } from "../core/ui"

export type CTX = CanvasRenderingContext2D

export const createCtx = (
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
): CTX => {
    const ctx = canvas.getContext("2d")!
    resize(canvas, width, height)
    return ctx
}

export const clear = (ctx: CTX, width: number, height: number) =>
    ctx.clearRect(0, 0, width, height)

export const resize = (
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
) => {
    const ratio = Math.min(innerWidth / width, innerHeight / height)
    canvas.width = width
    canvas.height = height
    canvas.style.width = width * ratio + "px"
    canvas.style.height = height * ratio + "px"
}

// Draw a pixel to raw canvas data
const pixel = (
    imgData: ImageData,
    width: number,
    x: number,
    y: number,
    r: number,
    g: number,
    b: number,
    a: number,
) => {
    const index = (x + y * width) * 4

    imgData.data[index + 0] = r
    imgData.data[index + 1] = g
    imgData.data[index + 2] = b
    imgData.data[index + 3] = a
}

/** make offscreen canvas for generating textures */
export const makeCanvasTexture = (width: number, height: number) => {
    const offCanvas = $("canvas", { width, height }) as HTMLCanvasElement
    const oCtx = offCanvas.getContext("2d")!
    clear(oCtx, width, height)
    const imgData = oCtx.getImageData(0, 0, width, height)
    pixel(imgData, width, 0, 0, 255, 0, 0, 255)
    pixel(imgData, width, 1, 0, 0, 255, 0, 255)
    pixel(imgData, width, 0, 1, 0, 0, 255, 255)
    oCtx.putImageData(imgData, 0, 0)
    return offCanvas
}
