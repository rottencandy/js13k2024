import { cam } from "./cam"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import { angleToVec, ccCollision } from "./core/math"
import { mobCollisionRadius, iterMobs, killMob } from "./mob"

const bullets = {
    x: [] as number[],
    y: [] as number[],
    // direction vector(angle)
    dirx: [] as number[],
    diry: [] as number[],
    active: [] as boolean[],
}
let freeEntities: number[] = []
const bulletSpeed = 0.5
const bulletRadius = 10

let unloadPhysics: () => void
let unloadRender: () => void

export const unloadWeapon = () => {
    unloadPhysics()
    unloadRender()
}

export const loadWeapon = () => {
    bullets.x = []
    bullets.y = []
    bullets.dirx = []
    bullets.diry = []
    bullets.active = []
    freeEntities = []

    unloadPhysics = addPhysicsComp((dt) => {
        iterBullets((x, y, dirx, diry, id) => {
            // update existing bullets
            bullets.x[id] += dirx * bulletSpeed * dt
            bullets.y[id] += diry * bulletSpeed * dt

            // check for impact
            iterMobs((mobx, moby, mobid) => {
                if (
                    ccCollision(
                        bullets.x[id],
                        bullets.y[id],
                        bulletRadius,
                        mobx,
                        moby,
                        mobCollisionRadius,
                    )
                ) {
                    killMob(mobid)
                    removeBullet(id)
                    return true
                }
            })
        })
    })

    unloadRender = addRenderComp((ctx) => {
        iterBullets((x, y, _dirx, _diry, _id) => {
            ctx.fillStyle = "orange"
            ctx.beginPath()
            ctx.arc(x - cam.x, y - cam.y, bulletRadius, 0, Math.PI * 2)
            ctx.fill()
        })
    })
}

export const fireBullet = (x: number, y: number, dir: number) => {
    const angle = angleToVec(dir)
    if (freeEntities.length > 0) {
        const i = freeEntities.pop()!
        bullets.x[i] = x
        bullets.y[i] = y
        bullets.dirx[i] = angle.x
        bullets.diry[i] = angle.y
        bullets.active[i] = true
    } else {
        bullets.x.push(x)
        bullets.y.push(y)
        bullets.dirx.push(angle.x)
        bullets.diry.push(angle.y)
        bullets.active.push(true)
    }
}

const removeBullet = (i: number) => {
    bullets.active[i] = false
    freeEntities.push(i)
}

const iterBullets = (
    fn: (
        x: number,
        y: number,
        dirx: number,
        diry: number,
        id: number,
    ) => boolean | void,
) => {
    for (let i = 0; i < bullets.x.length; i++) {
        if (bullets.active[i]) {
            const end = fn(
                bullets.x[i],
                bullets.y[i],
                bullets.dirx[i],
                bullets.diry[i],
                i,
            )
            if (end) {
                break
            }
        }
    }
}
