import { CTX } from "../core/canvas"
import { type Keys, keys } from "../core/input"

type RenderFunc = (ctx: CTX, width: number, height: number, keys: Keys) => void
let components: RenderFunc[] = []

export const CompRenderRun = (ctx: CTX, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height)
    for (let i = 0; i < components.length; i++) {
        components[i](ctx, width, height, keys)
    }
}

export const addRenderComp = (fn: RenderFunc) => {
    components.push(fn)
    return () => {
        components = components.filter((val) => val !== fn)
    }
}
