import { cam } from "./cam"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import {
    SPRITE_ANIM_RATE_MS,
    DEBUG,
    Dir,
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

export const hero = {
    x: WIDTH / 2,
    y: HEIGHT / 2,
    state: State.idle,
    dir: Dir.right,
    invulnerable: false,
}

const vulnerability = ticker(INIT_VULNERABILITY_MS)
const fireRate = ticker(INIT_BULLET_FIRE_RATE_MS)
const frameChange = ticker(SPRITE_ANIM_RATE_MS)

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
    hero.state = State.idle
    hero.dir = Dir.right
    hero.invulnerable = false

    vulnerability.clear()
    fireRate.clear()

    unloadPhysics = addPhysicsComp((dt, keys) => {
        // movement
        hero.x += keys.dir.x * stats.speed * dt
        hero.y += keys.dir.y * stats.speed * dt
        if (keys.dir.x === 0 && keys.dir.y === 0) {
            hero.state = State.idle
        } else {
            hero.state = State.moving
            hero.dir = keys.dir.x < 0 ? Dir.left : Dir.right
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
        if (hero.invulnerable) {
            hero.invulnerable = !vulnerability.tick(dt)
        }
    })

    unloadRender = addRenderComp((ctx) => {
        ctx.fillStyle = hero.invulnerable ? "white" : "green"
        ctx.fillRect(
            hero.x - center - cam.x,
            hero.y - center - cam.y,
            SIZE,
            SIZE,
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
    if (!hero.invulnerable) {
        stats.health -= amt
        hero.invulnerable = true
        vulnerability.reset()
        if (stats.health <= 0) {
            endGame()
        }
    }
}

export const isHittingHero = (x: number, y: number, w: number, h:number) => {
    return aabb(
        hero.x - center,
        hero.y - center,
        SIZE,
        SIZE,
        x,
        y,
        w,
        h,
    )
}
