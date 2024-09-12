import { Assets } from "./asset"
import {
    BLACK0,
    BLACK1,
    DDGREEN,
    DGREEN,
    HEIGHT,
    MENU_FONT_SIZE,
    RED,
    UI_TRANSITION_DURATION,
    WHITE,
    WIDTH,
} from "./const"
import { type CTX } from "./core/canvas"
import { renderFont, renderFontTex } from "./core/font"
import { keys } from "./core/input"
import { ticker } from "./core/interpolation"
import { clamp, lerp, pointInRect } from "./core/math"
import { obsListen } from "./core/observer"
import { Observable } from "./observables"
import { loadTitle, resumeGame, Scene, startGame } from "./scene"
import {
    Powerup,
    powerupSprite,
    powerupText,
    randomPowerups,
    stats,
    usePowerup,
} from "./stat"

type PowerupId = 0 | 1 | 2
let hoveredPowerup: PowerupId = 0
const powerups: Powerup[] = []
const selectPowerup = (id: PowerupId) => () => {
    usePowerup(powerups[id])
    resumeGame()
}

const transition = ticker(UI_TRANSITION_DURATION)

const halfSecond = ticker(500)
// this ticker is only used once, no need to bother with resetting
const introTime = ticker(4e3, false)
let buttonBlink = false

let runTransition = false
let scene: Scene
let prevScene: Scene
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
        powerups.splice(0)
        powerups.push(...randomPowerups())
    }
    prevScene = scene
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
        x,
        y,
        w,
        h,
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
        click: onClick,
        //render: (ctx: CTX) => {
        //    //if (DEBUG && obj.hovered) {
        //    //    ctx.fillStyle = BLACK1
        //    //}
        //    ctx.fillRect(x, y, w, h)
        //},
    }
    return obj
}

const BTN_SIZE = 32
const startBtn = btn(
    ~~(WIDTH / 3) + 20,
    ~~(HEIGHT / 3) * 2,
    MENU_FONT_SIZE * 4 * 6,
    BTN_SIZE,
    startGame,
)
const powerup1btn = btn(
    ~~(WIDTH / 7) * 1,
    ~~(HEIGHT / 2) - 10,
    BTN_SIZE,
    BTN_SIZE,
    selectPowerup(0),
)
const powerup2btn = btn(
    ~~(WIDTH / 7) * 3,
    ~~(HEIGHT / 2) - 10,
    BTN_SIZE,
    BTN_SIZE,
    selectPowerup(1),
)
const powerup3btn = btn(
    ~~(WIDTH / 7) * 5,
    ~~(HEIGHT / 2) - 10,
    BTN_SIZE,
    BTN_SIZE,
    selectPowerup(2),
)

export const updateUI = (dt: number) => {
    if (halfSecond.tick(dt)) {
        buttonBlink = !buttonBlink
    }
    switch (scene) {
        case Scene.intro:
            if (introTime.tick(dt)) {
                loadTitle()
            }
            break
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
            if (keys.btnp.spc) {
                if (hoveredPowerup === 0) {
                    powerup1btn.click()
                }
                if (hoveredPowerup === 1) {
                    powerup2btn.click()
                }
                if (hoveredPowerup === 2) {
                    powerup3btn.click()
                }
            }
            break
        case Scene.gameover:
            startBtn.update()
            break
    }
    if (runTransition && transition.tick(dt)) {
        runTransition = false
    }
}

