import { cam } from "./cam"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import { DEBUG, HEIGHT } from "./const"
import { ticker } from "./core/interpolation"
import { ccCollision, normalize, rand } from "./core/math"
import { hitHero, playerCol, playerPos } from "./hero"

// poor man's ecs
const mobs = {
    x: [] as number[],
    y: [] as number[],
    alive: [] as boolean[],
}
// stores ids of free entities
const freeMobs: number[] = []
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
    for (let i = 0; i < mobs.x.length; i++) {
        // move towards player
        _vec.x = playerPos.x - mobs.x[i]
        _vec.y = playerPos.y - mobs.y[i]
        normalize(_vec)
        mobs.x[i] += _vec.x * speed * dt
        mobs.y[i] += _vec.y * speed * dt

        // check player collision
        // todo: possible optimization: skip detection if player is invulnerable
        if (
            ccCollision(
                mobs.x[i],
                mobs.y[i],
                mobCol,
                playerPos.x,
                playerPos.y,
                playerCol,
            )
        ) {
            hitHero(mobDmg)
        }
    }
})

addRenderComp((ctx) => {
    ctx.fillStyle = "red"
    for (let i = 0; i < mobs.x.length; i++) {
        if (mobs.alive[i]) {
            ctx.fillRect(
                mobs.x[i] - width / 2 - cam.x,
                mobs.y[i] - height / 2 - cam.y,
                width,
                height,
            )
        }
        // draw collision radius
        if (DEBUG) {
            ctx.beginPath()
            ctx.arc(
                mobs.x[i] - cam.x,
                mobs.y[i] - cam.y,
                mobCol,
                0,
                Math.PI * 2,
            )
            ctx.stroke()
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
    const theta = rand(0, Math.PI * 2)
    const spawnX = Math.sin(theta) * spawnRadius + playerPos.x
    const spawnY = Math.cos(theta) * spawnRadius + playerPos.y
    if (freeMobs.length > 0) {
        const i = freeMobs.pop()!
        mobs.x[i] = spawnX
        mobs.y[i] = spawnX
        mobs.alive[i] = true
        return i
    }
    mobs.x.push(spawnX)
    mobs.y.push(spawnY)
    return mobs.alive.push(true)
}

const killMob = (i: number) => {
    mobs.alive[i] = false
    freeMobs.push(i)
}
