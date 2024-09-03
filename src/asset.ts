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
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAQCAYAAACBSfjBAAABKUlEQVRYR+1Y2w3CMAxsR6kYALEAw7MAYgDUUUD+MDKuX4oTqKX2CwGX+C5n52CejielwJxCC+BlOb2sNdf1ae5ZDb8hkyEA2Mf9Zp7J+XKdNBEr4r8EzBCIYFFZScSq+I+AIwiAUOhI/pq7UNq/At4UsAIBdPW/DmCogNowPFpYuAhGjIAKBzB0BlYQwBoBkfq7CQibRVx4xBgjx6GIrUHay6C4rpQjo1hrjZb6Nzkw8svECsKA18I0uA8eTQAp8tB6MBVwF1Pn0+TAuXhRigoocZC6R2xhrQiNAG/fX+N7CeitIxlgNwJ6pw+few5Gx3kd0NoFpoBZAj3w3kVkXUCR2zSK18aQ2cJSAag4nU2Rf1Po92kxUQIZPD2EyMyjc5K3MHLV3gfsG8E8bS8nViNqAAAAAElFTkSuQmCC",
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
