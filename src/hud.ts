import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import {
    BLACK1,
    BLUE,
    HEIGHT,
    JOYSTICK_SIZE,
    JOYSTICK_THUMB_SIZE,
    RED,
    UI_BAR_HEIGHT,
    UI_BAR_WIDTH,
    UI_BAR_X,
    UI_BAR_Y,
    WIDTH,
} from "./const"
import { renderFontTex } from "./core/font"
import { keys } from "./core/input"
import { stats } from "./stat"

let unloadPhysics: () => void
let unloadRender: () => void

export const unloadHud = () => {
    unloadPhysics()
    unloadRender()
}

const element_offset = 8

export const loadHud = () => {
    unloadPhysics = addPhysicsComp((dt) => {
        // this may not be the best place to update this
        stats.time += dt / 1e3
    })

    unloadRender = addRenderComp((ctx, assets) => {
        // bars fill
        ctx.fillStyle = RED
        ctx.fillRect(
            UI_BAR_X + element_offset,
            UI_BAR_Y,
            ~~(UI_BAR_WIDTH * (stats.health / stats.maxHealth)),
            UI_BAR_HEIGHT,
        )
        ctx.fillStyle = BLUE
        ctx.fillRect(
            UI_BAR_X + element_offset,
            UI_BAR_Y + UI_BAR_HEIGHT * 2,
            ~~(UI_BAR_WIDTH * (stats.xp / stats.levelXp)),
            UI_BAR_HEIGHT,
        )

        // bars border
        ctx.strokeStyle = BLACK1
        ctx.strokeRect(
            UI_BAR_X + element_offset,
            UI_BAR_Y,
            UI_BAR_WIDTH,
            UI_BAR_HEIGHT,
        )
        ctx.strokeRect(
            UI_BAR_X + element_offset,
            UI_BAR_Y + UI_BAR_HEIGHT * 2,
            UI_BAR_WIDTH,
            UI_BAR_HEIGHT,
        )
        // bars logo
        ctx.drawImage(assets.eHeart, UI_BAR_X - 2, UI_BAR_Y - 2, 8, 8)
        ctx.drawImage(
            assets.eXp,
            UI_BAR_X - 2,
            ~~(UI_BAR_Y + UI_BAR_HEIGHT * 2) - 2,
            8,
            8,
        )

        // time
        const abstime = ~~stats.time
        const mins = ~~(abstime / 60)
        const secs = abstime % 60
        renderFontTex(ctx, mins + ":" + secs, ~~(WIDTH / 7) * 6, UI_BAR_Y)

        // virtual joystick
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
