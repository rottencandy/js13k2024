import { clamp, limitMagnitude, Vec2 } from "./math"
import { addPhysicsComp } from "../components/physics"

export type Keys = {
    dir: Vec2
    space: boolean
    esc: boolean
    clicked: boolean
    ptr: Vec2
    /** Whether virtual joystick controls & visuals are enabled */
    virtualCtrl: boolean
    /** Position when touch starts, only set when virtualCtrl is used and when
     * touch is happening, range: [0, 1] */
    touchStartPos: Vec2 | undefined
    /** Clamped position when dragging virtual joystick, range: [0, 1] */
    clampedTouchPos: Vec2
}

const JOYSTICK_SIZE = 150

/**
 * Initialize onkey listeners
 */
export const setupKeyListener = (
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
) => {
    let dirty = false
    let gamepad: Gamepad | undefined = undefined
    const dirPressed = {
        up: false,
        lf: false,
        dn: false,
        rt: false,
    }

    const keys: Keys = {
        dir: {
            x: 0,
            y: 0,
        },
        space: false,
        esc: false,
        clicked: false,
        ptr: { x: 0, y: 0 },
        virtualCtrl: true,
        touchStartPos: undefined,
        clampedTouchPos: { x: 0, y: 0 },
    }
    const setKeyState =
        (pressed: boolean) =>
        ({ key }: { key: string }) => {
            dirty = true
            switch (key) {
                case "ArrowUp":
                case "w":
                case "z":
                    dirPressed.up = pressed
                    break
                case "ArrowDown":
                case "s":
                    dirPressed.dn = pressed
                    break
                case "ArrowLeft":
                case "a":
                case "q":
                    dirPressed.lf = pressed
                    break
                case "ArrowRight":
                case "d":
                    dirPressed.rt = pressed
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
        keys.ptr.x = e.offsetX / canvas.clientWidth
        keys.ptr.y = e.offsetY / canvas.clientHeight
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
                    keys.ptr.x =
                        (touch.clientX - offset.left) / canvas.clientWidth
                    keys.ptr.y =
                        (touch.clientY - offset.top) / canvas.clientHeight
                }
            }

    addPhysicsComp(() => {
        if (dirty) {
            keys.dir.x = keys.dir.y = 0
            keys.dir.x += dirPressed.rt ? 1 : 0
            keys.dir.x -= dirPressed.lf ? 1 : 0
            keys.dir.y -= dirPressed.up ? 1 : 0
            keys.dir.y += dirPressed.dn ? 1 : 0
            limitMagnitude(keys.dir)
            dirty = false
        }

        if (gamepad) {
            keys.dir.x = gamepad.axes[0]
            keys.dir.y = gamepad.axes[1]
        }

        if (keys.virtualCtrl) {
            if (keys.clicked) {
                if (keys.touchStartPos) {
                    const maxWidth = JOYSTICK_SIZE / width
                    const maxHeight = JOYSTICK_SIZE / height
                    keys.clampedTouchPos.x = clamp(
                        keys.ptr.x - keys.touchStartPos.x,
                        -maxWidth,
                        maxWidth,
                    )
                    keys.clampedTouchPos.y = clamp(
                        keys.ptr.y - keys.touchStartPos.y,
                        -maxHeight,
                        maxHeight,
                    )
                    keys.dir.x = keys.clampedTouchPos.x / maxWidth
                    keys.dir.y = keys.clampedTouchPos.y / maxHeight
                    limitMagnitude(keys.dir)
                } else {
                    keys.touchStartPos = {
                        x: keys.ptr.x,
                        y: keys.ptr.y,
                    }
                }
            } else {
                if (keys.touchStartPos) {
                    keys.touchStartPos = undefined
                    keys.dir.x = 0
                    keys.dir.y = 0
                }
            }
        }
    })

    return keys
}
