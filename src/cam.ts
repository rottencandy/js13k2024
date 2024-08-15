import { addPhysicsComp } from "./components/physics"

export const cam = { x: 0, y: 0 }

addPhysicsComp((dt, keys) => {
    cam.x += keys.dir.x * dt
    cam.y += keys.dir.y * dt
})