export const renderUI = (ctx: CTX, assets: Assets) => {
    if (runTransition) {
        // normalized, 0 -> 1
        const norm = transition.ticks / UI_TRANSITION_DURATION
        switch (scene) {
            case Scene.gameplay:
                if (prevScene === Scene.title || prevScene === Scene.gameover) {
                    // 0 -> 1 -> 0
                    //const norm2 = norm * 2
                    //const lerpval = norm2 < 1 ? norm2 : 2 - norm2

                    // 1 -> 0
                    const lerpval = 1 - norm
                    ctx.fillStyle = "#000"
                    ctx.fillRect(0, 0, WIDTH, lerp(0, HEIGHT, lerpval))
                }
                break

            case Scene.powerup:
                ctx.fillStyle = BLACK0 + "77"
                ctx.fillRect(0, 0, WIDTH, HEIGHT)
                ctx.fillStyle = DDGREEN
                ctx.fillRect(
                    0,
                    HEIGHT / 3 - 8,
                    ~~(WIDTH * norm) + 32,
                    HEIGHT / 3,
                )
                ctx.fillStyle = DGREEN
                ctx.fillRect(0, HEIGHT / 3, ~~(WIDTH * norm), HEIGHT / 3)
                // we don't want to render buttons until transition is done
                return
        }
    }
    switch (scene) {
        case Scene.intro:
            ctx.fillStyle = WHITE
            renderFontTex(
                ctx,
                "XIICUR SURVIIVORS VERSION 1.0.0\nA JS13K 2024 GAME\nMADE BY SAUD WWW.SAUD.WTF\n\nLOADING...",
                20,
                20,
            )
            break

        // such a bespoke title rendering technique
        case Scene.title:
            ctx.fillStyle = BLACK0
            //startBtn.render(ctx)
            ctx.fillStyle = BLACK1
            renderFont(
                ctx,
                "XIICUR SURVIIVORS",
                MENU_FONT_SIZE,
                ~~(WIDTH / 5) + 2,
                ~~(HEIGHT / 3) + 2,
            )
            ctx.fillStyle = RED
            renderFont(
                ctx,
                "XII",
                MENU_FONT_SIZE,
                ~~(WIDTH / 5),
                ~~(HEIGHT / 3),
            )
            ctx.fillStyle = WHITE
            renderFont(
                ctx,
                "   CUR SURVI",
                MENU_FONT_SIZE,
                ~~(WIDTH / 5) + 15,
                ~~(HEIGHT / 3),
            )
            ctx.fillStyle = RED
            renderFont(
                ctx,
                "I",
                MENU_FONT_SIZE,
                ~~(WIDTH / 5) + 153,
                ~~(HEIGHT / 3),
            )
            ctx.fillStyle = WHITE
            renderFont(
                ctx,
                "VORS",
                MENU_FONT_SIZE,
                ~~(WIDTH / 5) + 165,
                ~~(HEIGHT / 3),
            )

            if (buttonBlink) {
                renderFont(
                    ctx,
                    "START",
                    MENU_FONT_SIZE,
                    startBtn.x + 10,
                    startBtn.y + 10,
                )
            }
            renderFontTex(ctx, "BY SAUD", WIDTH / 2 + 110, HEIGHT - 10)
            break

        case Scene.powerup:
            // bg
            ctx.fillStyle = BLACK0 + "77"
            ctx.fillRect(0, 0, WIDTH, HEIGHT)
            ctx.fillStyle = DDGREEN
            ctx.fillRect(0, HEIGHT / 3 - 8, WIDTH, HEIGHT / 3)
            ctx.fillStyle = DGREEN
            ctx.fillRect(0, HEIGHT / 3, WIDTH, HEIGHT / 3)
            ctx.fillStyle = WHITE
            renderFont(
                ctx,
                "SELECT UPGRADE",
                MENU_FONT_SIZE,
                ~~(WIDTH / 7),
                ~~(HEIGHT / 7),
            )

            //if (DEBUG) {
            //    ctx.fillStyle = GREY
            //    powerup1btn.render(ctx)
            //    ctx.fillStyle = GREY
            //    powerup2btn.render(ctx)
            //    ctx.fillStyle = GREY
            //    powerup3btn.render(ctx)
            //}

            // icons
            ctx.imageSmoothingEnabled = false
            ctx.drawImage(
                assets.eBg,
                powerup1btn.x,
                powerup1btn.y,
                BTN_SIZE,
                BTN_SIZE,
            )
            ctx.drawImage(
                assets.eBg,
                powerup2btn.x,
                powerup2btn.y,
                BTN_SIZE,
                BTN_SIZE,
            )
            ctx.drawImage(
                assets.eBg,
                powerup3btn.x,
                powerup3btn.y,
                BTN_SIZE,
                BTN_SIZE,
            )
            ctx.drawImage(
                powerupSprite(powerups[0], assets),
                powerup1btn.x,
                powerup1btn.y,
                BTN_SIZE,
                BTN_SIZE,
            )
            ctx.drawImage(
                powerupSprite(powerups[1], assets),
                powerup2btn.x,
                powerup2btn.y,
                BTN_SIZE,
                BTN_SIZE,
            )
            ctx.drawImage(
                powerupSprite(powerups[2], assets),
                powerup3btn.x,
                powerup3btn.y,
                BTN_SIZE,
                BTN_SIZE,
            )

            // text
            ctx.fillStyle = WHITE
            renderFontTex(
                ctx,
                powerupText(powerups[0]),
                powerup1btn.x,
                powerup1btn.y + BTN_SIZE + 5,
            )
            renderFontTex(
                ctx,
                powerupText(powerups[1]),
                powerup2btn.x,
                powerup2btn.y + BTN_SIZE + 5,
            )
            renderFontTex(
                ctx,
                powerupText(powerups[2]),
                powerup3btn.x,
                powerup3btn.y + BTN_SIZE + 5,
            )

            // highlight selected
            ctx.strokeStyle = WHITE
            ctx.strokeRect(
                ~~(WIDTH / 7) * (hoveredPowerup * 2 + 1),
                powerup1btn.y,
                BTN_SIZE,
                BTN_SIZE,
            )
            ctx.drawImage(
                assets.eArrow,
                ~~(WIDTH / 7) * (hoveredPowerup * 2 + 1) + 6,
                powerup1btn.y + 48 + (buttonBlink ? 2 : 0),
                BTN_SIZE / 2,
                BTN_SIZE / 2,
            )
            break

        case Scene.gameplay:
            break

        case Scene.gameover:
            ctx.fillStyle = WHITE
            renderFont(
                ctx,
                stats.won ? "YOU WIN!" : "GAME OVER!",
                MENU_FONT_SIZE,
                ~~(WIDTH / 3) - 10,
                ~~(HEIGHT / 5),
            )
            if (stats.won) {
                renderFontTex(
                    ctx,
                    "YOU HAVE LIFTED THE CURSE!",
                    ~~(WIDTH / 3),
                    HEIGHT / 5 + 25,
                )
            }

            // time
            const abstime = ~~stats.time
            const mins = ~~(abstime / 60)
            const secs = abstime % 60
            renderFontTex(
                ctx,
                "TIME: " + mins + ":" + (secs < 10 ? "0" + secs : secs),
                ~~(WIDTH / 2) - 20,
                HEIGHT / 5 + 40,
            )
            renderFontTex(
                ctx,
                "SCORE: " + stats.score,
                ~~(WIDTH / 2) - 20,
                HEIGHT / 5 + 50,
            )
            if (buttonBlink) {
                renderFontTex(ctx, "RESTART", startBtn.x + 10, startBtn.y + 10)
            }
            break
    }
}
