import { cam } from "./cam"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import { DEBUG, HEIGHT, WIDTH } from "./const"
import { ticker } from "./core/interpolation"
import { nearestMobPos } from "./mob"
import { endGame } from "./scene"
import { fireBullet } from "./weapon"

const enum State {
    idle,
    moving,
}

const enum Dir {
    left,
    right,
}

export const playerCollisionRect = 30
export const maxHealth = 100
export const playerPos = { x: WIDTH / 2, y: HEIGHT / 2 }
export let health = 100
const width = 50
const height = 50
let state: State
let dir: Dir
let invulnerable: boolean

const vulnerability = ticker(1e3)
const fireRate = ticker(2e3)
const frameChange = ticker(200)

let unloadPhysics: () => void
let unloadRender: () => void

export const unloadHero = () => {
    unloadPhysics()
    unloadRender()
}

export const loadHero = () => {
    playerPos.x = WIDTH / 2
    playerPos.y = HEIGHT / 2
    health = 100
    state = State.idle
    dir = Dir.right
    invulnerable = false

    vulnerability.reset()
    fireRate.reset()

    unloadPhysics = addPhysicsComp((dt, keys) => {
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
        health -= amt
        invulnerable = true
        vulnerability.reset()
        if (health <= 0) {
            endGame()
        }
    }
}
