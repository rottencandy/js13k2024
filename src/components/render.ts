import { clear, CTX } from "../core/canvas"

type RenderFunc = (ctx: CTX, t: number, width: number, height: number) => void

export const CompRender: RenderFunc[] = []

export const CompRenderRun: RenderFunc = (
    ctx: CTX,
    t: number,
    width: number,
    height: number,
) => {
    clear(ctx, width, height)
    for (let i = 0; i < CompRender.length; i++) {
        CompRender[i](ctx, t, width, height)
    }
}
