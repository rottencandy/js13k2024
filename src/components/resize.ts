type Func = (width:number, height:number) => void
let components: Func[] = []

export const CompResizeRun = (width: number, height: number) => {
    for (let i = 0; i < components.length; i++) {
        components[i](width, height)
    }
}

export const addResizeComp = (fn: Func) => {
    components.push(fn)
    return () => {
        components = components.filter((val) => val !== fn)
    }
}
