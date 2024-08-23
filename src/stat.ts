import {
    INIT_BULLET_DMG,
    INIT_BULLET_SPEED,
    INIT_MAX_HEALTH,
    INIT_SPEED,
} from "./const"

export const stats = {
    health: 0,
    maxHealth: 0,
    speed: 0,
    bulletSpeed: 0,
    bulletDmg: 0,
}

export const resetStats = () => {
    stats.health = INIT_MAX_HEALTH
    stats.maxHealth = INIT_MAX_HEALTH
    stats.speed = INIT_SPEED
    stats.bulletSpeed = INIT_BULLET_SPEED
    stats.bulletDmg = INIT_BULLET_DMG
}
