import { DEBUG, HEIGHT, WIDTH } from "./const"
import { type CTX } from "./core/canvas"
import { renderFont } from "./core/font"
import { keys } from "./core/input"
import { pointInRect } from "./core/math"
import { resumeGame, scene, Scene, startGame } from "./scene"

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
            if (
                DEBUG &&
                pointInRect(keys.ptr.x * WIDTH, keys.ptr.y * HEIGHT, x, y, w, h)
            ) {
                ctx.fillStyle = "black"
            }
            ctx.fillRect(x, y, w, h)
        },
    }
}


const selectPowerup = (power: 1 | 2 | 3) => () => {
    resumeGame()
}

const MENU_FONT_SIZE = 5

const startBtn = btn(190, 180, 120, 60, startGame)
const powerup1btn = btn(100, 200, 50, 50, selectPowerup(1))
const powerup2btn = btn(200, 200, 50, 50, selectPowerup(2))
const powerup3btn = btn(300, 200, 50, 50, selectPowerup(3))

export const updateUI = () => {
    switch (scene) {
        case Scene.title:
            startBtn.update()
            break
        case Scene.powerup:
            powerup1btn.update()
            powerup2btn.update()
            powerup3btn.update()
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
            startBtn.render(ctx)
            ctx.fillStyle = "pink"
            renderFont(ctx, "TITLE", MENU_FONT_SIZE, 100, 100)
            renderFont(ctx, "START", MENU_FONT_SIZE, 200, 200)
            break
        // lack of break in this case is intentional
        case Scene.powerup:
            ctx.fillStyle = "pink"
            ctx.fillRect(0, HEIGHT / 3, WIDTH, HEIGHT / 3)
            ctx.fillStyle = "white"
            renderFont(ctx, "SELECT POWERUP", MENU_FONT_SIZE, 100, 100)
            ctx.fillStyle = "red"
            powerup1btn.render(ctx)
            ctx.fillStyle = "green"
            powerup2btn.render(ctx)
            ctx.fillStyle = "blue"
            powerup3btn.render(ctx)
        case Scene.gameplay:
            break
        case Scene.gameover:
            ctx.fillStyle = "pink"
            renderFont(ctx, "GAME OVER", MENU_FONT_SIZE, 100, 200)
            break
    }
}
