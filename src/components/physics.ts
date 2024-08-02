export const CompPhysics: ((dt: number) => void)[] = []

export const CompPhysicsRun = (dt: number) => {
    for (let i = 0; i < CompPhysics.length; i++) {
        CompPhysics[i](dt)
    }
}
