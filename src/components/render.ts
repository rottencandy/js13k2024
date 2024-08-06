import { CTX } from "../core/canvas"

type RenderFunc = (ctx: CTX, width: number, height: number) => void

export const CompRender: RenderFunc[] = []

export const CompRenderRun: RenderFunc = (
    ctx: CTX,
    width: number,
    height: number,
) => {
    ctx.clearRect(0, 0, width, height)
    for (let i = 0; i < CompRender.length; i++) {
        CompRender[i](ctx, width, height)
    }
}
