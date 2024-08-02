import { CompPhysics } from "./physics"

type WatchedKeys = {
    left: boolean
    right: boolean
    up: boolean
    down: boolean
    space: boolean
    shift: boolean
    esc: boolean
    clicked: boolean
    justClicked: boolean
    pointerLocked: boolean
    ptrX: number
    ptrY: number
}

export const dirKeysPressed = (k: WatchedKeys): boolean =>
    !!(k.left || k.right || k.up || k.down)

/**
 * Initialize onkey listeners
 */
export const setupKeyListener = (
    canvas: HTMLCanvasElement,
    lockPointer: boolean,
) => {
    let justClicked = false
    const keys: WatchedKeys = {
        left: false,
        right: false,
        up: false,
        down: false,
        space: false,
        shift: false,
        esc: false,
        clicked: false,
        justClicked: false,
        pointerLocked: false,
        ptrX: 0,
        ptrY: 0,
    }
    const setKeyState =
        (value: boolean) =>
        ({ key }: { key: string }) => {
            switch (key) {
                case "ArrowUp":
                case "w":
                case "z":
                    keys.up = value
                    break
                case "ArrowDown":
                case "s":
                    keys.down = value
                    break
                case "ArrowLeft":
                case "a":
                case "q":
                    keys.left = value
                    break
                case "ArrowRight":
                case "d":
                    keys.right = value
                    break
                case "Escape":
                    keys.esc = value
                    break
                case " ":
                    keys.space = value
                case "Shift":
                    keys.shift = value
            }
        }

    window.onkeydown = setKeyState(true)
    window.onkeyup = setKeyState(false)

    canvas.onpointerdown = () => (keys.clicked = justClicked = true)
    canvas.onpointerup = () => (keys.clicked = false)
    canvas.onpointermove = (e) => {
        keys.ptrX = e.offsetX / canvas.clientWidth
        keys.ptrY = e.offsetY / canvas.clientHeight
    }

    if (lockPointer) {
        canvas.onclick = () => {
            if (!keys.pointerLocked) {
                canvas.requestPointerLock()
            }
        }

        document.onpointerlockchange = () => {
            keys.pointerLocked = document.pointerLockElement === canvas
        }
    }

    canvas.ontouchstart =
        canvas.ontouchmove =
        canvas.ontouchend =
        canvas.ontouchcancel =
            (e) => {
                e.preventDefault()
                keys.clicked = justClicked = e.touches.length > 0
                if (keys.clicked) {
                    const offset = canvas.getBoundingClientRect()
                    const touch = e.touches[0]
                    keys.ptrX =
                        (touch.clientX - offset.left) / canvas.clientWidth
                    // offset.top is not needed since canvas is always stuck to top
                    keys.ptrY = touch.clientY / canvas.clientHeight
                }
            }

    CompPhysics.push(() => {
        if (justClicked) {
            justClicked = false
            keys.justClicked = true
        } else {
            keys.justClicked = false
        }
    })

    return keys
}
