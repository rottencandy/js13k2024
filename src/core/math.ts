export type Vec2 = { x: number; y: number }

export const floor = (x: number) => ~~x

export const rad = (a: number) => (a * Math.PI) / 180

export const rand = (a = 0, b = 1) => b + (a - b) * Math.random()

export const clamp = (value: number, min: number, max: number) => {
    return value < min ? min : value > max ? max : value
}

// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
export const aabb = (
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number,
) => {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2
}

/**
 * Linearly interpolate between two values.
 * `weight` should be between 0 & 1, but may be larger for extrapolation
 */
export const lerp = (from: number, to: number, weight: number) => {
    return from + (to - from) * weight
}

/**
 * Normalize a vec2 inplace
 */
export const normalize = (v: Vec2) => {
    var len = v.x * v.x + v.y * v.y
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len)
    }
    v.x = v.x * len
    v.y = v.y * len
}
