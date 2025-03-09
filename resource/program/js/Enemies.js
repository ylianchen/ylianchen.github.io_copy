// js/classes/Enemies.js

// Removed Roadblock class entirely

class Chaser {
    constructor(y, x, vx, vy, assets) {
        this.y = y;
        this.x = x;
        this.vx = vx;
        // Increased cop car speed by multiplying the default speed
        this.vy = vy ? vy * 1.5 : CONFIG.GAME.GLOBAL_SPEED * 1.5;
        this.copImage = assets.cars.cop;
        this.onScreen = true;
    }

    update(playerX) {
        this.y += this.vy;
        const dx = playerX - this.x;
        // Increased easing factor for more aggressive chasing
        this.x += dx * (CONFIG.GAME.ENEMIES.EASING * 2); 
        
        if (this.y > height) {
            this.onScreen = false;
        }
    }

    display() {
        image(this.copImage, this.x, this.y);
    }

    isColliding(player) {
        return (
            player.x < this.x + 50 &&
            player.x + 50 > this.x &&
            player.y < this.y + 50 &&
            player.y + 50 > this.y
        );
    }
}