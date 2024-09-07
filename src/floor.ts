import { cam } from "./cam"
import { addRenderComp } from "./components/render"
import { GREEN, HEIGHT, WIDTH } from "./const"

let unloadRender: () => void

export const unloadFloor = () => {
    unloadRender()
}

const rock0Pos = [
    [4, 18],
    [WIDTH / 2 + 21, 42],
    [WIDTH / 3, (HEIGHT / 4) * 3],
    [HEIGHT / 4, HEIGHT - 49],
]

const rock1Pos = [
    [WIDTH / 3 + 81, 28],
    [WIDTH / 8, (HEIGHT / 7) * 4],
]

export const loadFloor = () => {
    unloadRender = addRenderComp((ctx, assets) => {
        // base
        ctx.fillStyle = GREEN
        ctx.fillRect(0, 0, WIDTH, HEIGHT)

        // rocks
        for (let i = 0; i < rock0Pos.length; i++) {
            const xpos = ~~(rock0Pos[i][0] - cam.x)
            const ypos = ~~(rock0Pos[i][1] - cam.y)
            ctx.drawImage(
                assets.rocks[0],
                xpos > 0 ? xpos % WIDTH : WIDTH + (xpos % WIDTH),
                ypos > 0 ? ypos % HEIGHT : HEIGHT + (ypos % HEIGHT),
            )
        }
        for (let i = 0; i < rock1Pos.length; i++) {
            const xpos = ~~(rock1Pos[i][0] - cam.x)
            const ypos = ~~(rock1Pos[i][1] - cam.y)
            ctx.drawImage(
                assets.rocks[1],
                xpos > 0 ? xpos % WIDTH : WIDTH + (xpos % WIDTH),
                ypos > 0 ? ypos % HEIGHT : HEIGHT + (ypos % HEIGHT),
            )
        }
    })
}
