import { zzfxG, zzfxP } from "./core/zzfx"
import { zzfxM } from "./core/zzfxm"

let musicNode: AudioBufferSourceNode
let theme: any
let pickup: number[]
let shoot: number[]
let hit: number[]
let powerup: number[]
let hurt: number[]
let start: number[]

export const playTheme = () => {
    playStart()
    setTimeout(() => {
        musicNode = zzfxP(...theme)
        musicNode.loop = true
    }, 2e3)
}

export const stopTheme = () => {
    musicNode.stop()
}

export const playPickup = () => zzfxP(pickup)
export const playShoot = () => zzfxP(shoot)
export const playHit = () => zzfxP(hit)
export const playHurt = () => zzfxP(hurt)
export const playPowerup = () => zzfxP(powerup)
export const playStart = () => zzfxP(start)

// prettier-ignore
export const loadSounds = () => {
    theme = zzfxM(...[[[,0,84,,,,,.7,,,,.5,,6.7,1,.05],[,0,25,.002,.02,.08,3,,,,,,,,,.1,.01],[,0,655,,,.09,3,1.65,,,,,.02,3.8,-.1,,.2],[,0,740,,,.15,2,.2,-.1,-.15,9,.02,,.1,.12,,.06]],[[[1,-.3,,,,,,,,,,,,,,15,15,15],[,.2,13,,,,25,,,,13,,,,25,,,,],[2,,,,27,,,,27,,,,27,,,,27,,]],[[1,-.3,,,,,,,,,,,,,,15,15,15],[,.2,13,,,,25,,,,13,,,,25,,,,]],[[1,-.3,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],[,.2,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,]],[[1,-.3,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],[,.2,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,],[2,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,],[3,,29,,24,,20,,15,,29,,24,,20,,15,,27,,24,,20,,15,,27,,24,,20,,15,,29,,24,,20,,15,,29,,24,,20,,15,,27,,24,,20,,15,,27,,24,,20,,15,,]],[[1,-.3,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],[,.2,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,],[2,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,]],[[1,-.3,29,29,25,25,24,24,20,20,29,29,25,25,24,24,20,20,27,27,25,25,24,24,20,20,27,27,25,25,24,24,20,20,29,29,25,25,24,24,20,20,29,29,25,25,24,24,20,20,27,27,25,25,24,24,20,20,27,27,25,25,24,24,20,20],[,.2,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,],[2,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,],[3,,29,,24,,20,,15,,29,,24,,20,,15,,27,,24,,20,,15,,27,,24,,20,,15,,29,,24,,20,,15,,29,,24,,20,,15,,27,,24,,20,,15,,27,,24,,20,,15,,]],[[2,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,],[3,,29,,24,,20,,15,,29,,24,,20,,15,,27,,24,,20,,15,,27,,24,,20,,15,,29,,24,,20,,15,,29,,24,,20,,15,,27,,24,,20,,15,,27,,24,,20,,15,,]],[[1,-.3,29,29,25,25,24,24,20,20,29,29,25,25,24,24,20,20,27,27,25,25,24,24,20,20,27,27,25,25,24,24,20,20,29,29,25,25,24,24,20,20,29,29,25,25,24,24,20,20,27,27,25,25,24,24,20,20,27,27,25,25,24,24,20,20],[,.2,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,13,,,,25,,,,],[2,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,,,27,,]]],[1,1,1,1,0,0,0,0,0,0,2,2,4,4,3,3,5,5,6,7,1,1,5,3,4,4],,])
    pickup = zzfxG(...[,,600,,,.25,,,,,200,.05,,,,,,1.5,,.01]) // pickup
    shoot = zzfxG(...[,,500,.05,.04,.02,1,1.1,-10,,,,,,,,,.3]) // shoot
    hit = zzfxG(...[,,246,,.02,.17,4,.4,-8,,,,,1,20,,,.2,.02]) // hit
    powerup = zzfxG(...[2.1,,139,.05,.16,.36,1,1.1,,1,357,.07,.04,,,,.2,.53,.12,.21]) // powerup
    hurt = zzfxG(...[.6,0,270,.01,,.2,3,3,,-26,,,,,,,,.05,.07]) // hurt
    start = zzfxG(...[1.6,,521,.1,.25,.34,1,3.2,,,437,.09,.02,,,,.13,.5,.27]) // Powerup 4
}
