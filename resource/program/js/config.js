// js/config.js
const CONFIG = {
    CANVAS: {
        WIDTH: 680,
        HEIGHT: 680,
        FRAME_RATE: 60
    },
    PATHS: {
        IMAGES: {
            CAR: './assets/images/car/',
            BONUS: './assets/images/bonus/',
            ANIMATIONS: './assets/images/animations/',
            TITLE: './assets/images/title/'
        }
    },
    GAME: {
        GLOBAL_SPEED: 0.25,
        BONUS: {
            SPAWN_CYCLE: 5000,
            EFFECT_DURATION: 7000
        },
        ENEMIES: {
            CHASER_SPAWN_CYCLE: 3000,
            ROADBLOCK_SPAWN_CYCLE: 2000,
            EASING: 0.001
        },
        SCORE: {
            INCREMENT: 0.005
        }
    }
};
