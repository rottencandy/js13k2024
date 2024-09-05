import { loadCam, unloadCam } from "./cam"
import { loadCoin, unloadCoin } from "./coin"
import { physicsPause } from "./components/physics"
import { obsEmit, obsStart } from "./core/observer"
import { loadFloor, unloadFloor } from "./floor"
import { loadHero, unloadHero } from "./hero"
import { loadHud, unloadHud } from "./hud"
import { loadMob, unloadMob } from "./mob"
import { Observable } from "./observables"
import { playTheme } from "./sound"
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

let scene: Scene
obsStart(Observable.scene)

const unloadGameEntities = () => {
    if (scene === Scene.gameplay) {
        unloadCam()
        unloadFloor()
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
    loadFloor()
    loadHero()
    loadCoin()
    loadMob()
    loadWeapon()
    loadText()
    loadHud()
}

export const loadTitle = () => {
    unloadGameEntities()
    scene = Scene.title
    obsEmit(Observable.scene, scene)
}

export const startGame = () => {
    scene = Scene.gameplay
    obsEmit(Observable.scene, scene)
    resetStats()
    loadGameEntities()
    playTheme()
}

export const endGame = () => {
    unloadGameEntities()
    scene = Scene.gameover
    obsEmit(Observable.scene, scene)
}

export const powerupMenu = () => {
    physicsPause(true)
    scene = Scene.powerup
    obsEmit(Observable.scene, scene)
}

export const pauseGame = () => {
    physicsPause(true)
    scene = Scene.pause
    obsEmit(Observable.scene, scene)
}

export const resumeGame = () => {
    physicsPause(false)
    scene = Scene.gameplay
    obsEmit(Observable.scene, scene)
}
