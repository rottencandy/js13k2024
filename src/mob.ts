import { cam } from "./cam"
import { dropCoin } from "./coin"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import {
    MOB0_ATTACK,
    MOB0_HEALTH,
    MOB_MAX_COLLISION_SNAP_DIST,
    MOB0_SPEED,
    SPAWN_RADIUS,
    SPRITE_ANIM_RATE_MS,
    MOB1_HEALTH,
    MOB2_HEALTH,
    MOB3_HEALTH,
    MOB1_SPEED,
    MOB2_SPEED,
    MOB3_SPEED,
    MOB3_ATTACK,
    MOB2_ATTACK,
    MOB1_ATTACK,
} from "./const"
import { ticker } from "./core/interpolation"
import { aabb, angleToVec, distance, limitMagnitude, rand } from "./core/math"
import { hero, hitHero, isHittingHero, isNearHero } from "./hero"
import { stats } from "./stat"
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

export const MOB_SIZE = 16

const twoSeconds = ticker(2000)
const seconds = ticker(1000)
const halfSeconds = ticker(500)
const quraterSeconds = ticker(250)

const frames = [0, 1, 2, 1]
const maxFrames = frames.length

const healths = {
    [MobType.blob]: MOB0_HEALTH,
    [MobType.fly]: MOB1_HEALTH,
    [MobType.zombie]: MOB2_HEALTH,
    [MobType.ghost]: MOB3_HEALTH,
}

const speeds = {
    [MobType.blob]: MOB0_SPEED,
    [MobType.fly]: MOB1_SPEED,
    [MobType.zombie]: MOB2_SPEED,
    [MobType.ghost]: MOB3_SPEED,
}

const attacks = {
    [MobType.blob]: MOB0_ATTACK,
    [MobType.fly]: MOB1_ATTACK,
    [MobType.zombie]: MOB2_ATTACK,
    [MobType.ghost]: MOB3_ATTACK,
}

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
    twoSeconds.clear()
    seconds.clear()
    halfSeconds.clear()
    quraterSeconds.clear()

    unloadPhysics = addPhysicsComp((dt) => {
        // mob spawn manager
        if (stats.time < 30) {
            if (seconds.tick(dt)) {
                spawnMob(MobType.blob)
            }
        } else if (stats.time < 60) {
            if (halfSeconds.tick(dt)) {
                spawnMob(MobType.blob)
            }
        } else if (stats.time < 90) {
            if (twoSeconds.tick(dt)) {
                spawnMob(MobType.blob)
            }
            if (seconds.tick(dt)) {
                spawnMob(MobType.fly)
            }
        }

        // todo optimize out offscreen mobs?
        iterMobs((x, y, id, _flip, _near, _frame, _framet, type) => {
            // check proximity to hero
            E.near[id] = isNearHero(x, y, MOB_SIZE, MOB_SIZE)

            // check hero collision
            // todo: possible optimization: skip detection if hero is invulnerable
            if (E.near[id] && isHittingHero(x, y, MOB_SIZE, MOB_SIZE)) {
                hitHero(attacks[type])
            } else {
                // move towards hero
                // note that we only move if not hitting hero
                _vec.x = hero.x - x
                _vec.y = hero.y - y
                limitMagnitude(_vec)
                const speed = speeds[type]
                E.x[id] += _vec.x * speed * dt
                E.y[id] += _vec.y * speed * dt
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
                    aabb(
                        E.x[i],
                        E.y[i],
                        MOB_SIZE,
                        MOB_SIZE,
                        E.x[j],
                        E.y[j],
                        MOB_SIZE,
                        MOB_SIZE,
                    )
                ) {
                    const xOffset = Math.max(
                        E.x[i] + MOB_SIZE - E.x[j],
                        MOB_MAX_COLLISION_SNAP_DIST,
                    )
                    const yOffset = Math.max(
                        E.y[i] + MOB_SIZE - E.y[j],
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
            ctx.drawImage(
                frame,
                ~~(x - cam.x),
                ~~(y - cam.y),
                MOB_SIZE,
                MOB_SIZE,
            )
            // draw collision rect
            //if (DEBUG) {
            //    ctx.strokeStyle = BLACK0
            //    ctx.strokeRect(x - cam.x, y - cam.y, MOB_SIZE, MOB_SIZE)
            //    ctx.strokeStyle = RED
            //    ctx.strokeRect(x - cam.x, y - cam.y, 1, 1)
            //}
            return false
        })

        // draw spawn circle
        //if (DEBUG) {
        //    ctx.strokeStyle = BLACK0
        //    ctx.beginPath()
        //    ctx.arc(
        //        hero.x - cam.x,
        //        hero.y - cam.y,
        //        SPAWN_RADIUS,
        //        0,
        //        Math.PI * 2,
        //    )
        //    ctx.stroke()
        //}
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
        E.health[i] = healths[type]
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
    E.health.push(healths[type])
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
        stats.score += 1
    }
}

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
    return aabb(x, y, w, h, E.x[id], E.y[id], MOB_SIZE, MOB_SIZE)
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
