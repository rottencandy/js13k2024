import { CTX, texture } from "./core/canvas"

const img = async (data: string) => {
    const obj = new Image()
    obj.src = data
    await new Promise((resolve) => {
        obj.onload = resolve
    })
    return obj
}

export type Assets = Awaited<ReturnType<typeof loadAssets>>

export const loadAssets = async () => {
    const hero = await img(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAQCAYAAACBSfjBAAABKUlEQVRYR+1YUQ6CMAyFoxAPYLyAh/cCxgMYjqJpQk0tb+1GmbJkfBHCK31vbffGOPQrpMAYQgPwNJ1eVsx5fprfbA2/IhMhQNjH/WauyflyHVIitoj/EjBCIAfLyiIRW8V/BKxFgMTiquT7EgGjeFo0HYOe6S5A/NG3OR7jXQGjBP6Nb15ANBBLKvDoeLcCj06A86s1gjz+XcBFoa0LsJuAlEdOEt3GGD6ORdxqpD0PynGRj8zFWjG25L/ygTknE8sIEz5lpqn6kIXQ1St3bplPygbJyk9h0W6MrIzMX8dC+cMWLiUQFSCK7wKKQR6pYK5WrwO8LuBK03HQ/IYt7CVQo4Vz7Ii1Ae2B9zZBV0DUSnom5PxNkUe3X+MlB30KKs2d39cjQsZ5A4x+ai+wpBssAAAAAElFTkSuQmCC",
    )
    const coin = await img(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAbElEQVQYV2NkgAJTbaf/MDaIPn11HyOIBhMgSbHQDgZZJ06wGiupLwyT/avBihhhkuExf8GSASJyYHrDm0dgRXAFIN0gnTBFZZfeMZzNzEdVADMeRB97xgNRQNANyL6AORSkE8UX6F6FSYLEAd24N+ydv2K9AAAAAElFTkSuQmCC",
    )

    // included normal and flipped versions for asymmetric sprites
    // note: make sure spritesheet frames are always in 1 row
    return {
        coin,
        hero: [
            // normal
            texture(
                (ctx) => {
                    drawFrame(ctx, hero, 0, 0, 16, 0)
                },
                16,
                16,
            ),
            texture(
                (ctx) => {
                    drawFrame(ctx, hero, 0, 0, 16, 1)
                },
                16,
                16,
            ),
            texture(
                (ctx) => {
                    drawFrame(ctx, hero, 0, 0, 16, 2)
                },
                16,
                16,
            ),
            texture(
                (ctx) => {
                    drawFrame(ctx, hero, 0, 0, 16, 3)
                },
                16,
                16,
            ),
            texture(
                (ctx) => {
                    drawFrame(ctx, hero, 0, 0, 16, 4)
                },
                16,
                16,
            ),
            // flipped
            texture(
                (ctx) => {
                    flippedFrame(ctx, hero, 0, 0, 16, 0)
                },
                16,
                16,
            ),
            texture(
                (ctx) => {
                    flippedFrame(ctx, hero, 0, 0, 16, 1)
                },
                16,
                16,
            ),
            texture(
                (ctx) => {
                    flippedFrame(ctx, hero, 0, 0, 16, 2)
                },
                16,
                16,
            ),
            texture(
                (ctx) => {
                    flippedFrame(ctx, hero, 0, 0, 16, 3)
                },
                16,
                16,
            ),
            texture(
                (ctx) => {
                    flippedFrame(ctx, hero, 0, 0, 16, 4)
                },
                16,
                16,
            ),
        ],
    }
}

export const drawFrame = (
    ctx: CTX,
    img: CanvasImageSource,
    x: number,
    y: number,
    size: number,
    frame: number,
) => {
    ctx.drawImage(img, size * frame, 0, size, size, ~~x, ~~y, size, size)
}

export const flippedFrame = (
    ctx: CTX,
    img: CanvasImageSource,
    x: number,
    y: number,
    size: number,
    frame: number,
) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(-1, 1)
    drawFrame(ctx, img, -size, 0, size, frame)
    ctx.restore()
}
