import { Assets } from "./asset"
import {
    COIN_XP,
    INIT_BULLET_DMG,
    INIT_LEVEL_XP,
    INIT_HEALTH_CAP,
    INIT_PICKUP_RADIUS,
    INIT_HERO_SPEED,
    LEVEL_XP_CAP_MULTIPLIER,
    BULLET_DMG_INC,
    INIT_BULLET_FIRE_RATE,
    BULLET_FIRE_RATE_DEC,
    MAX_BULLET_DMG,
    MIN_BULLET_FIRE_RATE,
    HEAL_AMT,
    INC_HEALTH_CAP,
    MAX_HEALTH_CAP,
} from "./const"
import { clamp, pickRandom } from "./core/math"
import { powerupMenu } from "./scene"
import { updateBulletFireRate } from "./weapon"

export const enum Powerup {
    bulletDamage,
    bulletFireRate,

    maxHealth,
    movementSpeed,
    regeneration,

    auraRadius,
    auraDamage,

    bombFireRate,
    bombDamage,

    lightsaberSize,
    lightsaberDamage,

    // non-exhaustible , single-use items
    heal,
    tempCoinMagnet,
    tempFlamethrower,
    tempStopTime,
    killAllVisibleMobs,
}

export const powerupSprite = (powerup: Powerup, assets: Assets) => {
    switch (powerup) {
        case Powerup.bulletDamage:
        case Powerup.bulletFireRate:
            return assets.eBullet
        case Powerup.maxHealth:
            return assets.eHeart
        case Powerup.bombFireRate:
        case Powerup.bombDamage:
        case Powerup.auraRadius:
        case Powerup.auraDamage:
        case Powerup.lightsaberSize:
        case Powerup.lightsaberDamage:
        case Powerup.movementSpeed:
        case Powerup.regeneration:
            return assets.eXp

        case Powerup.heal:
            return assets.eHeart
        case Powerup.tempCoinMagnet:
        case Powerup.tempFlamethrower:
        case Powerup.tempStopTime:
        case Powerup.killAllVisibleMobs:
            return assets.eHeart
    }
}

export const powerupText = (powerup: Powerup) => {
    switch (powerup) {
        case Powerup.bulletDamage:
            return "+DAMAGE"
        case Powerup.bulletFireRate:
            return "+FIRE RATE"
        case Powerup.maxHealth:
            return "+MAX HEALTH"
        case Powerup.movementSpeed:
        case Powerup.regeneration:
        case Powerup.bombFireRate:
        case Powerup.bombDamage:
        case Powerup.auraRadius:
        case Powerup.auraDamage:
        case Powerup.lightsaberSize:
        case Powerup.lightsaberDamage:

        case Powerup.heal:
            return "HEAL"
        case Powerup.tempCoinMagnet:
        case Powerup.tempFlamethrower:
        case Powerup.tempStopTime:
        case Powerup.killAllVisibleMobs:
            return "2x"
    }
}

export const usePowerup = (power: Powerup) => {
    switch (power) {
        case Powerup.bulletDamage:
            stats.bulletDmg += BULLET_DMG_INC
            break
        case Powerup.bulletFireRate:
            stats.bulletRate -= BULLET_FIRE_RATE_DEC
            updateBulletFireRate()
            break
        case Powerup.maxHealth:
            stats.maxHealth += INC_HEALTH_CAP

        case Powerup.heal:
            stats.health = clamp(stats.health + HEAL_AMT, 0, stats.maxHealth)
            break
    }
}

export const randomPowerup = () => {
    return pickRandom(
        [
            Powerup.bulletDamage,
            Powerup.bulletFireRate,
            Powerup.maxHealth,

            Powerup.heal,
        ].filter(unlockable),
    )
}

const unlockable = (powerup: Powerup) => {
    switch (powerup) {
        case Powerup.bulletDamage:
            return stats.bulletDmg < MAX_BULLET_DMG
        case Powerup.bulletFireRate:
            return stats.bulletRate > MIN_BULLET_FIRE_RATE
        case Powerup.maxHealth:
            return stats.maxHealth < MAX_HEALTH_CAP
        case Powerup.bombFireRate:
        case Powerup.bombDamage:
        case Powerup.auraRadius:
        case Powerup.auraDamage:
        case Powerup.lightsaberSize:
        case Powerup.lightsaberDamage:
        case Powerup.movementSpeed:
        case Powerup.regeneration:
            return false

        // these are consumables and do not max out
        case Powerup.heal:
        case Powerup.tempCoinMagnet:
        case Powerup.tempFlamethrower:
        case Powerup.tempStopTime:
        case Powerup.killAllVisibleMobs:
            return true
    }
}

export const stats = {
    health: 0,
    maxHealth: 0,
    xp: 0,
    levelXp: 0,
    speed: 0,

    bulletDmg: 0,
    bulletRate: 0,

    pickupRadius: 0,
}

export const resetStats = () => {
    stats.health = INIT_HEALTH_CAP
    stats.maxHealth = INIT_HEALTH_CAP
    stats.xp = 0
    stats.levelXp = INIT_LEVEL_XP
    stats.speed = INIT_HERO_SPEED

    stats.bulletDmg = INIT_BULLET_DMG
    stats.bulletRate = INIT_BULLET_FIRE_RATE
    stats.pickupRadius = INIT_PICKUP_RADIUS
}

export const increaseXp = () => {
    stats.xp += COIN_XP
    if (stats.xp > stats.levelXp) {
        stats.xp -= stats.levelXp
        stats.levelXp *= LEVEL_XP_CAP_MULTIPLIER
        powerupMenu()
    }
}
