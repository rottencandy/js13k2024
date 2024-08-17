import { addPhysicsComp } from "./components/physics"

export const cam = { x: 0, y: 0 }

let unloadPhysics: () => void

export const unloadCam = () => {
    unloadPhysics()
}

export const loadCam = () => {
    cam.x = 0
    cam.y = 0
    unloadPhysics = addPhysicsComp((dt, keys) => {
        cam.x += keys.dir.x * dt
        cam.y += keys.dir.y * dt
    })
}
