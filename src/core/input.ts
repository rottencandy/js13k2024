import { JOYSTICK_SIZE } from "../const"
import { clamp, limitMagnitude, type Vec2 } from "./math"

export type Keys = {
    /** Direction keys, normalized */
    dir: Vec2
    /** Pointer position, normalized */
    ptr: Vec2
    /** Position when touch starts, only set when touch feature is detected
     * touch is happening, range: [0, 1] */
    touchStartPos: Vec2 | undefined
    /** Clamped position when dragging virtual joystick, range: [0, 1] */
    clampedTouchPos: Vec2
    /** True if key is down */
    btn: {
        spc: boolean
        clk: boolean
        //esc: boolean
    }
    /** True only if key is just pressed (not pressed last frame) */
    btnp: {
        up: boolean
        dn: boolean
        lf: boolean
        rt: boolean
        spc: boolean
        clk: boolean
        //esc: boolean
    }
}

export const keys: Keys = {
    dir: {
        x: 0,
        y: 0,
    },
    ptr: { x: 0, y: 0 },
    touchStartPos: undefined,
    clampedTouchPos: { x: 0, y: 0 },
    btn: {
        spc: false,
        //esc: false,
        clk: false,
    },
    btnp: {
        up: false,
        lf: false,
        dn: false,
        rt: false,
        spc: false,
        clk: false,
        //esc: false,
    },
}

/**
 * Initialize onkey listeners
 */
export const initInput = (
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
) => {
    let dirty = false
    let gamepad: Gamepad | undefined = undefined
    const hasTouch = "ontouchstart" in window
    const dirPressed = {
        up: false,
        lf: false,
        dn: false,
        rt: false,
    }
    const lastFrame = {
        up: false,
        lf: false,
        dn: false,
        rt: false,
        spc: false,
        clk: false,
        esc: false,
    }

    const setKeyState =
        (pressed: boolean) =>
        ({ code }: { code: string }) => {
            dirty = true
            switch (code) {
                case "ArrowUp":
                case "KeyW":
                    dirPressed.up = pressed
                    break
                case "ArrowDown":
                case "KeyS":
                    dirPressed.dn = pressed
                    break
                case "ArrowLeft":
                case "KeyA":
                    dirPressed.lf = pressed
                    break
                case "ArrowRight":
                case "KeyD":
                    dirPressed.rt = pressed
                    break
                //case "Escape":
                //    keys.btn.esc = pressed
                //    break
                case "Space":
                    keys.btn.spc = pressed
            }
        }

    onkeydown = setKeyState(true)
    onkeyup = setKeyState(false)

    // not using `window` breaks chrome
    window.ongamepadconnected = (e) => {
        // only consider gamepads with analog sticks
        if (e.gamepad.axes.length > 1 && e.gamepad.buttons.length > 0) {
            gamepad = e.gamepad
        }
    }
    window.ongamepaddisconnected = () => {
        gamepad = undefined
    }

    // prevent long touch effect on touch devices
    // only needed if not preventing on other pointer events
    oncontextmenu = (e) => {
        e.preventDefault()
    }

    canvas.onpointerdown = () => (keys.btn.clk = true)
    canvas.onpointerup = () => (keys.btn.clk = false)
    canvas.onpointermove = (e) => {
        keys.ptr.x = e.offsetX / canvas.clientWidth
        keys.ptr.y = e.offsetY / canvas.clientHeight
    }

    if (hasTouch) {
        canvas.ontouchstart =
            canvas.ontouchmove =
            canvas.ontouchend =
            canvas.ontouchcancel =
                (e) => {
                    e.preventDefault()
                    if (keys.btn.clk) {
                        const offset = canvas.getBoundingClientRect()
                        const touch = e.touches[0]
                        keys.ptr.x =
                            (touch.clientX - offset.left) / canvas.clientWidth
                        keys.ptr.y =
                            (touch.clientY - offset.top) / canvas.clientHeight
                    }
                }
    }

    return () => {
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
            keys.btn.spc = gamepad.buttons[0]?.pressed
        }

        if (hasTouch) {
            if (keys.btn.clk) {
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

        keys.btnp.up = dirPressed.up && !lastFrame.up
        keys.btnp.dn = dirPressed.dn && !lastFrame.dn
        keys.btnp.lf = dirPressed.lf && !lastFrame.lf
        keys.btnp.rt = dirPressed.rt && !lastFrame.rt
        keys.btnp.clk = keys.btn.clk && !lastFrame.clk
        //keys.btnp.esc = keys.btn.esc && !lastFrame.esc
        keys.btnp.spc = keys.btn.spc && !lastFrame.spc

        lastFrame.up = dirPressed.up
        lastFrame.dn = dirPressed.dn
        lastFrame.lf = dirPressed.lf
        lastFrame.rt = dirPressed.rt
        lastFrame.clk = keys.btn.clk
        //lastFrame.esc = keys.btn.esc
        lastFrame.spc = keys.btn.spc
    }
}
