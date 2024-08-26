import { addRenderComp } from "./components/render"
import {
    JOYSTICK_SIZE,
    JOYSTICK_THUMB_SIZE,
    UI_BAR_HEIGHT,
    UI_BAR_WIDTH,
    UI_BAR_X,
    UI_HEALTH_BAR_Y,
    UI_XP_BAR_Y,
} from "./const"
import { stats } from "./stat"

let unloadRender: () => void

export const unloadHud = () => {
    unloadRender()
}

export const loadHud = () => {
    unloadRender = addRenderComp((ctx, width, height, keys) => {
        ctx.fillStyle = "red"
        ctx.fillRect(
            UI_BAR_X,
            UI_HEALTH_BAR_Y,
            UI_BAR_WIDTH * (stats.health / stats.maxHealth),
            UI_BAR_HEIGHT,
        )
        ctx.strokeRect(UI_BAR_X, UI_HEALTH_BAR_Y, UI_BAR_WIDTH, UI_BAR_HEIGHT)
        ctx.fillStyle = "blue"
        ctx.fillRect(
            UI_BAR_X,
            UI_XP_BAR_Y,
            UI_BAR_WIDTH * (stats.xp / stats.levelXp),
            UI_BAR_HEIGHT,
        )
        ctx.strokeRect(UI_BAR_X, UI_XP_BAR_Y, UI_BAR_WIDTH, UI_BAR_HEIGHT)

        if (keys.touchStartPos) {
            ctx.fillStyle = "#FFF7"
            ctx.beginPath()
            ctx.arc(
                keys.touchStartPos.x * width,
                keys.touchStartPos.y * height,
                JOYSTICK_SIZE,
                0,
                Math.PI * 2,
            )
            ctx.closePath()
            ctx.fill()

            ctx.beginPath()
            ctx.arc(
                (keys.touchStartPos.x + keys.clampedTouchPos.x) * width,
                (keys.touchStartPos.y + keys.clampedTouchPos.y) * height,
                JOYSTICK_THUMB_SIZE,
                0,
                Math.PI * 2,
            )
            ctx.closePath()
            ctx.fill()
        }
    })
}
