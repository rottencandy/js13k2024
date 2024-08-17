import { loadCam, unloadCam } from "./cam"
import { loadHero, unloadHero } from "./hero"
import { loadHud, unloadHud } from "./hud"
import { loadMob, unloadMob } from "./mob"
import { loadWeapon, unloadWeapon } from "./weapon"

const enum Scene {
    title,
    gameplay,
    gameover,
}

let scene: Scene

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
            loadHud()
            break
        case Scene.gameover:
            break
    }
}

export const loadGame = () => {
    loadScene(Scene.gameplay)
}
