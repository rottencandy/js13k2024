import { FONT_SIZE } from "src/const"
import { texture } from "./canvas"

// source: https://github.com/PaulBGD/PixelFont
// prettier-ignore
const letters: Record<string, number[][]> = {
    'A': [
        [0, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
        [1, 0, 1]
    ],
    'B': [
        [1, 1],
        [1, 0, 1],
        [1, 1, 1],
        [1, 0, 1],
        [1, 1]
    ],
    'C': [
        [1, 1, 1],
        [1],
        [1],
        [1],
        [1, 1, 1]
    ],
    'D': [
        [1, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 1]
    ],
    'E': [
        [1, 1, 1],
        [1],
        [1, 1, 1],
        [1],
        [1, 1, 1]
    ],
    'F': [
        [1, 1, 1],
        [1],
        [1, 1],
        [1],
        [1]
    ],
    'G': [
        [0, 1, 1],
        [1],
        [1, 0, 1, 1],
        [1, 0, 0, 1],
        [0, 1, 1]
    ],
    'H': [
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
        [1, 0, 1],
        [1, 0, 1]
    ],
    'I': [
        [1, 1, 1],
        [0, 1],
        [0, 1],
        [0, 1],
        [1, 1, 1]
    ],
    'J': [
        [1, 1, 1],
        [0, 0, 1],
        [0, 0, 1],
        [1, 0, 1],
        [1, 1, 1]
    ],
    'K': [
        [1, 0, 0, 1],
        [1, 0, 1],
        [1, 1],
        [1, 0, 1],
        [1, 0, 0, 1]
    ],
    'L': [
        [1],
        [1],
        [1],
        [1],
        [1, 1, 1]
    ],
    'M': [
        [1, 1, 1, 1, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1]
    ],
    'N': [
        [1, 0, 0, 1],
        [1, 1, 0, 1],
        [1, 0, 1, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1]
    ],
    'O': [
        [1, 1, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1]
    ],
    'P': [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
        [1],
        [1]
    ],
    'Q': [
        [0, 1, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 0, 1, 1],
        [1, 1, 1, 1]
    ],
    'R': [
        [1, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 1],
        [1, 0, 1]
    ],
    'S': [
        [1, 1, 1],
        [1],
        [1, 1, 1],
        [0, 0, 1],
        [1, 1, 1]
    ],
    'T': [
        [1, 1, 1],
        [0, 1],
        [0, 1],
        [0, 1],
        [0, 1]
    ],
    'U': [
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1]
    ],
    'V': [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1],
        [0, 1, 0, 1],
        [0, 0, 1]
    ],
    'W': [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 1, 1, 1, 1]
    ],
    'X': [
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1],
        [0, 0, 1],
        [0, 1, 0, 1],
        [1, 0, 0, 0, 1]
    ],
    'Y': [
        [1, 0, 1],
        [1, 0, 1],
        [0, 1],
        [0, 1],
        [0, 1]
    ],
    'Z': [
        [1, 1, 1, 1, 1],
        [0, 0, 0, 1],
        [0, 0, 1],
        [0, 1],
        [1, 1, 1, 1, 1]
    ],
    '0': [
        [1, 1, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1]
    ],
    '1': [
        [0, 1],
        [0, 1],
        [0, 1],
        [0, 1],
        [0, 1]
    ],
    '2': [
        [1,1,1],
        [0,0,1],
        [1,1,1],
        [1,0,0],
        [1,1,1]
    ],
    '3':[
        [1,1,1],
        [0,0,1],
        [1,1,1],
        [0,0,1],
        [1,1,1]
    ],
    '4':[
        [1,0,1],
        [1,0,1],
        [1,1,1],
        [0,0,1],
        [0,0,1]
    ],
    '5':[
        [1,1,1],
        [1,0,0],
        [1,1,1],
        [0,0,1],
        [1,1,1]
    ],
    '6':[
        [1,1,1],
        [1,0,0],
        [1,1,1],
        [1,0,1],
        [1,1,1]
    ],
    '7':[
        [1,1,1],
        [0,0,1],
        [0,0,1],
        [0,0,1],
        [0,0,1]
    ],
    '8':[
        [1,1,1],
        [1,0,1],
        [1,1,1],
        [1,0,1],
        [1,1,1]
    ],
    '9':[
        [1,1,1],
        [1,0,1],
        [1,1,1],
        [0,0,1],
        [1,1,1]
    ],
    ' ': [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ],
    '.': [
        [],
        [],
        [],
        [1, 1],
        [1, 1]
    ],
    '-':[
        [],
        [],
        [1, 1],
        [],
        []
    ],
    '_':[
        [],
        [],
        [],
        [],
        [1, 1, 1],
    ],
    '%':[
        [1, 0, 0, 0, 1],
        [0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0],
        [1, 0, 0, 0, 1],
    ],
};

export const renderFont = (
    ctx: CanvasRenderingContext2D,
    str: string,
    size: number,
    x: number,
    y: number,
) => {
    let currX = x
    for (let i = 0; i < str.length; i++) {
        const letter = letters[str[i]]
        let currY = y
        let addX = 0
        for (let y = 0; y < letter.length; y++) {
            let row = letter[y]
            for (let x = 0; x < row.length; x++) {
                if (row[x]) {
                    ctx.fillRect(currX + x * size, currY, size, size)
                }
            }
            addX = Math.max(addX, row.length * size)
            currY += size
        }
        currX += size + addX
    }
}

const letterCache: Record<string, { i: HTMLCanvasElement; w: number }> = {}
for (const letter in letters) {
    const fontWidth =
        Math.max(...letters[letter].map((v) => v.length)) * FONT_SIZE
    const tex = texture(
        (ctx) => {
            ctx.fillStyle = "white"
            renderFont(ctx, letter, FONT_SIZE, 0, 0)
        },
        fontWidth,
        // height is always 5
        FONT_SIZE * 5,
    )
    letterCache[letter] = {
        i: tex,
        w: fontWidth,
    }
}

/**
 * WARNING: ONLY ALPHANUMERIC, '. -_%' ALLOWED!!
 * this does not check if string contains invalid chars.
 */
export const renderFontTex = (
    ctx: CanvasRenderingContext2D,
    str: string,
    x: number,
    y: number,
) => {
    let currX = x
    for (let i = 0; i < str.length; i++) {
        const font = letterCache[str[i]]
        ctx.drawImage(font.i, currX, y)
        currX += font.w + FONT_SIZE
    }
}
