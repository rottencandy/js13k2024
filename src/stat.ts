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
    INIT_ORBS_DMG,
    INIT_ORBS_RADIUS,
    INC_ORBS_RADIUS,
    INC_ORBS_DMG,
    MAX_ORBS_NUM,
    MAX_ORBS_RADIUS,
    MAX_ORBS_DMG,
    MAX_HERO_SPEED,
    INC_HERO_SPEED,
    DEC_SABER_FIRE_RATE,
    INIT_SABER_FIRE_RATE,
    SABER_DMG_INC,
    MIN_SABER_FIRE_RATE,
    SABER_MAX_DMG,
    INIT_SABER_DMG,
} from "./const"
import { clamp, pickRandom } from "./core/math"
import { powerupMenu } from "./scene"
import {
    updateAuraDmgRate,
    updateBulletFireRate,
    updateSaberFireRate,
} from "./weapon"

export const enum Powerup {
    bulletDamage,
    bulletFireRate,

    maxHealth,
    movementSpeed,

    auraRadius,
    auraDamage,
    auraDamageRate,

    orbNum,
    orbRadius,
    orbDamage,

    lightsaberFireRate,
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
        case Powerup.orbNum:
        case Powerup.orbRadius:
        case Powerup.orbDamage:
            return assets.eOrbs
        case Powerup.movementSpeed:
            return assets.eShoes
        case Powerup.lightsaberFireRate:
        case Powerup.lightsaberDamage:
            return assets.eSaber

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
            return "+POWER"
        case Powerup.orbNum:
            return stats.orbs > 0 ? "+1 ORB" : "ORB"
        case Powerup.orbRadius:
            return "+RADIUS"
        case Powerup.orbDamage:
            return "+DAMAGE"
        case Powerup.movementSpeed:
            return "+MOVE SPEED"
        case Powerup.lightsaberFireRate:
            return "+FIRE RATE"
        case Powerup.lightsaberDamage:
            return stats.saber ? "+FIRE RATE" : "LIGHTSABER"

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
        case Powerup.orbNum:
            stats.orbs += 1
            break
        case Powerup.orbRadius:
            stats.orbRadius += INC_ORBS_RADIUS
            break
        case Powerup.orbDamage:
            stats.orbsDmg += INC_ORBS_DMG
            break
        case Powerup.movementSpeed:
            stats.speed += INC_HERO_SPEED
            break
        case Powerup.lightsaberFireRate:
            stats.saber = true
            stats.saberRate -= DEC_SABER_FIRE_RATE
            updateSaberFireRate()
            break
        case Powerup.lightsaberDamage:
            stats.saberDmg += SABER_DMG_INC
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
            Powerup.orbNum,
            Powerup.orbRadius,
            Powerup.orbDamage,
            Powerup.movementSpeed,
            Powerup.lightsaberDamage,
            Powerup.lightsaberFireRate,

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
        case Powerup.orbNum:
            return stats.orbs < MAX_ORBS_NUM
        case Powerup.orbRadius:
            return stats.orbs > 0 && stats.orbRadius < MAX_ORBS_RADIUS
        case Powerup.orbDamage:
            return stats.orbs > 0 && stats.orbsDmg < MAX_ORBS_DMG
        case Powerup.movementSpeed:
            return stats.speed < MAX_HERO_SPEED

        case Powerup.lightsaberFireRate:
            return stats.saberRate > MIN_SABER_FIRE_RATE
        case Powerup.lightsaberDamage:
            return stats.saber && stats.saberDmg < SABER_MAX_DMG

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
    time: 0,
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

    orbs: 0,
    orbRadius: 0,
    orbsDmg: 0,

    // enabled or not
    saber: false,
    saberRate: 0,
    saberDmg: 0,

    pickupRadius: 0,
}

export const resetStats = () => {
    stats.time = 0
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

    stats.orbs = 0
    stats.orbRadius = INIT_ORBS_RADIUS
    stats.orbsDmg = INIT_ORBS_DMG

    stats.saber = false
    stats.saberRate = INIT_SABER_FIRE_RATE
    stats.saberDmg = INIT_SABER_DMG

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
