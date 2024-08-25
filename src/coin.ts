import { cam } from "./cam"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import { aabb, distance, limitMagnitude } from "./core/math"
import { playerCollisionRect, playerPos } from "./hero"
import { increaseXp, stats } from "./stat"

const entities = {
    x: [] as number[],
    y: [] as number[],
    active: [] as boolean[],
}

let freePool: number[] = []

const size = 10

// throwaway temporary variable for optimization
const _vec = { x: 0, y: 0 }

let unloadPhysics: () => void
let unloadRender: () => void

export const unloadCoin = () => {
    unloadPhysics()
    unloadRender()
}

export const loadCoin = () => {
    entities.x = []
    entities.y = []
    entities.active = []
    freePool = []

    unloadPhysics = addPhysicsComp((dt) => {
        iterCoins((x, y, id) => {
            // move to player if near
            const dist = distance(x, y, playerPos.x, playerPos.y)
            if (dist < stats.pickupRadius) {
                _vec.x = playerPos.x - x
                _vec.y = playerPos.y - y
                limitMagnitude(_vec)
                entities.x[id] += _vec.x * dt
                entities.y[id] += _vec.y * dt
            }

            // check if picked
            // todo: possible optimization: skip detection if player is invulnerable
            if (
                aabb(
                    // we use values from component because we just updated them above
                    entities.x[id],
                    entities.y[id],
                    size,
                    size,
                    playerPos.x,
                    playerPos.y,
                    playerCollisionRect,
                    playerCollisionRect,
                )
            ) {
                increaseXp()
                entities.active[id] = false
                freePool.push(id)
            }
        })
    })

    unloadRender = addRenderComp((ctx) => {
        iterCoins((x, y) => {
            ctx.fillStyle = "gold"
            ctx.fillRect(x - size / 2 - cam.x, y - size / 2 - cam.y, size, size)
        })
    })
}

const iterCoins = (
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

export const dropCoin = (x: number, y: number) => {
    if (freePool.length > 0) {
        const i = freePool.pop()!
        entities.x[i] = x
        entities.y[i] = y
        entities.active[i] = true
        return i
    }
    entities.x.push(x)
    entities.y.push(y)
    return entities.active.push(true)
}
