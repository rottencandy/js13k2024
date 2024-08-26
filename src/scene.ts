import { loadCam, unloadCam } from "./cam"
import { loadCoin, unloadCoin } from "./coin"
import { physicsPause } from "./components/physics"
import { loadHero, unloadHero } from "./hero"
import { loadHud, unloadHud } from "./hud"
import { loadMob, unloadMob } from "./mob"
import { resetStats } from "./stat"
import { loadText, unloadText } from "./text"
import { loadWeapon, unloadWeapon } from "./weapon"

export const enum Scene {
    title,
    gameplay,
    pause,
    powerup,
    gameover,
}

export let scene: Scene

const unloadGameEntities = () => {
    if (scene === Scene.gameplay) {
        unloadCam()
        unloadMob()
        unloadCoin()
        unloadHero()
        unloadWeapon()
        unloadHud()
        unloadText()
    }
}

const loadGameEntities = () => {
    // order matters
    loadCam()
    loadMob()
    loadCoin()
    loadHero()
    loadWeapon()
    loadText()
    loadHud()
}

export const loadTitle = () => {
    unloadGameEntities()
    scene = Scene.title
}

export const startGame = () => {
    scene = Scene.gameplay
    resetStats()
    loadGameEntities()
}

export const endGame = () => {
    unloadGameEntities()
    scene = Scene.gameover
}

export const powerupMenu = () => {
    physicsPause(true)
    scene = Scene.powerup
}

export const pauseGame = () => {
    physicsPause(true)
    scene = Scene.pause
}

export const resumeGame = () => {
    physicsPause(false)
    scene = Scene.gameplay
}
