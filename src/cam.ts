import { addPhysicsComp } from "./components/physics"
import { stats } from "./stat"

export const cam = { x: 0, y: 0 }

let unloadPhysics: () => void

export const unloadCam = () => {
    unloadPhysics()
}

export const loadCam = () => {
    cam.x = 0
    cam.y = 0
    unloadPhysics = addPhysicsComp((dt, keys) => {
        cam.x += keys.dir.x * stats.speed * dt
        cam.y += keys.dir.y * stats.speed * dt
    })
}
