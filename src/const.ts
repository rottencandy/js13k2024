// config
export const DEBUG = false
export const WIDTH = 320
export const HEIGHT = 180
export const JOYSTICK_SIZE = 30
export const JOYSTICK_THUMB_SIZE = 10

// ui
export const FONT_SIZE = 1
export const MENU_FONT_SIZE = 3
export const UI_BAR_WIDTH = WIDTH / 2
export const UI_BAR_HEIGHT = 5
export const UI_TEXT_DURATION = 300
export const UI_BAR_X = ~~((WIDTH - UI_BAR_WIDTH) / 7)
export const UI_BAR_Y = 10
export const UI_TRANSITION_DURATION = 900
export const BLACK0 = "#212123"
export const BLACK1 = "#352b42"
export const GREY = "#868188"
export const WHITE = "#f2f0e5"
export const RED = "#b45252"
export const BLUE = "#4b80ca"
export const BROWN = "#7b7243"
export const LGREEN = "#a2dcc7"
export const DGREEN = "#567b79"
export const DDGREEN = "#4e584a"

// general
export const SPRITE_ANIM_RATE_MS = 200
export const SPAWN_RADIUS = WIDTH / 2
export const COIN_XP = 10
export const COIN_PICKUP_SPEED = 0.16
export const VULNERABILITY_MS = 700
export const HEAL_AMT = 5

export const INIT_LEVEL_XP = 50
export const LEVEL_XP_CAP_INC = 70

// size of rect inside which mobs are collision tested
export const HERO_MOB_COLLISION_PROXIMITY = WIDTH
// max distance to push away 2 mobs if colliding with each other
export const MOB_MAX_COLLISION_SNAP_DIST = 1

// hero properties
export const INIT_HEALTH_CAP = 100
export const INC_HEALTH_CAP = 20
export const MAX_HEALTH_CAP = 200

export const INIT_HERO_SPEED = 0.06
export const INC_HERO_SPEED = 0.01
export const MAX_HERO_SPEED = 0.15

export const INIT_PICKUP_RADIUS = 20
export const INC_PICKUP_RADIUS = 10
export const MAX_PICKUP_RADIUS = 70

// blob
export const MOB0_SPEED = 0.02
export const MOB0_HEALTH = 10
export const MOB0_ATTACK = 10
// fly
export const MOB1_SPEED = 0.03
export const MOB1_HEALTH = 30
export const MOB1_ATTACK = 12
// zombie
export const MOB2_SPEED = 0.04
export const MOB2_HEALTH = 55
export const MOB2_ATTACK = 20
// ghost
export const MOB3_SPEED = 0.05
export const MOB3_HEALTH = 70
export const MOB3_ATTACK = 30

// gameplay

// bullet
export const INIT_BULLET_FIRE_RATE = 2e3
export const BULLET_FIRE_RATE_DEC = 600
export const MIN_BULLET_FIRE_RATE = 200

export const INIT_BULLET_DMG = 10
export const MAX_BULLET_DMG = 70
export const BULLET_DMG_INC = 10

export const BULLET_SPEED = 0.2
export const BULLET_AGE = 3e3

// aura
export const INIT_AURA_RADIUS = 30
export const INC_AURA_RADIUS = 10
export const MAX_AURA_RADIUS = 60

export const INIT_AURA_DAMAGE = 10
export const INC_AURA_DAMAGE = 7
export const MAX_AURA_DAMAGE = 52

export const INIT_AURA_DAMAGE_RATE = 500
export const DEC_AURA_DAMAGE_RATE = 100
export const MIN_AURA_DAMAGE_RATE = 200

// orbs
export const MAX_ORBS_NUM = 7
export const ORB_CHARGE_TIME = 200
export const ORB_SPIN_SPEED = 4

export const INIT_ORBS_RADIUS = 20
export const INC_ORBS_RADIUS = 10
export const MAX_ORBS_RADIUS = 40

export const INIT_ORBS_DMG = 10
export const INC_ORBS_DMG = 10
export const MAX_ORBS_DMG = 70

//saber
export const SABER_SPEED = 0.09
export const SABER_AGE = 3e3
export const SABER_CHARGE_TIME = 200

export const INIT_SABER_DMG = 20
export const SABER_DMG_INC = 10
export const SABER_MAX_DMG = 55

export const INIT_SABER_FIRE_RATE=3e3
export const DEC_SABER_FIRE_RATE=500
export const MIN_SABER_FIRE_RATE=500
