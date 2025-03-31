// Fixed Animation.js
class Animation {
    constructor(images, x, y) {
        this.x = x;
        this.y = y;
        // Store reference to shared images array instead of copying
        this.images = images; 
        this.index = 0;
        this.speed = CONFIG.GAME.GLOBAL_SPEED * 4;
        // Add frame counter to avoid floating point precision issues
        this.frameCount = 0;
    }

    display() {
        const imageIndex = int(this.index);
        if (this.images[imageIndex]) {
            image(this.images[imageIndex], 0, 0);
        }
    }

    move() {
        this.speed = newGlobalSpeed * 4;
        this.y += this.speed;
    }

    next() {
        // Use integer frame counting instead of floating point
        this.frameCount++;
        if (this.frameCount >= 4) { // Adjust speed by changing this number
            this.index = (this.index + 1) % this.images.length;
            this.frameCount = 0;
        }
    }
}