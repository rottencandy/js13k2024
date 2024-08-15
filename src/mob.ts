import { cam } from "./cam"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import { DEBUG, HEIGHT } from "./const"
import { ticker } from "./core/interpolation"
import { rand } from "./core/math"
import { playerPos } from "./hero"

const mobs = {
    x: [] as number[],
    y: [] as number[],
}
const spawnRadius = HEIGHT / 2,
    width = 20,
    height = 20

const spawnTimer = ticker(1000, true)

addPhysicsComp((dt) => {
    if (spawnTimer(dt)) {
        spawnMob()
    }
})

addRenderComp((ctx) => {
    ctx.fillStyle = "red"
    for (let i = 0; i < mobs.x.length; i++) {
        ctx.fillRect(
            mobs.x[i] - width / 2 - cam.x,
            mobs.y[i] - height / 2 - cam.y,
            width,
            height,
        )
    }

    // draw spawn circle
    if (DEBUG) {
        ctx.arc(
            playerPos.x - cam.x,
            playerPos.y - cam.y,
            spawnRadius,
            0,
            Math.PI * 2,
        )
        ctx.stroke()
    }
})

const spawnMob = () => {
    const theta = rand(0, Math.PI * 2)
    const spawnX = Math.sin(theta) * spawnRadius + playerPos.x
    const spawnY = Math.cos(theta) * spawnRadius + playerPos.y
    mobs.x.push(spawnX)
    mobs.y.push(spawnY)
}
