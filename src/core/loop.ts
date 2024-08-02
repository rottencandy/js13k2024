type StepFn = (delta: number) => void

/**
 * Start the game loop
 */
export const gameLoop = (update: StepFn, render: StepFn) => {
    let last = performance.now(),
        delta = 0
    ;(function loop(now: number) {
        delta = now - last
        last = now
        // Sanity check - absorb random lag spike / frame jumps
        if (delta > 1e3) delta = 0

        update(delta)
        render(delta)

        requestAnimationFrame(loop)
    })(last)
}
