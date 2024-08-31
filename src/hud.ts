import { addRenderComp } from "./components/render"
import {
    HEIGHT,
    JOYSTICK_SIZE,
    JOYSTICK_THUMB_SIZE,
    UI_BAR_HEIGHT,
    UI_BAR_WIDTH,
    UI_BAR_X,
    UI_HEALTH_BAR_Y,
    UI_XP_BAR_Y,
    WIDTH,
} from "./const"
import { keys } from "./core/input"
import { stats } from "./stat"

let unloadRender: () => void

export const unloadHud = () => {
    unloadRender()
}

export const loadHud = () => {
    unloadRender = addRenderComp((ctx) => {
        ctx.strokeStyle = "#212123"
        ctx.fillStyle = "#b45252"
        ctx.fillRect(
            UI_BAR_X,
            UI_HEALTH_BAR_Y,
            UI_BAR_WIDTH * (stats.health / stats.maxHealth),
            UI_BAR_HEIGHT,
        )
        ctx.strokeRect(UI_BAR_X, UI_HEALTH_BAR_Y, UI_BAR_WIDTH, UI_BAR_HEIGHT)
        ctx.fillStyle = "#4b80ca"
        ctx.fillRect(
            UI_BAR_X,
            UI_XP_BAR_Y,
            UI_BAR_WIDTH * (stats.xp / stats.levelXp),
            UI_BAR_HEIGHT,
        )
        ctx.strokeRect(UI_BAR_X, UI_XP_BAR_Y, UI_BAR_WIDTH, UI_BAR_HEIGHT)

        if (keys.touchStartPos) {
            ctx.fillStyle = "#ffe7"
            ctx.beginPath()
            ctx.arc(
                keys.touchStartPos.x * WIDTH,
                keys.touchStartPos.y * HEIGHT,
                JOYSTICK_SIZE,
                0,
                Math.PI * 2,
            )
            ctx.closePath()
            ctx.fill()

            ctx.beginPath()
            ctx.arc(
                (keys.touchStartPos.x + keys.clampedTouchPos.x) * WIDTH,
                (keys.touchStartPos.y + keys.clampedTouchPos.y) * HEIGHT,
                JOYSTICK_THUMB_SIZE,
                0,
                Math.PI * 2,
            )
            ctx.closePath()
            ctx.fill()
        }
    })
}
