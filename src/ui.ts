import { DEBUG, HEIGHT, UI_TRANSITION_DURATION, WIDTH } from "./const"
import { type CTX } from "./core/canvas"
import { renderFont } from "./core/font"
import { keys } from "./core/input"
import { ticker } from "./core/interpolation"
import { clamp, lerp, pointInRect } from "./core/math"
import { obsListen } from "./core/observer"
import { Observable } from "./observables"
import { resumeGame, Scene, startGame } from "./scene"

type PowerupId = 0 | 1 | 2
let hoveredPowerup: PowerupId = 0
const selectPowerup = (power: PowerupId) => () => {
    resumeGame()
}

const MENU_FONT_SIZE = 5

const transition = ticker(UI_TRANSITION_DURATION)
let runTransition = false
let scene: Scene
obsListen(Observable.scene, (next: Scene) => {
    if (
        next === Scene.powerup ||
        ((scene === Scene.title || scene === Scene.gameover) &&
            next === Scene.gameplay)
    ) {
        transition.reset()
        runTransition = true
    }
    scene = next
})

const btn = (
    x: number,
    y: number,
    w: number,
    h: number,
    onClick: () => void,
) => {
    const obj = {
        hovered: false,
        update: () => {
            if (runTransition) {
                return
            }
            obj.hovered = pointInRect(
                keys.ptr.x * WIDTH,
                keys.ptr.y * HEIGHT,
                x,
                y,
                w,
                h,
            )
            if (keys.btnp.clk && obj.hovered) {
                onClick()
            }
        },
        render: (ctx: CTX) => {
            if (DEBUG && obj.hovered) {
                ctx.fillStyle = "black"
            }
            ctx.fillRect(x, y, w, h)
        },
    }
    return obj
}

const startBtn = btn(190, 180, 120, 60, startGame)
const powerup1btn = btn(100, 200, 50, 50, selectPowerup(0))
const powerup2btn = btn(200, 200, 50, 50, selectPowerup(1))
const powerup3btn = btn(300, 200, 50, 50, selectPowerup(2))

export const updateUI = (dt: number) => {
    switch (scene) {
        case Scene.title:
            startBtn.update()
            break
        case Scene.powerup:
            powerup1btn.update()
            powerup2btn.update()
            powerup3btn.update()
            hoveredPowerup = powerup1btn.hovered
                ? 0
                : powerup2btn.hovered
                  ? 1
                  : powerup3btn.hovered
                    ? 2
                    : hoveredPowerup
            if (keys.btnp.rt) {
                hoveredPowerup = clamp(hoveredPowerup + 1, 0, 2) as PowerupId
            }
            if (keys.btnp.lf) {
                hoveredPowerup = clamp(hoveredPowerup - 1, 0, 2) as PowerupId
            }
            break
        case Scene.gameover:
            if (keys.btnp.clk) {
                startGame()
            }
            break
    }
    if (runTransition && transition.tick(dt)) {
        runTransition = false
    }
}

export const renderUI = (ctx: CTX) => {
    if (runTransition) {
        // normalized, 0 -> 1
        const norm = transition.ticks / UI_TRANSITION_DURATION
        switch (scene) {
            case Scene.gameplay:
                // 0 -> 1 -> 0
                const norm2 = norm * 2
                const lerpval = norm2 < 1 ? norm2 : 2 - norm2

                ctx.fillStyle = "#212123"
                ctx.beginPath()
                ctx.arc(
                    WIDTH / 2,
                    HEIGHT / 2,
                    lerp(0, WIDTH, lerpval),
                    0,
                    Math.PI * 2,
                )
                ctx.fill()
                break
            case Scene.powerup:
                ctx.fillStyle = "pink"
                ctx.beginPath()
                ctx.arc(
                    WIDTH / 2,
                    HEIGHT / 2,
                    lerp(0, WIDTH, norm),
                    0,
                    Math.PI * 2,
                )
                ctx.fill()
                // we don't want to render buttons until transition is done
                return
        }
    }
    switch (scene) {
        case Scene.title:
            ctx.fillStyle = "brown"
            startBtn.render(ctx)
            ctx.fillStyle = "pink"
            renderFont(ctx, "TITLE", MENU_FONT_SIZE, 100, 100)
            renderFont(ctx, "START", MENU_FONT_SIZE, 200, 200)
            break
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
            ctx.strokeStyle = "white"
            switch (hoveredPowerup) {
                case 0:
                    ctx.strokeRect(90, 190, 70, 70)
                    break
                case 1:
                    ctx.strokeRect(190, 190, 70, 70)
                    break
                case 2:
                    ctx.strokeRect(290, 190, 70, 70)
                    break
            }
            break
        case Scene.gameplay:
            break
        case Scene.gameover:
            ctx.fillStyle = "pink"
            renderFont(ctx, "GAME OVER", MENU_FONT_SIZE, 100, 200)
            break
    }
}
