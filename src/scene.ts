import { loadCam, unloadCam } from "./cam"
import { loadHero, unloadHero } from "./hero"
import { loadHud, unloadHud } from "./hud"
import { loadMob, unloadMob } from "./mob"
import { resetStats } from "./stat"
import { loadText, unloadText } from "./text"
import { loadWeapon, unloadWeapon } from "./weapon"

export const enum Scene {
    title,
    gameplay,
    gameover,
}

export let scene: Scene

const unloadActiveScene = () => {
    if (scene !== undefined) {
        switch (scene) {
            case Scene.title:
                break
            case Scene.gameplay:
                unloadCam()
                unloadMob()
                unloadHero()
                unloadWeapon()
                unloadHud()
                unloadText()
                break
            case Scene.gameover:
                break
        }
    }
}

const loadScene = (next: Scene) => {
    unloadActiveScene()
    scene = next
    switch (scene) {
        case Scene.title:
            break
        case Scene.gameplay:
            // order matters
            loadCam()
            loadMob()
            loadHero()
            loadWeapon()
            loadText()
            loadHud()
            break
        case Scene.gameover:
            break
    }
}

export const loadTitle = () => {
    loadScene(Scene.title)
}

export const startGame = () => {
    loadScene(Scene.gameplay)
    resetStats()
}

export const endGame = () => {
    loadScene(Scene.gameover)
}
