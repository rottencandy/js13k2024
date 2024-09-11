import { loadCam, unloadCam } from "./cam"
import { loadCoin, unloadCoin } from "./coin"
import { physicsPause } from "./components/physics"
import { obsEmit, obsStart } from "./core/observer"
import { loadFloor, unloadFloor } from "./floor"
import { loadHero, unloadHero } from "./hero"
import { loadHud, unloadHud } from "./hud"
import { loadMob, unloadMob } from "./mob"
import { Observable } from "./observables"
import { playTheme, stopTheme } from "./sound"
import { resetStats } from "./stat"
import { loadText, unloadText } from "./text"
import { loadWeapon, unloadWeapon } from "./weapon"

export const enum Scene {
    intro,
    title,
    gameplay,
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

export const loadIntro = () => {
    unloadGameEntities()
    scene = Scene.intro
    obsEmit(Observable.scene, scene)
}

export const loadTitle = () => {
    unloadGameEntities()
    scene = Scene.title
    obsEmit(Observable.scene, scene)
}

export const startGame = () => {
    loadGameEntities()
    scene = Scene.gameplay
    obsEmit(Observable.scene, scene)
    resetStats()
    playTheme()
}

export const endGame = () => {
    unloadGameEntities()
    scene = Scene.gameover
    obsEmit(Observable.scene, scene)
    stopTheme()
}

export const powerupMenu = () => {
    physicsPause(true)
    scene = Scene.powerup
    obsEmit(Observable.scene, scene)
}

export const prerpareDeathScene = () => {
    unloadHud()
    unloadWeapon()
    unloadCam()
    stopTheme()
    obsEmit(Observable.scene, scene)
}

export const resumeGame = () => {
    physicsPause(false)
    scene = Scene.gameplay
    obsEmit(Observable.scene, scene)
}
