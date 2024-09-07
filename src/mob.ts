import { cam } from "./cam"
import { dropCoin } from "./coin"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import {
    BLACK0,
    DEBUG,
    INIT_SPAWN_RATE,
    MOB_ATTACK,
    MOB_HEALTH,
    MOB_MAX_COLLISION_SNAP_DIST,
    MOB_SPEED,
    SPAWN_RADIUS,
    SPRITE_ANIM_RATE_MS,
} from "./const"
import { ticker } from "./core/interpolation"
import { aabb, angleToVec, distance, limitMagnitude, rand } from "./core/math"
import { hero, hitHero, isHittingHero, isNearHero } from "./hero"
import { spawnFloatingText } from "./text"

export const enum MobType {
    blob,
    fly,
    zombie,
    ghost,
}

// poor man's ecs
const E = {
    x: [] as number[],
    y: [] as number[],
    health: [] as number[],
    flipped: [] as boolean[],
    // is close to hero
    near: [] as boolean[],
    frame: [] as number[],
    frameTicker: [] as number[],
    type: [] as MobType[],
    active: [] as boolean[],
}

// stores ids of free entities
let freePool: number[] = []

const SIZE = 16

const spawnTimer = ticker(INIT_SPAWN_RATE)
const frames = [0, 1, 2, 1]
const maxFrames = frames.length

// throwaway temporary variable for optimization
const _vec = { x: 0, y: 0 }

let unloadPhysics: () => void
let unloadRender: () => void

export const unloadMob = () => {
    unloadPhysics()
    unloadRender()
}

export const loadMob = () => {
    E.x = []
    E.y = []
    E.health = []
    E.flipped = []
    E.near = []
    E.frame = []
    E.frameTicker = []
    E.type = []
    E.active = []
    freePool = []
    spawnTimer.clear()

    unloadPhysics = addPhysicsComp((dt) => {
        if (spawnTimer.tick(dt)) {
            spawnMob(MobType.blob)
        }
        // todo optimize out offscreen mobs?
        iterMobs((x, y, id) => {
            // check proximity to hero
            E.near[id] = isNearHero(x, y, SIZE, SIZE)

            // check hero collision
            // todo: possible optimization: skip detection if hero is invulnerable
            if (E.near[id] && isHittingHero(x, y, SIZE, SIZE)) {
                hitHero(MOB_ATTACK)
            } else {
                // move towards hero
                // note that we only move if not hitting hero
                _vec.x = hero.x - x
                _vec.y = hero.y - y
                limitMagnitude(_vec)
                E.x[id] += _vec.x * MOB_SPEED * dt
                E.y[id] += _vec.y * MOB_SPEED * dt
                E.flipped[id] = _vec.x < 0
            }

            // sprite animation
            if ((E.frameTicker[id] += dt) > SPRITE_ANIM_RATE_MS) {
                E.frameTicker[id] = 0
                E.frame[id] = (E.frame[id] + 1) % maxFrames
            }
        })

        // solve collisions within mobs, only for the ones close to hero
        // we don't need high accuracy or stability, so offsets are limited
        // such that mobs do not snap like crazy
        // this will cause some overlap
        // and mobs will push each other equally
        // this is also just one pass, so it's quite unstable
        for (let i = 0; i < E.active.length; i++) {
            if (!E.active[i] || !E.near[i]) {
                continue
            }
            for (let j = i + 1; j < E.active.length; j++) {
                if (!E.active[j] || !E.near[j]) {
                    continue
                }
                if (
                    aabb(E.x[i], E.y[i], SIZE, SIZE, E.x[j], E.y[j], SIZE, SIZE)
                ) {
                    const xOffset = Math.max(
                        E.x[i] + SIZE - E.x[j],
                        MOB_MAX_COLLISION_SNAP_DIST,
                    )
                    const yOffset = Math.max(
                        E.y[i] + SIZE - E.y[j],
                        MOB_MAX_COLLISION_SNAP_DIST,
                    )
                    if (xOffset > yOffset) {
                        E.y[i] -= yOffset / 2
                        E.y[j] += yOffset / 2
                    } else {
                        E.x[i] -= xOffset / 2
                        E.x[j] += xOffset / 2
                    }
                }
            }
        }
    })

    unloadRender = addRenderComp((ctx, assets) => {
        iterMobs((x, y, _id, flipped, _near, currentFrame, _ticker, type) => {
            const dirOffset = flipped ? 3 : 0
            const asset =
                type === MobType.blob
                    ? assets.mob0
                    : type === MobType.fly
                      ? assets.mob1
                      : type === MobType.zombie
                        ? assets.mob2
                        : assets.mob3
            const frame = asset[frames[currentFrame] + dirOffset]
            ctx.drawImage(frame, ~~(x - cam.x), ~~(y - cam.y), SIZE, SIZE)
            // draw collision rect
            if (DEBUG) {
                ctx.strokeStyle = BLACK0
                ctx.strokeRect(x - cam.x, y - cam.y, SIZE, SIZE)
            }
            return false
        })

        // draw spawn circle
        if (DEBUG) {
            ctx.strokeStyle = BLACK0
            ctx.beginPath()
            ctx.arc(
                hero.x - cam.x,
                hero.y - cam.y,
                SPAWN_RADIUS,
                0,
                Math.PI * 2,
            )
            ctx.stroke()
        }
    })
}

