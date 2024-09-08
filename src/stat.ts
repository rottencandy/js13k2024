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
    INC_AURA_RADIUS,
    INIT_AURA_DAMAGE,
    INC_AURA_DAMAGE,
    MAX_AURA_RADIUS,
    MAX_AURA_DAMAGE,
    INIT_AURA_DAMAGE_RATE,
    DEC_AURA_DAMAGE_RATE,
    MIN_AURA_DAMAGE_RATE,
} from "./const"
import { clamp, pickRandom } from "./core/math"
import { powerupMenu } from "./scene"
import { updateAuraDmgRate, updateBulletFireRate } from "./weapon"

export const enum Powerup {
    bulletDamage,
    bulletFireRate,

    maxHealth,
    movementSpeed,
    regeneration,

    auraRadius,
    auraDamage,
    auraDamageRate,

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
        case Powerup.auraRadius:
        case Powerup.auraDamage:
        case Powerup.auraDamageRate:
            return assets.ePlasma
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
        case Powerup.auraRadius:
            return stats.auraRadius > 0 ? "+SIZE" : "PLASMA FIELD"
        case Powerup.auraDamage:
            return "+DAMAGE"
        case Powerup.auraDamageRate:
            return "+DAMAGE RATE"
        case Powerup.movementSpeed:
        case Powerup.regeneration:
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
            break
        case Powerup.auraRadius:
            stats.auraRadius += INC_AURA_RADIUS
            break
        case Powerup.auraDamage:
            stats.auraDmg += INC_AURA_DAMAGE
            break
        case Powerup.auraDamageRate:
            stats.auraDmgRate -= DEC_AURA_DAMAGE_RATE
            updateAuraDmgRate()
            break

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
            Powerup.auraRadius,
            Powerup.auraDamage,
            Powerup.auraDamageRate,

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
        case Powerup.auraRadius:
            return stats.auraRadius < MAX_AURA_RADIUS
        case Powerup.auraDamage:
            return stats.auraRadius > 0 && stats.auraDmg < MAX_AURA_DAMAGE
        case Powerup.auraDamageRate:
            return (
                stats.auraRadius > 0 && stats.auraDmgRate > MIN_AURA_DAMAGE_RATE
            )
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

    auraRadius: 0,
    auraDmg: 0,
    auraDmgRate: 0,

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

    stats.auraRadius = 0
    stats.auraDmg = INIT_AURA_DAMAGE
    stats.auraDmgRate = INIT_AURA_DAMAGE_RATE

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
