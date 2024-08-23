import { CTX } from "./core/canvas"
import { renderFont } from "./core/font"
import { keys } from "./core/input"
import { scene, Scene, startGame } from "./scene"

export const updateUI = (dt: number) => {
    switch (scene) {
        case Scene.title:
            if (keys.btnp.clk) {
                startGame()
            }
            break
        case Scene.gameplay:
            break
        case Scene.gameover:
            if (keys.btnp.clk) {
                startGame()
            }
            break
    }
}

export const renderUI = (ctx: CTX) => {
    switch (scene) {
        case Scene.title:
            ctx.fillStyle = "pink"
            renderFont(ctx, "TEST", 10, 100, 200)
            break
        case Scene.gameplay:
            break
        case Scene.gameover:
            ctx.fillStyle = "pink"
            renderFont(ctx, "GAME OVER", 10, 100, 200)
            break
    }
}
