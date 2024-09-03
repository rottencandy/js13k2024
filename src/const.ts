// game settings
export const DEBUG = true
export const WIDTH = 640
export const HEIGHT = 360
export const JOYSTICK_SIZE = 150
export const JOYSTICK_THUMB_SIZE = 50

// ui
export const FONT_SIZE = 5
export const UI_BAR_WIDTH = WIDTH - 40
export const UI_BAR_HEIGHT = 10
export const UI_TEXT_DURATION = 300
export const UI_HEALTH_BAR_Y = 20
export const UI_BAR_X = (WIDTH - UI_BAR_WIDTH) / 2
export const UI_XP_BAR_Y = 40
export const UI_TRANSITION_DURATION = 900

// gameplay
export const SPRITE_ANIM_RATE_MS = 300
export const SPAWN_RADIUS = HEIGHT / 2
export const COIN_XP = 50
export const COIN_PICKUP_SPEED = 0.05
export const MAX_BULLET_AGE = 3e3
export const HERO_MOB_COLLISION_PROXIMITY = HEIGHT / 2

export const MOB_SPEED = 0.04
export const MOB_HEALTH = 5
export const MOB_ATTACK = 10
export const MOB_MAX_COLLISION_SNAP_DIST = 4

export const INIT_LEVEL_XP = 100
export const LEVEL_XP_CAP_MULTIPLIER = 1.5

// powerups
export const BULLET_SPEED = 0.2
export const INIT_BULLET_DMG = 10
export const BULLET_DMG_MULTIPLIER = 1.5
export const MAX_BULLET_DMG = 50
export const INIT_BULLET_FIRE_RATE_MS = 2e3
export const MAX_BULLET_FIRE_RATE_MS = 200

export const INIT_HERO_SPEED = 0.25
export const INIT_HEALTH_CAP = 100
export const INIT_VULNERABILITY_MS = 1e3

export const INIT_SPAWN_RATE = 1e3

export const INIT_PICKUP_RADIUS = 30

// misc types
export const enum Dir {
    left,
    right,
}