/** returns mob index */
const spawnMob = (type: MobType) => {
    const spawnPos = angleToVec(rand(0, Math.PI * 2))
    spawnPos.x = spawnPos.x * SPAWN_RADIUS + hero.x
    spawnPos.y = spawnPos.y * SPAWN_RADIUS + hero.y
    if (freePool.length > 0) {
        const i = freePool.pop()!
        E.x[i] = spawnPos.x
        E.y[i] = spawnPos.y
        E.health[i] = MOB_HEALTH
        E.flipped[i] = false
        E.frame[i] = 0
        E.frameTicker[i] = 0
        E.near[i] = false
        E.type[i] = type
        E.active[i] = true
        return i
    }
    E.x.push(spawnPos.x)
    E.y.push(spawnPos.y)
    E.health.push(MOB_HEALTH)
    E.flipped.push(false)
    E.frame.push(0)
    E.frameTicker.push(0)
    E.near.push(false)
    E.type.push(type)
    return E.active.push(true)
}

export const attackMob = (id: number, dmg: number) => {
    E.health[id] -= dmg
    spawnFloatingText(dmg, E.x[id], E.y[id])
    if (E.health[id] <= 0) {
        E.active[id] = false
        freePool.push(id)
        dropCoin(E.x[id], E.y[id])
    }
}

// TODO: check if using this instead of for-looping saves space
export const iterMobs = (
    fn: (
        x: number,
        y: number,
        id: number,
        flipped: boolean,
        near: boolean,
        frame: number,
        frameTicker: number,
        type: MobType,
    ) => boolean | void,
) => {
    for (let i = 0; i < E.x.length; i++) {
        if (E.active[i]) {
            const end = fn(
                E.x[i],
                E.y[i],
                i,
                E.flipped[i],
                E.near[i],
                E.frame[i],
                E.frameTicker[i],
                E.type[i],
            )
            if (end) {
                break
            }
        }
    }
}

export const isHittingMob = (
    id: number,
    x: number,
    y: number,
    w: number,
    h: number,
) => {
    return aabb(x, y, w, h, E.x[id], E.y[id], SIZE, SIZE)
}

/**
 * This returns undefined if there are no mobs alive
 */
export const nearestMobPos = () => {
    let smallestDist = 1e3
    let id: number | undefined = undefined
    iterMobs((mobx, moby, mobid) => {
        const dist = distance(hero.x, hero.y, mobx, moby)
        if (dist < smallestDist) {
            smallestDist = dist
            id = mobid
        }
    })
    if (id !== undefined) {
        return { x: E.x[id], y: E.y[id] }
    }
}
