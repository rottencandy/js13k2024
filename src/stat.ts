import { Assets } from "./asset"
import {
    BULLET_DMG_INC,
    BULLET_FIRE_RATE_DEC,
    COIN_XP,
    DEC_AURA_DAMAGE_RATE,
    DEC_SABER_FIRE_RATE,
    HEAL_AMT,
    INC_AURA_DAMAGE,
    INC_AURA_RADIUS,
    INC_HEALTH_CAP,
    INC_HERO_SPEED,
    INC_ORBS_DMG,
    INC_ORBS_RADIUS,
    INC_PICKUP_RADIUS,
    INIT_AURA_DAMAGE,
    INIT_AURA_DAMAGE_RATE,
    INIT_AURA_RADIUS,
    INIT_BULLET_DMG,
    INIT_BULLET_FIRE_RATE,
    INIT_HEALTH_CAP,
    INIT_HERO_SPEED,
    INIT_LEVEL_XP,
    INIT_ORBS_DMG,
    INIT_ORBS_RADIUS,
    INIT_PICKUP_RADIUS,
    INIT_SABER_DMG,
    INIT_SABER_FIRE_RATE,
    LEVEL_XP_CAP_INC,
    MAX_AURA_DAMAGE,
    MAX_AURA_RADIUS,
    MAX_BULLET_DMG,
    MAX_HEALTH_CAP,
    MAX_HERO_SPEED,
    MAX_ORBS_DMG,
    MAX_ORBS_NUM,
    MAX_ORBS_RADIUS,
    MAX_PICKUP_RADIUS,
    MIN_AURA_DAMAGE_RATE,
    MIN_BULLET_FIRE_RATE,
    MIN_SABER_FIRE_RATE,
    SABER_DMG_INC,
    SABER_MAX_DMG,
} from "./const"
import { clamp, extractRandom } from "./core/math"
import { powerupMenu } from "./scene"
import { playPowerup } from "./sound"
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

    magnet,

    // non-exhaustible , single-use items
    heal,
    //tempFlamethrower,
    //tempStopTime,
    //killAllVisibleMobs,
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
        case Powerup.magnet:
            return assets.eMagnet
        case Powerup.heal:
            return assets.eHeart
    }
}

export const powerupText = (powerup: Powerup) => {
    switch (powerup) {
        case Powerup.bulletDamage:
            return "++BULLET DMG"
        case Powerup.bulletFireRate:
            return "SHOOT FASTER"
        case Powerup.maxHealth:
            return "++MAX HEALTH"
        case Powerup.auraRadius:
            return stats.auraRadius > 0 ? "++PLASMA SIZE" : "PLASMA FIELD"
        case Powerup.auraDamage:
            return "++PLASMA DMG"
        case Powerup.auraDamageRate:
            return "++PLASMA PWR"
        case Powerup.orbNum:
            return stats.orbs > 0 ? "+1 ORB" : "LASER ORB"
        case Powerup.orbRadius:
            return "LARGER SIZE"
        case Powerup.orbDamage:
            return "ORB ++DMG"
        case Powerup.movementSpeed:
            return "MOVE FASTER"
        case Powerup.lightsaberFireRate:
            return stats.saber ? "FASTER THROWS" : "LIGHTSABER"
        case Powerup.lightsaberDamage:
            return "++DMG"
        case Powerup.magnet:
            return "++PICKUP DIST"
        case Powerup.heal:
            return "HEAL"
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
            stats.auraRadius === 0
                ? (stats.auraRadius = INIT_AURA_RADIUS)
                : (stats.auraRadius += INC_AURA_RADIUS)
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
        case Powerup.magnet:
            stats.pickupRadius += INC_PICKUP_RADIUS
            break
        case Powerup.heal:
            stats.health = clamp(stats.health + HEAL_AMT, 0, stats.maxHealth)
            break
    }
}

export const randomPowerups = () => {
    const powers = [
        Powerup.bulletDamage,
        Powerup.bulletFireRate,
        Powerup.maxHealth,
        Powerup.movementSpeed,
        Powerup.auraRadius,
        Powerup.auraDamage,
        Powerup.auraDamageRate,
        Powerup.orbNum,
        Powerup.orbRadius,
        Powerup.orbDamage,
        Powerup.lightsaberDamage,
        Powerup.lightsaberFireRate,
        Powerup.magnet,
        Powerup.heal,
    ].filter(isAvailable)
    // use non-exhaustible items if all powers are maxed out
    if (powers.length < 3) {
        powers.push(Powerup.heal, Powerup.heal)
    }
    return [extractRandom(powers), extractRandom(powers), extractRandom(powers)]
}

const isAvailable = (powerup: Powerup) => {
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

        case Powerup.magnet:
            return stats.pickupRadius < MAX_PICKUP_RADIUS

        // these are consumables and do not max out
        case Powerup.heal:
            return true
    }
}

export const stats = {
    won: false,
    score: 0,
    /** Time passed since game session start, in seconds */
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
    stats.won = false
    stats.score = 0
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
    if (stats.xp >= stats.levelXp) {
        stats.xp -= stats.levelXp
        stats.levelXp += LEVEL_XP_CAP_INC
        powerupMenu()
        playPowerup()
    }
}
