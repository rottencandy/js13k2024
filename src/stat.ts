import {
    COIN_XP,
    INIT_BULLET_DMG,
    INIT_BULLET_SPEED,
    INIT_LEVEL_XP,
    INIT_MAX_HEALTH,
    INIT_PICKUP_RADIUS,
    INIT_SPEED,
} from "./const"
import { powerupMenu } from "./scene"

export const stats = {
    health: 0,
    maxHealth: 0,
    xp: 0,
    levelXp: 0,
    speed: 0,
    bulletSpeed: 0,
    bulletDmg: 0,
    pickupRadius: 0,
}

export const resetStats = () => {
    stats.health = INIT_MAX_HEALTH
    stats.maxHealth = INIT_MAX_HEALTH
    stats.xp = 0
    stats.levelXp = INIT_LEVEL_XP
    stats.speed = INIT_SPEED
    stats.bulletSpeed = INIT_BULLET_SPEED
    stats.bulletDmg = INIT_BULLET_DMG
    stats.pickupRadius = INIT_PICKUP_RADIUS
}

export const increaseXp = () => {
    stats.xp += COIN_XP
    if (stats.xp > stats.levelXp) {
        stats.xp = 0
        powerupMenu()
    }
}
