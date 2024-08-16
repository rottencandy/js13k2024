import { cam } from "./cam"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import { DEBUG, HEIGHT, WIDTH } from "./const"
import { ticker } from "./core/interpolation"
import { nearestMobPos } from "./mob"
import { spawnBullet } from "./weapon"

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

const vulnerability = ticker(1e3, true)
const fireRate = ticker(2e3, true)

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

    // fire weapons
    if (fireRate.tick(dt)) {
        const aimedMob = nearestMobPos(playerPos.x, playerPos.y)
        if (aimedMob !== undefined) {
            // translate mob pos to player pos
            const xpos = aimedMob.x - playerPos.x
            const ypos = aimedMob.y - playerPos.y
            const angle = Math.atan2(xpos, ypos)
            spawnBullet(playerPos.x, playerPos.y, angle)
        }
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
