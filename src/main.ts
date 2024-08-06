import { setupKeyListener } from "./components/input"
import { CompPhysicsRun } from "./components/physics"
import { CompRenderRun } from "./components/render"
import { createCtx, resize } from "./core/canvas"
import { loop } from "./core/loop"

import './hero'

const canvas = document.getElementById("c") as HTMLCanvasElement
const width = 1280
const height = 720
const ctx = createCtx(canvas, width, height)
const keys = setupKeyListener(canvas, false)
window.onresize = () => {
    resize(canvas, width, height)
}

loop(
    (dt) => {
        CompPhysicsRun(dt, keys)
    },
    () => {
        CompRenderRun(ctx, width, height)
    },
)
