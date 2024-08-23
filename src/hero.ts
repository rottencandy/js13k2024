import { cam } from "./cam"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import {
    ANIM_RATE_MS,
    DEBUG,
    Dir,
    HEIGHT,
    INIT_FIRE_RATE_MS,
    INIT_VULNERABILITY_MS,
    WIDTH,
} from "./const"
import { ticker } from "./core/interpolation"
import { nearestMobPos } from "./mob"
import { endGame } from "./scene"
import { stats } from "./stat"
import { fireBullet } from "./weapon"

const enum State {
    idle,
    moving,
}

export const playerCollisionRect = 30
export const playerPos = { x: WIDTH / 2, y: HEIGHT / 2 }
const width = 50
const height = 50
let state: State
let dir: Dir
let invulnerable: boolean

const vulnerability = ticker(INIT_VULNERABILITY_MS)
const fireRate = ticker(INIT_FIRE_RATE_MS)
const frameChange = ticker(ANIM_RATE_MS)

let unloadPhysics: () => void
let unloadRender: () => void

export const unloadHero = () => {
    unloadPhysics()
    unloadRender()
}

export const loadHero = () => {
    playerPos.x = WIDTH / 2
    playerPos.y = HEIGHT / 2
    stats.health = 100
    state = State.idle
    dir = Dir.right
    invulnerable = false

    vulnerability.clear()
    fireRate.clear()

    unloadPhysics = addPhysicsComp((dt, keys) => {
        // movement
        playerPos.x += keys.dir.x * stats.speed * dt
        playerPos.y += keys.dir.y * stats.speed * dt
        if (keys.dir.x === 0 && keys.dir.y === 0) {
            state = State.idle
        } else {
            state = State.moving
            dir = keys.dir.x < 0 ? Dir.left : Dir.right
        }

        // fire weapons
        if (fireRate.tick(dt)) {
            const aimedMob = nearestMobPos(playerPos.x, playerPos.y)
            if (aimedMob) {
                // translate mob pos to player pos
                const xpos = aimedMob.x - playerPos.x
                const ypos = aimedMob.y - playerPos.y
                const angle = Math.atan2(xpos, ypos)
                fireBullet(playerPos.x, playerPos.y, angle)
            }
        }

        // vulnerability
        if (invulnerable) {
            invulnerable = !vulnerability.tick(dt)
        }
    })

    unloadRender = addRenderComp((ctx) => {
        ctx.fillStyle = invulnerable ? "yellow" : "green"
        ctx.fillRect(
            playerPos.x - width / 2 - cam.x,
            playerPos.y - height / 2 - cam.y,
            width,
            height,
        )

        // draw collision radius
        if (DEBUG) {
            ctx.strokeRect(
                playerPos.x - width / 2 - cam.x + 10,
                playerPos.y - height / 2 - cam.y + 10,
                playerCollisionRect,
                playerCollisionRect,
            )
        }
    })
}

export const hitHero = (amt: number) => {
    if (!invulnerable) {
        stats.health -= amt
        invulnerable = true
        vulnerability.reset()
        if (stats.health <= 0) {
            endGame()
        }
    }
}
