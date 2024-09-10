import { cam } from "./cam"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import {
    HEIGHT,
    HERO_MOB_COLLISION_PROXIMITY,
    VULNERABILITY_MS,
    SPRITE_ANIM_RATE_MS,
    WIDTH,
} from "./const"
import { ticker } from "./core/interpolation"
import { aabb } from "./core/math"
import { endGame } from "./scene"
import { playHurt } from "./sound"
import { stats } from "./stat"

const enum State {
    idle,
    moving,
}

const SIZE = 16
const center = SIZE / 2
// used for checking hero proximity(for collisions)
let pendingDamage = 0
let invulnerable = false
let flipped = false
let state = State.idle

export const hero = {
    x: WIDTH / 2,
    y: HEIGHT / 2,
}

const vulnerability = ticker(VULNERABILITY_MS)
const frameChange = ticker(SPRITE_ANIM_RATE_MS)

let currentFrame = 0
const frames = {
    [State.idle]: [0, 1, 2, 0],
    [State.moving]: [3, 0, 4, 0],
}
const maxFrames = frames[State.idle].length

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
            currentFrame = (currentFrame + 1) % maxFrames
        }
    })

    unloadRender = addRenderComp((ctx, assets) => {
        // blink if invulnerable
        if (invulnerable && vulnerability.ticks % 10 === 0) {
            return
        }
        const dirOffset = flipped ? 5 : 0
        const frame = assets.hero[frames[state][currentFrame] + dirOffset]
        switch (state) {
            case State.idle:
            case State.moving:
        }
        ctx.drawImage(
            frame,
            ~~(hero.x - center - cam.x),
            ~~(hero.y - center - cam.y),
        )

        //if (DEBUG) {
        //    // center
        //    ctx.strokeStyle = RED
        //    ctx.strokeRect(hero.x - cam.x, hero.y - cam.y, 1, 1)
        //    // collision radius
        //    ctx.strokeStyle = BLACK0
        //    ctx.strokeRect(
        //        hero.x - center - cam.x,
        //        hero.y - center - cam.y,
        //        SIZE,
        //        SIZE,
        //    )
        //    // rect used for checking hero proximity(for collisions)
        //    ctx.strokeRect(
        //        hero.x - HERO_MOB_COLLISION_PROXIMITY / 2 - cam.x,
        //        hero.y - HERO_MOB_COLLISION_PROXIMITY / 2 - cam.y,
        //        HERO_MOB_COLLISION_PROXIMITY,
        //        HERO_MOB_COLLISION_PROXIMITY,
        //    )
        //    // pickup radius
        //    ctx.beginPath()
        //    ctx.arc(
        //        hero.x - cam.x,
        //        hero.y - cam.y,
        //        stats.pickupRadius,
        //        0,
        //        Math.PI * 2,
        //    )
        //    ctx.stroke()
        //}
    })
}

export const hitHero = (amt: number) => {
    if (!invulnerable) {
        pendingDamage += amt
        invulnerable = true
        vulnerability.reset()
        playHurt()
    }
}

export const isHittingHero = (x: number, y: number, w: number, h: number) => {
    return aabb(hero.x - center, hero.y - center, SIZE, SIZE, x, y, w, h)
}

export const isNearHero = (x: number, y: number, w: number, h: number) => {
    return aabb(
        hero.x - HERO_MOB_COLLISION_PROXIMITY / 2,
        hero.y - HERO_MOB_COLLISION_PROXIMITY / 2,
        HERO_MOB_COLLISION_PROXIMITY,
        HERO_MOB_COLLISION_PROXIMITY,
        x,
        y,
        w,
        h,
    )
}
