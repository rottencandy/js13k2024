type StateKey = string | number
type StateFn = (...args: any[]) => StateKey | StateFn | undefined

type StateObject = {
    [key: StateKey]: StateFn
}

/**
 * Create linear state machine.
 * Initial state is always first function.
 * States can return a function instead of string,
 * which becomes the next state.
 *
 * @param states - Array of state functions, each optionally returning the next state.
 *
 * @example
 * const sm = createSM({
 *   IDLE: () => {},
 *   MOVE: () => {}
 * });
 *
 * @returns
 * `run`: Step function, returns last run state.
 * Any args will be passed on to state function.
 * `reset`: reset state to given key.
 * `state`: the current state.
 * `onEnter`: function to run when a state is entered
 * `onExit`: function to run when a state is left
 */
export const createStateMachine = (states: StateObject, initial: StateKey) => {
    let current = states[initial]
    const enterStates: StateObject = {}
    const exitStates: StateObject = {}

    const thisObj = {
        state: initial,
        run(...data: any[]) {
            const next = current(...data)
            if (typeof next === "function") {
                current = next
            } else if (next !== undefined) {
                if (exitStates[thisObj.state])
                    exitStates[thisObj.state](...data)
                if (enterStates[next]) enterStates[next](...data)
                current = states[next]
                thisObj.state = next
            }
            return thisObj
        },
        reset(state: StateKey) {
            current = states[state]
            thisObj.state = state
            return thisObj
        },
        onEnter(state: StateKey, fn: StateFn) {
            enterStates[state] = fn
            return thisObj
        },
        onExit(state: StateKey, fn: StateFn) {
            exitStates[state] = fn
            return thisObj
        },
    }

    return thisObj
}
