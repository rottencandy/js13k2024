import { addRenderComp } from "./components/render"
import { WIDTH } from "./const"
import { health, maxHealth } from "./hero"

const healthBarHeight = 20
const healthBarWidth = 1000
const barx = (WIDTH - healthBarWidth) / 2
const bary = 20

addRenderComp((ctx) => {
    ctx.fillStyle = "blue"
    ctx.fillRect(
        barx,
        bary,
        healthBarWidth * (health / maxHealth),
        healthBarHeight,
    )
    ctx.strokeRect(barx, bary, healthBarWidth, healthBarHeight)
})
