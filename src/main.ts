import { CompPhysicsRun } from "./components/physics"
import { CompRenderRun } from "./components/render"
import { HEIGHT, WIDTH } from "./const"
import { createCtx, resize } from "./core/canvas"
import { setupKeyListener } from "./core/input"
import { loop } from "./core/loop"
import { setupPostProcess } from "./core/post-process"
import { $ } from "./core/ui"
import { loadTitle } from "./scene"
import { renderUI, updateUI } from "./ui"

const canvas = document.getElementById("c") as HTMLCanvasElement
const offscreenCanvas = $("canvas")
const portraitNote = document.getElementById("d")!

const ctx = createCtx(offscreenCanvas, WIDTH, HEIGHT)
const keys = setupKeyListener(canvas, WIDTH, HEIGHT)
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
        CompPhysicsRun(dt, keys)
        // we have separate methods for UI because it draws above all entities
        updateUI(dt, keys)
    },
    () => {
        CompRenderRun(ctx, WIDTH, HEIGHT, keys)
        renderUI(ctx)
        postProcess(ctx)
    },
)
