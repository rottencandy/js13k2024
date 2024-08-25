import { HEIGHT, WIDTH } from "./const"
import { type CTX } from "./core/canvas"
import { renderFont } from "./core/font"
import { keys } from "./core/input"
import { pointInRect } from "./core/math"
import { scene, Scene, startGame } from "./scene"

export const updateUI = (dt: number) => {
    switch (scene) {
        case Scene.title:
            startButton.update()
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
            ctx.fillStyle = "brown"
            startButton.render(ctx)
            ctx.fillStyle = "pink"
            renderFont(ctx, "TITLE", 10, 100, 200)
            renderFont(ctx, "START", 10, 200, 400)
            break
        case Scene.gameplay:
            break
        case Scene.gameover:
            ctx.fillStyle = "pink"
            renderFont(ctx, "GAME OVER", 10, 100, 200)
            break
    }
}

const btn = (
    x: number,
    y: number,
    w: number,
    h: number,
    onClick: () => void,
) => {
    return {
        update: () => {
            if (
                keys.btnp.clk &&
                pointInRect(keys.ptr.x * WIDTH, keys.ptr.y * HEIGHT, x, y, w, h)
            ) {
                onClick()
            }
        },
        render: (ctx: CTX) => {
            ctx.fillRect(x, y, w, h)
        },
    }
}

const startButton = btn(180, 380, 220, 90, startGame)
