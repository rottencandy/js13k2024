import { CompPhysics } from "./components/physics"
import { CompRender } from "./components/render"

let x = 50,
    y = 50

CompPhysics.push((dt, keys) => {
    if (keys.left) {
        x -= 1 * dt
    }
    if (keys.right) {
        x += 1 * dt
    }
    if (keys.up) {
        y -= 1 * dt
    }
    if (keys.down) {
        y += 1 * dt
    }
})

CompRender.push((ctx) => {
    ctx.fillStyle = "red"
    ctx.fillRect(x, y, 100, 100)
})
