export type CTX = CanvasRenderingContext2D
export type Color = [number, number, number, number]

export const createCtx = (
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
): CTX => {
    const ctx = canvas.getContext("2d")!
    resize(canvas, width, height)
    return ctx
}

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
    col: Color,
) => {
    const index = (x + y * width) * 4
    imgData.data[index + 0] = col[0]
    imgData.data[index + 1] = col[1]
    imgData.data[index + 2] = col[2]
    imgData.data[index + 3] = col[3]
}

export const texture = (
    builder: (ctx: CTX) => void,
    width: number,
    height: number,
) => {
    const tex = document.createElement("canvas")
    tex.width = width
    tex.height = height
    const ctx = tex.getContext("2d")!
    ctx.clearRect(0, 0, width, height)
    builder(ctx)
    return tex
}

export const silhoutte = (ctx: CTX, w: number, h: number) => {
    const data = ctx.getImageData(0, 0, w, h)
    for (let x = 0; x < data.data.length; x += 4) {
        if (data.data[x + 3] > 0) {
            data.data[x + 0] = 150
            data.data[x + 1] = 150
            data.data[x + 2] = 150
            data.data[x + 3] = 255
        }
    }
    ctx.putImageData(data, 0, 0)
}

export const sprite = (spr: number[][], palette: Color[]) => {
    const width = spr[0].length
    const height = spr.length
    return texture(
        (ctx) => {
            const imgData = ctx.getImageData(0, 0, width, height)
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < width; y++) {
                    pixel(imgData, width, x, y, palette[spr[x][y]])
                }
            }
            ctx.putImageData(imgData, 0, 0)
        },
        width,
        height,
    )
}
