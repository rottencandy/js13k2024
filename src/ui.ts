import {
    BLACK0,
    DEBUG,
    HEIGHT,
    MENU_FONT_SIZE,
    UI_TRANSITION_DURATION,
    WIDTH,
} from "./const"
import { type CTX } from "./core/canvas"
import { renderFont } from "./core/font"
import { keys } from "./core/input"
import { ticker } from "./core/interpolation"
import { clamp, lerp, pointInRect } from "./core/math"
import { obsListen } from "./core/observer"
import { Observable } from "./observables"
import { resumeGame, Scene, startGame } from "./scene"
import { Powerup, randomPowerup, usePowerup } from "./stat"

type PowerupId = 0 | 1 | 2
let hoveredPowerup: PowerupId = 0
const powerups: Powerup[] = []
const selectPowerup = (id: PowerupId) => () => {
    usePowerup(powerups[id])
    resumeGame()
}

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
    if (next === Scene.powerup) {
    }
    scene = next
    powerups.splice(0)
    powerups.push(randomPowerup())
    powerups.push(randomPowerup())
    powerups.push(randomPowerup())
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

const BTN_SIZE = 30
const startBtn = btn(
    ~~(WIDTH / 3) - 10,
    ~~(HEIGHT / 3) * 2 - 10,
    MENU_FONT_SIZE * 4 * 6,
    BTN_SIZE,
    startGame,
)
const powerup1btn = btn(
    ~~(WIDTH / 6) * 1,
    ~~(HEIGHT / 2),
    BTN_SIZE,
    BTN_SIZE,
    selectPowerup(0),
)
const powerup2btn = btn(
    ~~(WIDTH / 6) * 2,
    ~~(HEIGHT / 2),
    BTN_SIZE,
    BTN_SIZE,
    selectPowerup(1),
)
const powerup3btn = btn(
    ~~(WIDTH / 6) * 3,
    ~~(HEIGHT / 2),
    BTN_SIZE,
    BTN_SIZE,
    selectPowerup(2),
)

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
            renderFont(
                ctx,
                "TITLE",
                MENU_FONT_SIZE,
                ~~(WIDTH / 3),
                ~~(HEIGHT / 3),
            )
            renderFont(
                ctx,
                "START",
                MENU_FONT_SIZE,
                ~~(WIDTH / 3),
                ~~(HEIGHT / 3) * 2,
            )
            break
        case Scene.powerup:
            ctx.fillStyle = BLACK0 + "77"
            ctx.fillRect(0, 0, WIDTH, HEIGHT)
            ctx.fillStyle = "pink"
            ctx.fillRect(0, HEIGHT / 3, WIDTH, HEIGHT / 3)
            ctx.fillStyle = "white"
            renderFont(
                ctx,
                "SELECT POWERUP",
                MENU_FONT_SIZE,
                ~~(WIDTH / 5),
                ~~(HEIGHT / 4),
            )
            ctx.fillStyle = "red"
            powerup1btn.render(ctx)
            ctx.fillStyle = "green"
            powerup2btn.render(ctx)
            ctx.fillStyle = "blue"
            powerup3btn.render(ctx)
            ctx.strokeStyle = BLACK0
            ctx.strokeRect(
                ~~(WIDTH / 6) * (hoveredPowerup + 1) - 10,
                ~~(HEIGHT / 2) - 10,
                BTN_SIZE + 20,
                BTN_SIZE + 20,
            )
            break
        case Scene.gameplay:
            break
        case Scene.gameover:
            ctx.fillStyle = "pink"
            renderFont(
                ctx,
                "GAME OVER",
                MENU_FONT_SIZE,
                ~~(WIDTH / 3),
                ~~(HEIGHT / 3),
            )
            break
    }
}
