import { CompInitRun } from "./components/init"
import { setupKeyListener } from "./components/input"
import { CompPhysicsRun } from "./components/physics"
import { CompRenderRun } from "./components/render"
import { CompResizeRun } from "./components/resize"
import { HEIGHT, WIDTH } from "./const"
import { createCtx, resize } from "./core/canvas"
import { loop } from "./core/loop"
import { setupPP } from "./core/post-process"

import "./hero"

const canvas2d = document.createElement("canvas")
const canvas = document.getElementById("c") as HTMLCanvasElement
const portraitNote = document.getElementById("d")!
const ctx = createCtx(canvas2d, WIDTH, HEIGHT)
const keys = setupKeyListener(canvas2d, false)
setupPP(canvas, WIDTH, HEIGHT)

window.onresize = () => {
    resize(canvas2d, WIDTH, HEIGHT)
    resize(canvas, WIDTH, HEIGHT)
    // display note if device is in portrait
    portraitNote.style.display = innerWidth < innerHeight ? "block" : "none"
    CompResizeRun(WIDTH, HEIGHT)
}

CompInitRun(ctx)

loop(
    (dt) => {
        CompPhysicsRun(dt, keys)
    },
    () => {
        CompRenderRun(ctx, WIDTH, HEIGHT)
    },
)
