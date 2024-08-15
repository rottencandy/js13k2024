import { CTX } from "../core/canvas"

type Func = (ctx: CTX) => void
let components: Func[] = []

export const CompInitRun = (ctx: CTX) => {
    for (let i = 0; i < components.length; i++) {
        components[i](ctx)
    }
}

export const addInitComp = (fn: Func) => {
    components.push(fn)
    return () => {
        components = components.filter((val) => val !== fn)
    }
}
