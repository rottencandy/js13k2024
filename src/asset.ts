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
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAQCAYAAACBSfjBAAAB70lEQVRYR2NkGAUUhQAjRbqxaFZUVP6Pz8z79+/itXOo6cfwDCUeAOl1X7gBZ/hZSX1hqHeNYcAViINZP8jtx57xMOyMD0BxP0oAUuIBkF6t+OUMsk6ceBM1rkAcCvqxBSI8AIeCB0AxM5ARQPMAzOy3Bae+e0LFJGdjUAQOdv0EA5BaHjh4IQtnVsaXgmD2D7R+XAmA6ACkhgdASRBbeUhsAA60flxuR69IUMpA5BRAiQfw1SIWyhwM8X67MWpi5Cw8WPWD3H7i7g+G6YWH4e7HGoDkeACkBxQIIlzyYO2hrXJYjUG2HF3BYNePLfIxmjGUBgAoUGBmsPKKoYTR85enwXx87cChph8jACnxACwVbqp3ZZByNAMH1tzzhxiSDe3AbBOHVpyBB9MLovHpxxUBoNQLihgQTch+mFpsWYQY/cj6sAYgOR5ADgBdc3UGmwjU1AeSB2VffAEAKoNBavDph6lBTsWw8hNmPiH7sZkBcz9MDlYfIAcWNvdjlIHkeADdclIDAOZIWDeSUABgKwKQUyA+/bBUiq8YIaSfYAqM1xBn4EpXg6cYdD6hMoxc/bCIwKefmMEIeurHOpgAcoC6kSJDZOtSsHyDp9V/EL9q2Qm8ZRhyAAyUfnQ33Dx3H+wXUt2OrB6UumFhgm4OANuhmy/77c3yAAAAAElFTkSuQmCC",
    )
    const coin = await img(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAbElEQVQYV2NkgAJTbaf/MDaIPn11HyOIBhMgSbHQDgZZJ06wGiupLwyT/avBihhhkuExf8GSASJyYHrDm0dgRXAFIN0gnTBFZZfeMZzNzEdVADMeRB97xgNRQNANyL6AORSkE8UX6F6FSYLEAd24N+ydv2K9AAAAAElFTkSuQmCC",
    )
    const bullet = await img(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAQklEQVQYV2NkIAAYYfKKisr/kdXev38XLAcmQJJnDlSjmGXi0MoAUoSigJXfHazo98edDOQpQLYDxQSYO3A6Ep9PASVXKgn1SJ/DAAAAAElFTkSuQmCC",
    )
    const mob0 = await img(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAQCAYAAABQrvyxAAAA8ElEQVRIS9WWPQ7CMAyF05FDMFTchIWVG/Rs3KArCzdBHXoIRpAruUodxz8NDTRz3ou/l8RyE3a+mp3XH1iAtj29ObBheP4dcFIQFH+59ezF3LtrsEDUDGABIBWPRBpE7QBUACg4vhEJ4BcBiABQLC6E8AJsHYD4ByiA9/nUCEAFgOQxxTUApfr4BXDnm7uQt3iujXk94uAwCNoF1U/8je5j8bA0APChIcwAmoE3Pe8NaOfnQkgAxscrOft4PiTkdBMWwOlhr+ah6XMeE8BaMUJY9BKEVc95zACeoY5+pNzokPMs1YMvemwyzJXOQh79B0hiLyAkBQnxAAAAAElFTkSuQmCC",
    )

    // included normal and flipped versions for asymmetric sprites
    // note: make sure spritesheet frames are always in 1 row
    return {
        coin,
        hero: [
            // normal
            texture((ctx) => drawFrame(ctx, hero, 0, 0, 16, 0), 16, 16),
            texture((ctx) => drawFrame(ctx, hero, 0, 0, 16, 1), 16, 16),
            texture((ctx) => drawFrame(ctx, hero, 0, 0, 16, 2), 16, 16),
            texture((ctx) => drawFrame(ctx, hero, 0, 0, 16, 3), 16, 16),
            texture((ctx) => drawFrame(ctx, hero, 0, 0, 16, 4), 16, 16),
            // flipped
            texture((ctx) => flippedFrame(ctx, hero, 0, 0, 16, 0), 16, 16),
            texture((ctx) => flippedFrame(ctx, hero, 0, 0, 16, 1), 16, 16),
            texture((ctx) => flippedFrame(ctx, hero, 0, 0, 16, 2), 16, 16),
            texture((ctx) => flippedFrame(ctx, hero, 0, 0, 16, 3), 16, 16),
            texture((ctx) => flippedFrame(ctx, hero, 0, 0, 16, 4), 16, 16),
        ],
        mob0: [
            // normal
            texture((ctx) => drawFrame(ctx, mob0, 0, 0, 16, 0), 16, 16),
            texture((ctx) => drawFrame(ctx, mob0, 0, 0, 16, 1), 16, 16),
            texture((ctx) => drawFrame(ctx, mob0, 0, 0, 16, 2), 16, 16),
            //flipped
            texture((ctx) => flippedFrame(ctx, mob0, 0, 0, 16, 0), 16, 16),
            texture((ctx) => flippedFrame(ctx, mob0, 0, 0, 16, 1), 16, 16),
            texture((ctx) => flippedFrame(ctx, mob0, 0, 0, 16, 2), 16, 16),
        ],
        bullet,
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
