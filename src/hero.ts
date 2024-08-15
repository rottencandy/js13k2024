import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"

let x = 50,
    y = 50

addPhysicsComp((dt, keys) => {
    x += keys.dir.x * dt
    y += keys.dir.y * dt
})

addRenderComp((ctx) => {
    ctx.fillStyle = "red"
    ctx.fillRect(x, y, 100, 100)
})
