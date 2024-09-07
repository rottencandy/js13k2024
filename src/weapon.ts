import { cam } from "./cam"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import { BULLET_SPEED, INIT_BULLET_FIRE_RATE, BULLET_AGE } from "./const"
import { ticker } from "./core/interpolation"
import { angleToVec } from "./core/math"
import { hero } from "./hero"
import { attackMob, isHittingMob, iterMobs, nearestMobPos } from "./mob"
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
const SIZE = 8
const bulletFireRate = ticker(INIT_BULLET_FIRE_RATE)

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
    bulletFireRate.clear()

    unloadPhysics = addPhysicsComp((dt) => {
        // fire bullets
        if (bulletFireRate.tick(dt)) {
            const aimedMob = nearestMobPos()
            if (aimedMob) {
                // translate mob pos to hero pos
                const xpos = aimedMob.x - hero.x
                const ypos = aimedMob.y - hero.y
                const angle = Math.atan2(xpos, ypos)
                fireBullet(hero.x, hero.y, angle)
            }
        }

        iterBullets((_x, _y, dirx, diry, id) => {
            // update existing bullets
            bullets.x[id] += dirx * BULLET_SPEED * dt
            bullets.y[id] += diry * BULLET_SPEED * dt
            bullets.age[id] += dt

            if (bullets.age[id] > BULLET_AGE) {
                removeBullet(id)
                return
            }

            // check for impact
            iterMobs((_mobx, _moby, mobid) => {
                if (
                    isHittingMob(
                        mobid,
                        bullets.x[id],
                        bullets.y[id],
                        SIZE,
                        SIZE,
                    )
                ) {
                    attackMob(mobid, stats.bulletDmg)
                    removeBullet(id)
                    return true
                }
            })
        })
    })

    unloadRender = addRenderComp((ctx, asset) => {
        iterBullets((x, y, _dirx, _diry, _id) => {
            ctx.drawImage(
                asset.bullet,
                ~~(x - cam.x),
                ~~(y - cam.y),
                SIZE,
                SIZE,
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

export const updateBulletFireRate = () => {
    bulletFireRate.interval(stats.bulletRate)
}
