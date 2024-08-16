import { cam } from "./cam"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import { angleToVec, ccCollision } from "./core/math"
import { mobCollisionRadius, iterMobs, killMob } from "./mob"

const entities = {
    x: [] as number[],
    y: [] as number[],
    // direction vector(angle)
    ax: [] as number[],
    ay: [] as number[],
    active: [] as boolean[],
}
const freeEntities: number[] = []
const bulletSpeed = 0.5
const bulletRadius = 10

addPhysicsComp((dt) => {
    for (let i = 0; i < entities.x.length; i++) {
        if (entities.active[i]) {
            // update existing bullets
            entities.x[i] += entities.ax[i] * bulletSpeed * dt
            entities.y[i] += entities.ay[i] * bulletSpeed * dt

            // check for impact
            iterMobs((mobx, moby, idx) => {
                if (
                    ccCollision(
                        entities.x[i],
                        entities.y[i],
                        bulletRadius,
                        mobx,
                        moby,
                        mobCollisionRadius,
                    )
                ) {
                    killMob(idx)
                    killBullet(i)
                    return true
                }
                return false
            })
        }
    }
})

addRenderComp((ctx) => {
    for (let i = 0; i < entities.x.length; i++) {
        if (entities.active[i]) {
            ctx.fillStyle = "orange"
            ctx.beginPath()
            ctx.arc(
                entities.x[i] - cam.x,
                entities.y[i] - cam.y,
                bulletRadius,
                0,
                Math.PI * 2,
            )
            ctx.fill()
        }
    }
})

export const spawnBullet = (x: number, y: number, dir: number) => {
    const angle = angleToVec(dir)
    if (freeEntities.length > 0) {
        const i = freeEntities.pop()!
        entities.x[i] = x
        entities.y[i] = y
        entities.ax[i] = angle.x
        entities.ay[i] = angle.y
        entities.active[i] = true
    } else {
        entities.x.push(x)
        entities.y.push(y)
        entities.ax.push(angle.x)
        entities.ay.push(angle.y)
        entities.active.push(true)
    }
}

const killBullet = (i: number) => {
    entities.active[i] = false
    freeEntities.push(i)
}
