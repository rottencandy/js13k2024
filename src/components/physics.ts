import { WatchedKeys } from "./input"

type Func = (dt: number, keys: WatchedKeys) => void
let components: (Func)[] = []

export const CompPhysicsRun = (dt: number, keys: WatchedKeys) => {
    for (let i = 0; i < components.length; i++) {
        components[i](dt, keys)
    }
}

export const addPhysicsComp = (fn: Func) => {
    components.push(fn)
    return () => {
        components = components.filter((val) => val !== fn)
    }
}
