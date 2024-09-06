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
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAQCAYAAACBSfjBAAAB70lEQVRYR2NkGAUUhQAjRbqxaDbVdvqPz8zTV/fhtXOo6cfwDCUeAOk1nj4RZ/hZSX1hmOxfzYArEAezfpDbjz3jYTibmY/ifpQApMQDIL1ioR0Msk6ceBM1rkAcCvqxBSI8AIeCB0AxM5ARQPMADG2VA6e+e0LFJGdjUAQOdv0EA5BaHjh4IQtnVsaXgmD2D7R+XAmA6ACkhgdASRBbeUhsAA60flxuR69IUMpA5BRAiQfw1SIWyhwMxRG3MGpi5Cw8WPWD3H7i7g+G1dWP4O7HGoDkeACkBxQIrLxiYO0BFRxYjUG2HF3BYNePLfIxmjGUBAB6IHLzfEcJow/PP+NsA8IUIgfiUNCPtSENC0RyPTCvVI1BytEMHCZzzx9iSDa0A7M9vJbgDUBYIx6ffpA52BriIL0gcRBNyH6YWmxZhBj9yPowUiBIkhwPwFIfiJbU5WCwiYBkZWQAyr74AgBUBoPU4NMPU4MciLDyE2Y+IfuxmQFzP0wOVh8Qcj9GGUiOB9AtJzUAkLMvJREAS4H47IepwdedJKSfYAr0lvvBwJWuBk4NIIDOx2c5NvXE6odFBD77iRmMoKd+rGUgyAHqRooMka1LwfINnlb/Qfy+Dc+JqgQGUj9yJIDcfPPcfbBfSHU7snpQEQHzE7o5AGAAsC/n6ODmAAAAAElFTkSuQmCC",
    )
    const mob0 = await img(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAQCAYAAABQrvyxAAAA8UlEQVRIS9WWvRHCMAyFnZIhmCAlxwLZhiqzUGWbLMBRZgKGoIRT7pQzsqyfmBji2u9Z37OtUxN2vpqd1x9YgHPbvTiw2zT+HXBSEBR/Gq7sxdwvfbBA1AzgA0AqHok0iNoBqABQcHwjEsAvAhABoFhcCOEF2DoA8Q9QAO/zqRGACgDJY4prAEr18Qvgzjd3IW/xXBvzesTBYRC0C6qf+Bvdx+JhaQDgQ0NYADQDb3reG9DOz4WQADzGZ3L2sTsk5HQTFsDpYa/moelzHjPAWjFCWPQShFXPeSwAnqGOfqTc6JDzLNWDL3psMsyVzkIe/RvbKi8gvX+8OQAAAABJRU5ErkJggg==",
    )
    const mob2 = await img(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAQCAYAAABQrvyxAAABJklEQVRIS72VLQ7CQBCFtwKJxXABEhCYGurgHJyDA+C4BucAh6pBQMIFMLVIBGRoJpndbDs/y3ZN06Zv533bmdfCZVrlfP2JbV3fz8U/S3ZulmIAtPvDzq2qhed1U22dFEBaPwqQaoDqwfTpcnRwhSUB0NRnAVIN5NZnB6A9JG0hzRdkAawGUAftA2vwFkoxQKFxGCW9jzo6wNwBsJFmMQBGYimigQhhurSqGJUaAPOj8cSL0PerESVQ7Cvgs1j9zhlIMYAAy2kLcX02TgOgOYBegFQDQ+izAOAMlLP2T1w/bur2gQ6QHEDvDFgNUABt+9AZkNRnASwGoIehuEUbAnB7eABQGCbdYoBqafxIkgu1WvPw/g+AbhDmN2cgLO5lp/LG8u/4AmmZYSCJrToFAAAAAElFTkSuQmCC",
    )
    const coin = await img(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAbElEQVQYV2NkgAJTbaf/MDaIPn11HyOIBhMgycAwN4b0BDGwmh9vxRgCYvvAihhhkvG+OmBJXiVDMP353nmwIrgCkG6QTpii3x93Mnh4LUFVADMeRHMIv4IoIOgGZF/AHArSieILdK/CJEHiAPtXOeyz5cSGAAAAAElFTkSuQmCC",
    )
    const bullet = await img(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAQ0lEQVQYV2NkIAAYYfKm2k7/kdWevroPLAcmQJI7tsWgmOXhtYQBpAhFASu/O1jR7487GchTgGwHigkwd+B0JD6fAgA0lyoJwxgCagAAAABJRU5ErkJggg==",
    )
    const elements = await img(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAICAYAAADjoT9jAAAA1UlEQVQoU2NkIAGYajv9Byk/fXUfI7I2mDg2ObBCdI3YDAKJ7T26mOHY0SsMtWWdcEtA4ju2xcDt8/BaguIARpCCenUBsILGmx/ANDIf5FqY4SA5kAUgALMEZgErvzvD7487GfBagB5aMAubu8oZrKx1wNIwC2CWgGi8PoAFEczVMEtAhsNcHxjmxmBkYgiWglkEYjtbx8LVwPShxw88stCDClkhSA5mCcwCmOHovoY5GKYfa2pAdwVME8wS5EhGtwAWJ7C4QLEAm2uQxXAlU2yWwBwJACNzjQmYk1DiAAAAAElFTkSuQmCC",
    )

    // included normal and flipped versions for asymmetric sprites
    // note: make sure spritesheet frames are always in 1 row
    return {
        coin,
        hero: [
            // normal
            texture((ctx) => frame(ctx, hero, 0, 0, 16, 0), 16, 16),
            texture((ctx) => frame(ctx, hero, 0, 0, 16, 1), 16, 16),
            texture((ctx) => frame(ctx, hero, 0, 0, 16, 2), 16, 16),
            texture((ctx) => frame(ctx, hero, 0, 0, 16, 3), 16, 16),
            texture((ctx) => frame(ctx, hero, 0, 0, 16, 4), 16, 16),
            // flipped
            texture((ctx) => flipFrame(ctx, hero, 0, 0, 16, 0), 16, 16),
            texture((ctx) => flipFrame(ctx, hero, 0, 0, 16, 1), 16, 16),
            texture((ctx) => flipFrame(ctx, hero, 0, 0, 16, 2), 16, 16),
            texture((ctx) => flipFrame(ctx, hero, 0, 0, 16, 3), 16, 16),
            texture((ctx) => flipFrame(ctx, hero, 0, 0, 16, 4), 16, 16),
        ],
        mob0: [
            // normal
            texture((ctx) => frame(ctx, mob0, 0, 0, 16, 0), 16, 16),
            texture((ctx) => frame(ctx, mob0, 0, 0, 16, 1), 16, 16),
            texture((ctx) => frame(ctx, mob0, 0, 0, 16, 2), 16, 16),
            //flipped
            texture((ctx) => flipFrame(ctx, mob0, 0, 0, 16, 0), 16, 16),
            texture((ctx) => flipFrame(ctx, mob0, 0, 0, 16, 1), 16, 16),
            texture((ctx) => flipFrame(ctx, mob0, 0, 0, 16, 2), 16, 16),
        ],
        mob2: [
            // normal
            texture((ctx) => frame(ctx, mob2, 0, 0, 16, 0), 16, 16),
            texture((ctx) => frame(ctx, mob2, 0, 0, 16, 1), 16, 16),
            texture((ctx) => frame(ctx, mob2, 0, 0, 16, 2), 16, 16),
            //flipped
            texture((ctx) => flipFrame(ctx, mob2, 0, 0, 16, 0), 16, 16),
            texture((ctx) => flipFrame(ctx, mob2, 0, 0, 16, 1), 16, 16),
            texture((ctx) => flipFrame(ctx, mob2, 0, 0, 16, 2), 16, 16),
        ],
        bullet,
        eHeart: texture((ctx) => frame(ctx, elements, 0, 0, 16, 0), 16, 16),
        eXp: texture((ctx) => frame(ctx, elements, 0, 0, 16, 1), 16, 16),
        eBullet: texture((ctx) => frame(ctx, elements, 0, 0, 16, 2), 16, 16),
    }
}

const frame = (
    ctx: CTX,
    img: CanvasImageSource,
    x: number,
    y: number,
    size: number,
    idx: number,
) => {
    ctx.drawImage(img, size * idx, 0, size, size, ~~x, ~~y, size, size)
}

const flipFrame = (
    ctx: CTX,
    img: CanvasImageSource,
    x: number,
    y: number,
    size: number,
    idx: number,
) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(-1, 1)
    frame(ctx, img, -size, 0, size, idx)
    ctx.restore()
}
