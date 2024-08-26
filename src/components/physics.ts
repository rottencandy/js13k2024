import { keys, Keys } from "../core/input"

type Func = (dt: number, keys: Keys) => void
let components: Func[] = []

let paused = false

export let physicsPause = (val: boolean) => {
    paused = val
}

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
