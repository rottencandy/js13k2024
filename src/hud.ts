import { addRenderComp } from "./components/render"
import { WIDTH } from "./const"
import { health, maxHealth } from "./hero"

const healthBarHeight = 20
const healthBarWidth = 1000
const barx = (WIDTH - healthBarWidth) / 2
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
            healthBarWidth * (health / maxHealth),
            healthBarHeight,
        )
        ctx.strokeRect(barx, bary, healthBarWidth, healthBarHeight)

        if (keys.touchStartPos) {
            ctx.fillStyle = "#FFF7"
            ctx.beginPath()
            ctx.arc(
                keys.touchStartPos.x * width,
                keys.touchStartPos.y * height,
                150,
                0,
                Math.PI * 2,
            )
            ctx.closePath()
            ctx.fill()

            ctx.beginPath()
            ctx.arc(
                (keys.touchStartPos.x + keys.clampedTouchPos.x) * width,
                (keys.touchStartPos.y + keys.clampedTouchPos.y) * height,
                50,
                0,
                Math.PI * 2,
            )
            ctx.closePath()
            ctx.fill()
        }
    })
}
