import { lerp } from "./math"

type TweenFn = (t: number) => number

export const LINEAR: TweenFn = (t) => t
export const EASEOUTQUAD: TweenFn = (t) => t * (2 - t)
export const EASEOUTQUINT: TweenFn = (t) => 1 + --t * t * t * t * t
export const EASEINQUINT: TweenFn = (t) => t * t * t * t * t
export const EASEINOUTCUBIC: TweenFn = (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
export const THERENBACK: TweenFn = (t) => (t < 0.5 ? 2 * t : 2 * (1 - t))
// elastic bounce effect at the beginning
export const EASEINELASTIC: TweenFn = (t) =>
    (0.04 - 0.04 / t) * Math.sin(25 * t) + 1
// elastic bounce effect at the end
export const EASEOUTELASTIC: TweenFn = (t) =>
    ((0.04 * t) / --t) * Math.sin(25 * t)
// elastic bounce effect at the beginning and end
export const EASEINOUTELASTIC: TweenFn = (t) =>
    (t -= 0.5) < 0
        ? (0.02 + 0.01 / t) * Math.sin(50 * t)
        : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1

/**
 * Returns a callback that returns true every time `interval` ticks have passed.
 */
export const ticker = (interval: number, repeat = true) => {
    let ticks = 0
    return (dt: number) => {
        if ((ticks += dt) > interval) {
            if (repeat) ticks = 0
            return true
        } else {
            return false
        }
    }
}

export const tween = (
    from: number,
    to: number,
    duration = 1,
    func = LINEAR,
) => {
    // t goes from 0 -> duration
    let t = 0

    const obj = {
        val: from,
        done: false,
        step(delta: number) {
            // check if interpolation is done
            if (obj.done) {
                obj.val = to
                return obj.val
            } else {
                obj.done = t >= duration

                t += delta
                // convert t into range 0 -> 1 and get interpolated value
                obj.val = lerp(from, to, func(t / duration))
                return obj.val
            }
        },
        reset: () => ((t = 0), (obj.val = from), (obj.done = false)),
    }

    return obj
}
