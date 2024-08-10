import { CompInitRun } from "./components/init"
import { setupKeyListener } from "./components/input"
import { CompPhysicsRun } from "./components/physics"
import { CompRenderRun } from "./components/render"
import { createCtx, resize } from "./core/canvas"
import { loop } from "./core/loop"
import { setupPP } from "./core/post-process"

import "./hero"

const canvas2d = document.createElement("canvas")
const canvas = document.getElementById("c") as HTMLCanvasElement
const portraitNote = document.getElementById("d")!
const width = 1280
const height = 720
const ctx = createCtx(canvas2d, width, height)
const keys = setupKeyListener(canvas2d, false)
setupPP(canvas, width, height)

window.onresize = () => {
    resize(canvas2d, width, height)
    resize(canvas, width, height)
    // display note if device is in portrait
    portraitNote.style.display = innerWidth < innerHeight ? "block" : "none"
}

CompInitRun(ctx)

loop(
    (dt) => {
        CompPhysicsRun(dt, keys)
    },
    () => {
        CompRenderRun(ctx, width, height)
    },
)
