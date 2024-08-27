import { CompPhysicsRun } from "./components/physics"
import { CompRenderRun } from "./components/render"
import { HEIGHT, WIDTH } from "./const"
import { createCtx, resize } from "./core/canvas"
import { initInput } from "./core/input"
import { loop } from "./core/loop"
import { setupPostProcess } from "./core/post-process"
import { loadTitle } from "./scene"
import { renderUI, updateUI } from "./ui"

const canvas = document.getElementById("c") as HTMLCanvasElement
const offscreenCanvas = document.createElement("canvas")
const portraitNote = document.getElementById("d")!

const ctx = createCtx(offscreenCanvas, WIDTH, HEIGHT)
const processInput = initInput(canvas, WIDTH, HEIGHT)
const postProcess = setupPostProcess(canvas, WIDTH, HEIGHT)
loadTitle()
;(onresize = () => {
    resize(offscreenCanvas, WIDTH, HEIGHT)
    resize(canvas, WIDTH, HEIGHT)
    // display note if device is in portrait
    portraitNote.style.display = innerWidth < innerHeight ? "block" : "none"
})()

loop(
    (dt) => {
        processInput()
        CompPhysicsRun(dt)
        // we have separate methods for UI because it draws above all entities
        updateUI()
    },
    () => {
        CompRenderRun(ctx, WIDTH, HEIGHT)
        renderUI(ctx)
        postProcess(ctx)
    },
)
