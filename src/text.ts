import { cam } from "./cam"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import { UI_TEXT_DURATION } from "./const"
import { renderFontTex } from "./core/font"

const entities = {
    x: [] as number[],
    y: [] as number[],
    dur: [] as number[],
    str: [] as number[],
    active: [] as boolean[],
}

let freePool: number[] = []

let unloadPhysics: () => void
let unloadRender: () => void

export const unloadText = () => {
    unloadPhysics()
    unloadRender()
}

export const loadText = () => {
    unloadPhysics = addPhysicsComp((dt) => {
        iterEnts((id, x, y, str, dur) => {
            entities.dur[id] += dt
            if (entities.dur[id] >= UI_TEXT_DURATION) {
                entities.active[id] = false
            }
        })
    })

    unloadRender = addRenderComp((ctx) => {
        iterEnts((_id, x, y, str, dur) => {
            ctx.fillStyle = "white"
            renderFontTex(ctx, str + "", x - cam.x, y - cam.y - dur / 10)
        })
    })
}

const iterEnts = (
    fn: (
        id: number,
        x: number,
        y: number,
        str: number,
        dur: number,
    ) => boolean | void,
) => {
    for (let i = 0; i < entities.x.length; i++) {
        if (entities.active[i]) {
            const end = fn(
                i,
                entities.x[i],
                entities.y[i],
                entities.str[i],
                entities.dur[i],
            )
            if (end) {
                break
            }
        }
    }
}

export const spawnFloatingText = (str: number, x: number, y: number) => {
    if (freePool.length > 0) {
        const i = freePool.pop()!
        entities.x[i] = x
        entities.y[i] = y
        entities.dur[i] = 0
        entities.str[i] = str
        entities.active[i] = true
        return i
    }
    entities.x.push(x)
    entities.y.push(y)
    entities.dur.push(0)
    entities.str.push(str)
    return entities.active.push(true)
}
