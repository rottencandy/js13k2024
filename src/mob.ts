import { cam } from "./cam"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import { DEBUG, HEIGHT } from "./const"
import { ticker } from "./core/interpolation"
import { angleToVec, ccCollision, distance, normalize, rand } from "./core/math"
import { hitHero, playerCollisionRadius, playerPos } from "./hero"

// poor man's ecs
const entities = {
    x: [] as number[],
    y: [] as number[],
    active: [] as boolean[],
}
// stores ids of free entities
let freeEntities: number[] = []
const spawnRadius = HEIGHT / 2
export const mobCollisionRadius = 10
const width = 20
const height = 20
const speed = 0.1
const mobDmg = 10

const spawnTimer = ticker(1000, true)
// throwaway temporary variable for optimization
const _vec = { x: 0, y: 0 }

let unloadPhysics: () => void
let unloadRender: () => void

export const unloadMob = () => {
    unloadPhysics()
    unloadRender()
}

export const loadMob = () => {
    entities.x = []
    entities.y = []
    entities.active = []
    freeEntities = []

    unloadPhysics = addPhysicsComp((dt) => {
        if (spawnTimer.tick(dt)) {
            spawnMob()
        }
        // todo optimize out offscreen mobs?
        iterMobs((x, y, id) => {
            // move towards player
            _vec.x = playerPos.x - x
            _vec.y = playerPos.y - y
            normalize(_vec)
            entities.x[id] += _vec.x * speed * dt
            entities.y[id] += _vec.y * speed * dt

            // check player collision
            // todo: possible optimization: skip detection if player is invulnerable
            if (
                ccCollision(
                    // we use values from component because we just updated them above
                    entities.x[id],
                    entities.y[id],
                    mobCollisionRadius,
                    playerPos.x,
                    playerPos.y,
                    playerCollisionRadius,
                )
            ) {
                hitHero(mobDmg)
            }
        })
    })

    unloadRender = addRenderComp((ctx) => {
        ctx.fillStyle = "red"
        iterMobs((x, y) => {
            ctx.fillRect(
                x - width / 2 - cam.x,
                y - height / 2 - cam.y,
                width,
                height,
            )
            // draw collision radius
            if (DEBUG) {
                ctx.beginPath()
                ctx.arc(
                    x - cam.x,
                    y - cam.y,
                    mobCollisionRadius,
                    0,
                    Math.PI * 2,
                )
                ctx.stroke()
            }
            return false
        })

        // draw spawn circle
        if (DEBUG) {
            ctx.beginPath()
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
}

/** returns mob index */
const spawnMob = () => {
    const spawnPos = angleToVec(rand(0, Math.PI * 2))
    spawnPos.x = spawnPos.x * spawnRadius + playerPos.x
    spawnPos.y = spawnPos.y * spawnRadius + playerPos.y
    if (freeEntities.length > 0) {
        const i = freeEntities.pop()!
        entities.x[i] = spawnPos.x
        entities.y[i] = spawnPos.y
        entities.active[i] = true
        return i
    }
    entities.x.push(spawnPos.x)
    entities.y.push(spawnPos.y)
    return entities.active.push(true)
}

export const killMob = (i: number) => {
    entities.active[i] = false
    freeEntities.push(i)
}

// TODO: check if using this instead of for-looping saves space
export const iterMobs = (
    fn: (x: number, y: number, id: number) => boolean | void,
) => {
    for (let i = 0; i < entities.x.length; i++) {
        if (entities.active[i]) {
            const end = fn(entities.x[i], entities.y[i], i)
            if (end) {
                break
            }
        }
    }
}

/**
 * This returns undefined if there are no mobs alive
 */
export const nearestMobPos = (x: number, y: number) => {
    let smallestDist = 1e3
    let id: number | undefined = undefined
    iterMobs((mobx, moby, mobid) => {
        const dist = distance(x, y, mobx, moby)
        if (dist < smallestDist) {
            smallestDist = dist
            id = mobid
        }
    })
    if (id !== undefined) {
        return { x: entities.x[id], y: entities.y[id] }
    }
}
