import { addRenderComp } from "./components/render"
import {
    INIT_MAX_HEALTH,
    JOYSTICK_SIZE,
    JOYSTICK_THUMB_SIZE,
    UI_HEALTHBAR_HEIGHT,
    UI_HEALTHBAR_WIDTH,
    WIDTH,
} from "./const"
import { stats } from "./stat"

const barx = (WIDTH - UI_HEALTHBAR_WIDTH) / 2
const bary = 20

let unloadRender: () => void

export const unloadHud = () => {
    unloadRender()
}

export const loadHud = () => {
    unloadRender = addRenderComp((ctx, width, height, keys) => {
        ctx.fillStyle = "blue"
        ctx.fillRect(
            barx,
            bary,
            UI_HEALTHBAR_WIDTH * (stats.health / INIT_MAX_HEALTH),
            UI_HEALTHBAR_HEIGHT,
        )
        ctx.strokeRect(barx, bary, UI_HEALTHBAR_WIDTH, UI_HEALTHBAR_HEIGHT)

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
