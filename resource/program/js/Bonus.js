// js/classes/Bonus.js
class Bonus {
    constructor(x, type, assets) {
        this.size = 30;
        this.x = x;
        this.y = -this.size;
        this.speed = newGlobalSpeed / 2;
        this.type = type;
        this.isCollected = false;
        this.assets = assets;
        this.icons = [
            assets.bonus.star,
            assets.bonus.star1,
            assets.bonus.star2
        ];
        this.onScreen = true;
    }

    update() {
        if (!this.isCollected) {
            this.y += this.speed;
            if (this.y > height) {
                this.onScreen = false;
            }
        }
    }

    display() {
        if (!this.isCollected) {
            image(this.icons[this.type], this.x, this.y, this.size, this.size);
        }
    }

    checkCollection(player) {
        if (!this.isCollected &&
            player.x - 25 >= this.x - 50 && // Adjust for center positioning
            player.x - 25 <= this.x + this.size &&
            player.y - 25 >= this.y - 50 &&
            player.y - 25 <= this.y + this.size) {
            this.isCollected = true;
            this.applyEffect(player);
        }
    }

    applyEffect(player) {
        switch(this.type) {
            case 0: // Civilian
                bonusScore = scoreIncrement * 2;
                break;
            case 1: // Slow down time
                bonusBegin = millis();
                newGlobalSpeed = globalSpeed / 2;
                scoreIncrement = 0.0025;
                break;
            case 2: // Invisible
                bonusBegin = millis();
                player.opacity = 128;
                invisible = true;
                break;
        }
    }

    checkEffectDuration() {
        if (millis() - bonusBegin > CONFIG.GAME.BONUS.EFFECT_DURATION) {
            this.removeEffect();
        }
    }

    removeEffect() {
        newGlobalSpeed = globalSpeed;
        scoreIncrement = CONFIG.GAME.SCORE.INCREMENT;
        playerOpacity = 255;
        invisible = false;
    }
}