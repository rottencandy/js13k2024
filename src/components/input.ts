import { normalize, Vec2 } from "src/core/math"
import { addPhysicsComp } from "./physics"

export type WatchedKeys = {
    dir: Vec2
    space: boolean
    esc: boolean
    clicked: boolean
    ptrX: number
    ptrY: number
}

/**
 * Initialize onkey listeners
 */
export const setupKeyListener = (canvas: HTMLCanvasElement) => {
    let dirty = false
    let gamepad: Gamepad | undefined = undefined
    const mvt = {
        up: false,
        lf: false,
        dn: false,
        rt: false,
    }
    const keys: WatchedKeys = {
        dir: {
            x: 0,
            y: 0,
        },
        space: false,
        esc: false,
        clicked: false,
        ptrX: 0,
        ptrY: 0,
    }
    const setKeyState =
        (pressed: boolean) =>
        ({ key }: { key: string }) => {
            dirty = true
            switch (key) {
                case "ArrowUp":
                case "w":
                case "z":
                    mvt.up = pressed
                    break
                case "ArrowDown":
                case "s":
                    mvt.dn = pressed
                    break
                case "ArrowLeft":
                case "a":
                case "q":
                    mvt.lf = pressed
                    break
                case "ArrowRight":
                case "d":
                    mvt.rt = pressed
                    break
                case "Escape":
                    keys.esc = pressed
                    break
                case " ":
                    keys.space = pressed
            }
        }

    onkeydown = setKeyState(true)
    onkeyup = setKeyState(false)

    ongamepadconnected = (e) => {
        // only consider gamepads with analog sticks
        if (e.gamepad.axes.length > 1) {
            gamepad = e.gamepad
        }
    }
    ongamepaddisconnected = () => {
        gamepad = undefined
    }

    canvas.onpointerdown = () => (keys.clicked = true)
    canvas.onpointerup = () => (keys.clicked = false)
    canvas.onpointermove = (e) => {
        keys.ptrX = e.offsetX / canvas.clientWidth
        keys.ptrY = e.offsetY / canvas.clientHeight
    }

    canvas.ontouchstart =
        canvas.ontouchmove =
        canvas.ontouchend =
        canvas.ontouchcancel =
            (e) => {
                e.preventDefault()
                if (keys.clicked) {
                    const offset = canvas.getBoundingClientRect()
                    const touch = e.touches[0]
                    keys.ptrX =
                        (touch.clientX - offset.left) / canvas.clientWidth
                    keys.ptrY =
                        (touch.clientY - offset.top) / canvas.clientHeight
                }
            }

    addPhysicsComp(() => {
        if (dirty) {
            keys.dir.x = keys.dir.y = 0
            keys.dir.x += mvt.rt ? 1 : 0
            keys.dir.x -= mvt.lf ? 1 : 0
            keys.dir.y -= mvt.up ? 1 : 0
            keys.dir.y += mvt.dn ? 1 : 0
            normalize(keys.dir)
            dirty = false
        }
        if (gamepad) {
            keys.dir.x = gamepad.axes[0]
            keys.dir.y = gamepad.axes[1]
        }
    })

    return keys
}
