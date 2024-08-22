import { keys, Keys } from "../core/input"

type Func = (dt: number, keys: Keys) => void
let components: Func[] = []

export let paused = false

export const CompPhysicsRun = (dt: number) => {
    for (let i = 0; i < components.length; i++) {
        components[i](paused ? 0 : dt, keys)
    }
}

export const addPhysicsComp = (fn: Func) => {
    components.push(fn)
    return () => {
        components = components.filter((val) => val !== fn)
    }
}
