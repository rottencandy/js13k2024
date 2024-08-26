import { DEBUG, HEIGHT, WIDTH } from "./const"
import { type CTX } from "./core/canvas"
import { renderFont } from "./core/font"
import { keys } from "./core/input"
import { pointInRect } from "./core/math"
import { resumeGame, scene, Scene, startGame } from "./scene"

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
            renderFont(ctx, "TITLE", 10, 100, 200)
            renderFont(ctx, "START", 10, 200, 400)
            break
        // lack of break in this case is intentional
        case Scene.powerup:
            ctx.fillStyle = "pink"
            ctx.fillRect(0, HEIGHT / 3, WIDTH, HEIGHT / 3)
            ctx.fillStyle = "white"
            renderFont(ctx, "SELECT POWERUP", 10, 100, 200)
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

const startBtn = btn(180, 380, 220, 90, startGame)
const powerup1btn = btn(200, 300, 100, 100, selectPowerup(1))
const powerup2btn = btn(600, 300, 100, 100, selectPowerup(2))
const powerup3btn = btn(1000, 300, 100, 100, selectPowerup(3))
