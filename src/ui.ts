import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import { DEBUG, HEIGHT, WIDTH } from "./const"
import { renderFont } from "./core/font"
import { startGame } from "./scene"

let unloadStartPhysics: () => void
let unloadStartRender: () => void
let unloadGameOverPhysics: () => void
let unloadGameOverRender: () => void

export const unloadStartScreen = () => {
    unloadStartRender()
    unloadStartPhysics()
}

export const unloadGameOverScreen = () => {
    unloadGameOverRender()
    unloadGameOverPhysics()
}

export const loadStartScreen = () => {
    let x = 0,
        y = 0
    unloadStartPhysics = addPhysicsComp((dt, keys) => {
        x = keys.ptrX * WIDTH
        y = keys.ptrY * HEIGHT

        if (keys.clicked) {
            startGame()
        }
    })

    unloadStartRender = addRenderComp((ctx) => {
        ctx.fillStyle = "pink"
        renderFont(ctx, "TEST", 5, 50, 200)
        if (DEBUG) {
            ctx.fillRect(x, y, 10, 10)
        }
    })
}

export const loadGameOverScreen = () => {
    unloadGameOverPhysics = addPhysicsComp((dt, keys) => {
    })

    unloadGameOverRender = addRenderComp((ctx) => {
    })
}
