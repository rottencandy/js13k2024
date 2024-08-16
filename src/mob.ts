import { cam } from "./cam"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import { DEBUG, HEIGHT } from "./const"
import { ticker } from "./core/interpolation"
import { angleToVec, ccCollision, distance, normalize, rand } from "./core/math"
import { hitHero, playerCol, playerPos } from "./hero"

// poor man's ecs
const entities = {
    x: [] as number[],
    y: [] as number[],
    active: [] as boolean[],
}
// stores ids of free entities
const freeEntities: number[] = []
const spawnRadius = HEIGHT / 2
const width = 20
const height = 20
const speed = 0.1
const mobCol = 10
const mobDmg = 10

const spawnTimer = ticker(1000, true)
// throwaway temporary variable for optimization
const _vec = { x: 0, y: 0 }

addPhysicsComp((dt) => {
    if (spawnTimer.tick(dt)) {
        spawnMob()
    }
    // todo optimize out non-visible mobs?
    for (let i = 0; i < entities.x.length; i++) {
        if (entities.active[i]) {
            // move towards player
            _vec.x = playerPos.x - entities.x[i]
            _vec.y = playerPos.y - entities.y[i]
            normalize(_vec)
            entities.x[i] += _vec.x * speed * dt
            entities.y[i] += _vec.y * speed * dt

            // check player collision
            // todo: possible optimization: skip detection if player is invulnerable
            if (
                ccCollision(
                    entities.x[i],
                    entities.y[i],
                    mobCol,
                    playerPos.x,
                    playerPos.y,
                    playerCol,
                )
            ) {
                hitHero(mobDmg)
            }
        }
    }
})

addRenderComp((ctx) => {
    ctx.fillStyle = "red"
    for (let i = 0; i < entities.x.length; i++) {
        if (entities.active[i]) {
            ctx.fillRect(
                entities.x[i] - width / 2 - cam.x,
                entities.y[i] - height / 2 - cam.y,
                width,
                height,
            )
            // draw collision radius
            if (DEBUG) {
                ctx.beginPath()
                ctx.arc(
                    entities.x[i] - cam.x,
                    entities.y[i] - cam.y,
                    mobCol,
                    0,
                    Math.PI * 2,
                )
                ctx.stroke()
            }
        }
    }

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

const killMob = (i: number) => {
    entities.active[i] = false
    freeEntities.push(i)
}

/**
 * This returns undefined if there are no mobs alive
 */
export const nearestMobPos = (x: number, y: number) => {
    let smallestDist = 1e3
    let id: number | undefined = undefined
    for (let i = 0; i < entities.x.length; i++) {
        if (entities.active[i]) {
            const dist = distance(x, y, entities.x[i], entities.y[i])
            if (dist < smallestDist) {
                smallestDist = dist
                id = i
            }
        }
    }
    if (id !== undefined) {
        return { x: entities.x[id], y: entities.y[id] }
    }
}
