import { loadAssets } from "./asset"
import { CompPhysicsRun } from "./components/physics"
import { CompRenderRun } from "./components/render"
import { HEIGHT, WIDTH } from "./const"
import { resize } from "./core/canvas"
import { initInput } from "./core/input"
import { loop } from "./core/loop"
import { setupPostProcess } from "./core/post-process"
import { loadIntro } from "./scene"
import { loadSounds } from "./sound"
import { renderUI, updateUI } from "./ui"

const canvas = document.getElementById("c") as HTMLCanvasElement
const offscreenCanvas = document.createElement("canvas")

const ctx = offscreenCanvas.getContext("2d")!
const processInput = initInput(canvas, WIDTH, HEIGHT)
const postProcess = setupPostProcess(canvas, WIDTH * 4, HEIGHT * 4)
loadSounds()
;(async () => {
    const assets = await loadAssets()
    // display note if device is in portrait
    if (innerWidth < innerHeight) {
        alert("for best experience use landscape mode")
    }
    loadIntro()
    ;(onresize = () => {
        resize(offscreenCanvas, WIDTH, HEIGHT)
        resize(canvas, WIDTH * 4, HEIGHT * 4)
    })()

    loop(
        (dt) => {
            processInput()
            CompPhysicsRun(dt)
            // we have separate methods for UI because it draws above all entities
            updateUI(dt)
        },
        () => {
            CompRenderRun(ctx, assets)
            renderUI(ctx, assets)
            postProcess(ctx)
        },
    )
})()
