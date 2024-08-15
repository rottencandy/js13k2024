import { cam } from "./cam"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import { DEBUG, HEIGHT, WIDTH } from "./const"
import { ticker } from "./core/interpolation"

const enum State {
    idle,
    moving,
}
const enum Dir {
    left,
    right,
}

export const playerPos = { x: WIDTH / 2, y: HEIGHT / 2 }
export const playerCol = 20
const width = 50
const height = 50
let state = State.idle
let dir = Dir.right
let health = 100
let invulnerable = false

const vulnerability = ticker(1000, true)

addPhysicsComp((dt, keys) => {
    // movement
    playerPos.x += keys.dir.x * dt
    playerPos.y += keys.dir.y * dt
    if (keys.dir.x === 0 && keys.dir.y === 0) {
        state = State.idle
    } else {
        state = State.moving
        dir = keys.dir.x < 0 ? Dir.left : Dir.right
    }

    // vulnerability
    if (invulnerable) {
        invulnerable = !vulnerability.tick(dt)
    }
})

addRenderComp((ctx) => {
    ctx.fillStyle = invulnerable ? "yellow" : "green"
    ctx.fillRect(
        playerPos.x - width / 2 - cam.x,
        playerPos.y - height / 2 - cam.y,
        width,
        height,
    )

    // draw collision radius
    if (DEBUG) {
        ctx.beginPath()
        ctx.arc(
            playerPos.x - cam.x,
            playerPos.y - cam.y,
            playerCol,
            0,
            Math.PI * 2,
        )
        ctx.stroke()
    }
})

export const hitHero = (amt: number) => {
    if (!invulnerable) {
        health -= amt
        invulnerable = true
        vulnerability.reset()
    }
}
