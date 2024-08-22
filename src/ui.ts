import { CTX } from "./core/canvas"
import { renderFont } from "./core/font"
import { Keys } from "./core/input"
import { scene, Scene, startGame } from "./scene"

export const updateUI = (dt: number, keys: Keys) => {
    switch (scene) {
        case Scene.title:
            if (keys.clicked) {
                startGame()
            }
            break
        case Scene.gameplay:
            break
        case Scene.gameover:
            if (keys.clicked) {
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