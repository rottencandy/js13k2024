import { cam } from "./cam"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import {
    SPRITE_ANIM_RATE_MS,
    DEBUG,
    HEIGHT,
    INIT_BULLET_FIRE_RATE_MS,
    INIT_VULNERABILITY_MS,
    WIDTH,
} from "./const"
import { ticker } from "./core/interpolation"
import { aabb } from "./core/math"
import { nearestMobPos } from "./mob"
import { endGame } from "./scene"
import { stats } from "./stat"
import { fireBullet } from "./weapon"

const enum State {
    idle,
    moving,
}

const SIZE = 16
const center = SIZE / 2
let pendingDamage = 0
let invulnerable = false
let flipped = false
let state = State.idle

export const hero = {
    x: WIDTH / 2,
    y: HEIGHT / 2,
}

const vulnerability = ticker(INIT_VULNERABILITY_MS)
const fireRate = ticker(INIT_BULLET_FIRE_RATE_MS)
const frameChange = ticker(SPRITE_ANIM_RATE_MS)

let frame = 0
const maxFrames = 3

let unloadPhysics: () => void
let unloadRender: () => void

export const unloadHero = () => {
    unloadPhysics()
    unloadRender()
}

export const loadHero = () => {
    hero.x = WIDTH / 2
    hero.y = HEIGHT / 2
    stats.health = 100
    state = State.idle
    flipped = false
    invulnerable = false

    vulnerability.clear()
    fireRate.clear()
    frameChange.clear()

    unloadPhysics = addPhysicsComp((dt, keys) => {
        // movement
        hero.x += keys.dir.x * stats.speed * dt
        hero.y += keys.dir.y * stats.speed * dt
        if (keys.dir.x === 0 && keys.dir.y === 0) {
            state = State.idle
        } else {
            state = State.moving
            if (keys.dir.x !== 0) {
                flipped = keys.dir.x < 0
            }
        }

        // fire weapons
        if (fireRate.tick(dt)) {
            const aimedMob = nearestMobPos(hero.x, hero.y)
            if (aimedMob) {
                // translate mob pos to player pos
                const xpos = aimedMob.x - hero.x
                const ypos = aimedMob.y - hero.y
                const angle = Math.atan2(xpos, ypos)
                fireBullet(hero.x, hero.y, angle)
            }
        }

        // vulnerability
        if (invulnerable) {
            invulnerable = !vulnerability.tick(dt)
        }
        // reduce health and check if dead
        if (pendingDamage > 0) {
            stats.health -= 1
            pendingDamage -= 1
            if (stats.health <= 0) {
                endGame()
            }
        }

        // animation frame
        if (frameChange.tick(dt)) {
            frame = (frame + 1) % maxFrames
        }
    })

    unloadRender = addRenderComp((ctx, assets) => {
        // todo invulnerable frame
        ctx.fillStyle = invulnerable ? "white" : "green"
        const dirFrame = flipped ? 0 : 3
        ctx.drawImage(
            assets.hero[frame + dirFrame],
            hero.x - center - cam.x,
            hero.y - center - cam.y,
        )

        if (DEBUG) {
            // draw collision radius
            ctx.strokeStyle = "green"
            ctx.strokeRect(
                hero.x - center - cam.x,
                hero.y - center - cam.y,
                SIZE,
                SIZE,
            )
            // draw pickup radius
            ctx.beginPath()
            ctx.arc(
                hero.x - cam.x,
                hero.y - cam.y,
                stats.pickupRadius,
                0,
                Math.PI * 2,
            )
            ctx.stroke()
        }
    })
}

export const hitHero = (amt: number) => {
    if (!invulnerable) {
        pendingDamage += amt
        invulnerable = true
        vulnerability.reset()
    }
}

export const isHittingHero = (x: number, y: number, w: number, h: number) => {
    return aabb(hero.x - center, hero.y - center, SIZE, SIZE, x, y, w, h)
}
