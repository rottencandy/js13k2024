import { Assets } from "src/asset"
import { HEIGHT, WIDTH } from "../const"
import { CTX } from "../core/canvas"

type RenderFunc = (ctx: CTX, assets: Assets) => void
let components: RenderFunc[] = []

export const CompRenderRun = (ctx: CTX, assets: Assets) => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    for (let i = 0; i < components.length; i++) {
        components[i](ctx, assets)
    }
}

export const addRenderComp = (fn: RenderFunc) => {
    components.push(fn)
    return () => {
        components = components.filter((val) => val !== fn)
    }
}
