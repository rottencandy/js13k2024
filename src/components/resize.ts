export const CompResize: ((width: number, height: number) => void)[] = []

export const CompResizeRun = (width: number, height: number) => {
    for (let i = 0; i < CompResize.length; i++) {
        CompResize[i](width, height)
    }
}
