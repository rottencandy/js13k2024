import { WatchedKeys } from "./input"

export const CompPhysics: ((dt: number, keys: WatchedKeys) => void)[] = []

export const CompPhysicsRun = (dt: number, keys: WatchedKeys) => {
    for (let i = 0; i < CompPhysics.length; i++) {
        CompPhysics[i](dt, keys)
    }
}
