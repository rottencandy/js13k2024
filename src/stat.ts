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
} from "./const"
import { pickRandom } from "./core/math"
import { powerupMenu } from "./scene"
import { updateBulletFireRate } from "./weapon"

export const enum Powerup {
    bulletDamage,
    bulletFireRate,
    bulletPenetration,

    bombFireRate,
    bombDamage,

    auraRadius,
    auraDamage,

    lightsaberSize,
    lightsaberDamage,

    maxHealth,
    movementSpeed,
    regeneration,
}

export const powerupSprite = (powerup: Powerup, assets: Assets) => {}

export const enum Item {
    heal,
    tempCoinMagnet,
    tempFlamethrower,
    tempStopTime,
    killAllVisibleMobs,
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
    }
}

const useItem = (item: Item) => {
    switch (item) {
    }
}

export const randomPowerup = () => {
    return pickRandom([Powerup.bulletDamage, Powerup.bulletFireRate])
}

const randomItem = () => {
    return pickRandom([Item.heal])
}

export const increaseMaxHealth = (amt: number) => {
    stats.health += amt
    stats.maxHealth += amt
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

export const heal = (amt: number) => {
    stats.health += amt
    stats.maxHealth += amt
}
