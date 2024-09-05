import { cam } from "./cam"
import { addRenderComp } from "./components/render"
import { HEIGHT, WIDTH } from "./const"

let unloadRender: () => void

export const unloadFloor = () => {
    unloadRender()
}

const UNIQUE_PARTICLES = 3
const INNER_DISTANCE = 100

export const loadFloor = () => {
    unloadRender = addRenderComp((ctx) => {
        ctx.fillStyle = "#7b7243"
        ctx.fillRect(0, 0, WIDTH, HEIGHT)
        for (let i = 0; i < UNIQUE_PARTICLES; i++) {
            for (let j = 0; j < UNIQUE_PARTICLES; j++) {
                const xpos = i * INNER_DISTANCE - cam.x
                const ypos = j * INNER_DISTANCE - cam.y
                ctx.fillStyle = "#4e584a"
                ctx.fillRect(
                    xpos > 0 ? xpos % WIDTH : WIDTH + (xpos % WIDTH),
                    ypos > 0 ? ypos % HEIGHT : HEIGHT + (ypos % HEIGHT),
                    10,
                    10,
                )
            }
        }
    })
}
