import { CTX } from "../core/canvas"

type RenderFunc = (ctx: CTX, width: number, height: number) => void
let components: RenderFunc[] = []

export const CompRenderRun: RenderFunc = (
    ctx: CTX,
    width: number,
    height: number,
) => {
    ctx.clearRect(0, 0, width, height)
    for (let i = 0; i < components.length; i++) {
        components[i](ctx, width, height)
    }
}

export const addRenderComp = (fn: RenderFunc) => {
    components.push(fn)
    return () => {
        components = components.filter((val) => val !== fn)
    }
}
