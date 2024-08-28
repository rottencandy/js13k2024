import { cam } from "./cam"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import { MAX_BULLET_AGE } from "./const"
import { aabb, angleToVec } from "./core/math"
import { attackMob, iterMobs, mobCollisionRect } from "./mob"
import { stats } from "./stat"

const bullets = {
    x: [] as number[],
    y: [] as number[],
    // direction vector(angle)
    dirx: [] as number[],
    diry: [] as number[],
    age: [] as number[],
    active: [] as boolean[],
}
let freePool: number[] = []
const bulletCollisionRect = 10

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
    bullets.age = []
    bullets.active = []
    freePool = []

    unloadPhysics = addPhysicsComp((dt) => {
        iterBullets((_x, _y, dirx, diry, id) => {
            // update existing bullets
            bullets.x[id] += dirx * stats.bulletSpeed * dt
            bullets.y[id] += diry * stats.bulletSpeed * dt
            bullets.age[id] += dt

            if (bullets.age[id] > MAX_BULLET_AGE) {
                removeBullet(id)
                return
            }

            // check for impact
            iterMobs((mobx, moby, mobid) => {
                if (
                    aabb(
                        bullets.x[id],
                        bullets.y[id],
                        bulletCollisionRect,
                        bulletCollisionRect,
                        mobx,
                        moby,
                        mobCollisionRect,
                        mobCollisionRect,
                    )
                ) {
                    attackMob(mobid, stats.bulletDmg)
                    removeBullet(id)
                    return true
                }
            })
        })
    })

    unloadRender = addRenderComp((ctx) => {
        iterBullets((x, y, _dirx, _diry, _id) => {
            ctx.fillStyle = "orange"
            ctx.fillRect(
                x - cam.x,
                y - cam.y,
                bulletCollisionRect,
                bulletCollisionRect,
            )
        })
    })
}

export const fireBullet = (x: number, y: number, dir: number) => {
    const angle = angleToVec(dir)
    if (freePool.length > 0) {
        const i = freePool.pop()!
        bullets.x[i] = x
        bullets.y[i] = y
        bullets.dirx[i] = angle.x
        bullets.diry[i] = angle.y
        bullets.age[i] = 0
        bullets.active[i] = true
    } else {
        bullets.x.push(x)
        bullets.y.push(y)
        bullets.dirx.push(angle.x)
        bullets.diry.push(angle.y)
        bullets.age.push(0)
        bullets.active.push(true)
    }
}

const removeBullet = (i: number) => {
    bullets.active[i] = false
    freePool.push(i)
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
