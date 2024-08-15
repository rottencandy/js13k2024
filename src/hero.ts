import { cam } from "./cam"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import { HEIGHT, WIDTH } from "./const"

const enum State {
    idle,
    moving,
}

export const playerPos = { x: WIDTH / 2, y: HEIGHT / 2 }
const width = 50,
    height = 50

addPhysicsComp((dt, keys) => {
    playerPos.x += keys.dir.x * dt
    playerPos.y += keys.dir.y * dt
})

addRenderComp((ctx) => {
    ctx.fillStyle = "green"
    ctx.fillRect(
        playerPos.x - width / 2 - cam.x,
        playerPos.y - height / 2 - cam.y,
        width,
        height,
    )
})
