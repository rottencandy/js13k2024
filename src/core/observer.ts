type Callback = <T extends any>(arg: T) => void

const CALLBACKS: { [event: number | string]: Callback[] } = {}

export const obsStart = (event: number | string) => {
    CALLBACKS[event] = []
}

export const obsListen = (event: number | string, callback: Callback) => {
    CALLBACKS[event] = CALLBACKS[event] || []
    CALLBACKS[event].push(callback)
}

export const obsForget = (event: number | string, callback: Callback) => {
    CALLBACKS[event] = CALLBACKS[event].filter((fn) => fn !== callback)
}

export const obsEmit = (event: number | string, arg: any) => {
    CALLBACKS[event].forEach((fn) => fn(arg))
}
