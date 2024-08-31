import { CTX } from "./core/canvas"

const img = async (data: string) => {
    const obj = new Image()
    obj.src = data
    await new Promise((resolve) => {
        obj.onload = resolve
    })
    return obj
}

export type Assets = Record<string, HTMLImageElement>

export const loadAssets = async (): Promise<Assets> => {
    const assets = {
        coin: await img(
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAbElEQVQYV2NkgAJTbaf/MDaIPn11HyOIBhMgSbHQDgZZJ06wGiupLwyT/avBihhhkuExf8GSASJyYHrDm0dgRXAFIN0gnTBFZZfeMZzNzEdVADMeRB97xgNRQNANyL6AORSkE8UX6F6FSYLEAd24N+ydv2K9AAAAAElFTkSuQmCC",
        ),
        hero: await img(
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAQCAYAAABQrvyxAAAA3ElEQVRIS+1WwQ2DQAyDURADVCzA8CyAOkDFKEV5pDJHEpLoikoFr6rCPvuSOLTNxZ+2tv6u698W57K8zDOj+B1ZlADFEvY5T+adPIax0Uxk8BsDGQJW68Hyu5KJLP5jIEtgGSChXJHyd1kF6XwP3jTgIfhrA9owXKaFbgPKDWAFqw0xneUJgp+NURzm7CI72kHMiwm22wOezWwtIsJry4xunx4Jj9XD9EM9/P9hC0UIpBg9Ey/OwJkCyk+RaAXFFsq0AA9xVEDZslYQSAEgfszh+kdBVoJorfRt/ApGCHMgC3NZCQAAAABJRU5ErkJggg==",
        ),
    }
    return assets
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
