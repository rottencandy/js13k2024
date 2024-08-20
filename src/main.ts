import { setupKeyListener } from "./components/input"
import { CompPhysicsRun } from "./components/physics"
import { CompRenderRun } from "./components/render"
import { CompResizeRun } from "./components/resize"
import { HEIGHT, WIDTH } from "./const"
import { createCtx, resize } from "./core/canvas"
import { loop } from "./core/loop"
import { setupPostProcess } from "./core/post-process"
import { $ } from "./core/ui"
import { loadTitle } from "./scene"

const canvas = document.getElementById("c") as HTMLCanvasElement
const offscreenCanvas = $("canvas")
const portraitNote = document.getElementById("d")!

const ctx = createCtx(offscreenCanvas, WIDTH, HEIGHT)
const keys = setupKeyListener(canvas, WIDTH, HEIGHT)
loadTitle()
const postProcess = setupPostProcess(canvas, WIDTH, HEIGHT)

;(onresize = () => {
    resize(offscreenCanvas, WIDTH, HEIGHT)
    resize(canvas, WIDTH, HEIGHT)
    // display note if device is in portrait
    portraitNote.style.display = innerWidth < innerHeight ? "block" : "none"
    CompResizeRun(WIDTH, HEIGHT)
})()

loop(
    (dt) => {
        CompPhysicsRun(dt, keys)
    },
    () => {
        CompRenderRun(ctx, WIDTH, HEIGHT, keys)
        postProcess(ctx)
    },
)
