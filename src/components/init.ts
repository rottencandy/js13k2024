import { CTX } from "../core/canvas"

export const CompInit: ((ctx: CTX) => void)[] = []

export const CompInitRun = (ctx: CTX) => {
    for (let i = 0; i < CompInit.length; i++) {
        CompInit[i](ctx)
    }
}
