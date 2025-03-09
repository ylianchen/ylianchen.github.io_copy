// Updated main.js
let assetLoader;
let player;
let animations = [];
let bonus;
let chaser;
// Removed roadblock variable
let gameState = {
    screen: 0,
    score: 0,
    collision: false,
    startTime: 0,
    lastChaserSpawn: 0,
    // Removed lastRoadblockSpawn
    lastBonusSpawn: 0
};

let globalSpeed = CONFIG.GAME.GLOBAL_SPEED;
let newGlobalSpeed = globalSpeed;
let bonusScore = 0;
let bonusBegin;
let invisible = false;
let scoreIncrement = CONFIG.GAME.SCORE.INCREMENT;

function preload() {
    assetLoader = new AssetLoader();
    assetLoader.loadGameAssets();
}

function setup() {
    createCanvas(CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT);
    frameRate(CONFIG.CANVAS.FRAME_RATE);
    
    player = new Player(assetLoader);
    initializeAnimations();
    resetGame();
}

function initializeAnimations() {
    // Clear existing animations first
    animations = [];
    
    // Create animation instances
    // Only create a small number of animations and share the image references
    const numAnimations = 2; // Two animations is enough for scrolling effect
    
    for (let i = 0; i < numAnimations; i++) {
        animations.push(new Animation(
            assetLoader.assets.animations,
            0,
            -i * CONFIG.CANVAS.HEIGHT
        ));
    }
}

function resetGame() {
    // Clean up existing game objects
    cleanup();
    
    gameState.score = 0;
    gameState.collision = false;
    gameState.startTime = millis();
    gameState.lastChaserSpawn = millis();
    // Removed lastRoadblockSpawn reset
    gameState.lastBonusSpawn = millis();
    
    globalSpeed = CONFIG.GAME.GLOBAL_SPEED;
    newGlobalSpeed = globalSpeed;
    scoreIncrement = CONFIG.GAME.SCORE.INCREMENT;
    bonusScore = 0;
    invisible = false;
    
    player.reset();
    bonus = new Bonus(random(200, width-230), int(random(3)), assetLoader.assets);
    chaser = new Chaser(-50, random(200, width-200), 0, newGlobalSpeed, assetLoader.assets);
    // Removed roadblock initialization
}

function cleanup() {
    // Reset game objects
    bonus = null;
    chaser = null;
    // Removed roadblock = null
}

function draw() {
    background(0);
    
    // Check framerate and log warning if it's too low
    const currentFrameRate = frameRate();
    if (currentFrameRate < 30) {
        console.warn('Low frame rate detected:', currentFrameRate);
    }
    
    updateAnimations();
    
    switch(gameState.screen) {
        case 0:
            drawStartScreen();
            break;
        case 1:
            drawGameplay();
            break;
        case 2:
            drawGameOver();
            break;
    }
}

function updateAnimations() {
    for (let anim of animations) {
        anim.display();
        anim.next();
        anim.move();
        
        if (anim.y > CONFIG.CANVAS.HEIGHT) {
            anim.y = -CONFIG.CANVAS.HEIGHT;
        }
    }
}

function drawStartScreen() {
    image(assetLoader.assets.title, 0, 0);
    
    textSize(32);
    textAlign(CENTER);
    fill(255);
    text("Select Your Car", width/2, 350);
    text("<", 220, 420);
    text(">", 460, 420);
    
    let selectedCarImg = player.selectedCar === 0 ? 
        assetLoader.assets.cars.player1 : 
        assetLoader.assets.cars.player2;
    image(selectedCarImg, width/2 - 25, 380);
    
    text("Press SPACE to Start", width/2, height - 100);
}

function drawGameplay() {
    player.move();
    player.display();
    
    if (bonus && !bonus.isCollected && bonus.onScreen) {
        bonus.update();
        bonus.display();
        bonus.checkCollection(player);
        bonus.checkEffectDuration();
    }
    
    if (!bonus || !bonus.onScreen || bonus.isCollected) {
        if (millis() - gameState.lastBonusSpawn > CONFIG.GAME.BONUS.SPAWN_CYCLE) {
            bonus = new Bonus(random(200, width-230), int(random(3)), assetLoader.assets);
            gameState.lastBonusSpawn = millis();
        }
    }
    
    updateEnemies();
    
    gameState.score += scoreIncrement + bonusScore;
    
    textSize(24);
    textAlign(LEFT);
    fill(255);
    text(`Score: ${Math.floor(gameState.score)}`, 20, 30);
    
    if (!invisible && checkChaserCollision()) {
        // Removed roadblock collision check
        gameState.collision = true;
        gameState.screen = 2;
    }
}

function updateEnemies() {
    if (!chaser || !chaser.onScreen) {
        if (millis() - gameState.lastChaserSpawn > CONFIG.GAME.ENEMIES.CHASER_SPAWN_CYCLE) {
            chaser = new Chaser(-50, random(200, width-200), 0, newGlobalSpeed, assetLoader.assets);
            gameState.lastChaserSpawn = millis();
        }
    }
    
    // Removed roadblock spawning code
    
    if (chaser && chaser.onScreen) {
        chaser.update(player.x);
        chaser.display();
    }
    
    // Removed roadblock update and display
}

function drawGameOver() {
    textSize(48);
    textAlign(CENTER);
    fill(255, 0, 0);
    text("GAME OVER", width/2, height/2 - 50);
    
    textSize(32);
    fill(255);
    text(`Final Score: ${Math.floor(gameState.score)}`, width/2, height/2 + 20);
    text("Press SPACE to Restart", width/2, height/2 + 80);
}

function checkChaserCollision() {
    return chaser && chaser.onScreen && chaser.isColliding(player);
}

// Removed checkRoadblockCollision function

function keyPressed() {
    switch(gameState.screen) {
        case 0:
            if (keyCode === 32) {
                gameState.screen = 1;
                resetGame();
            }
            break;
            
        case 1:
            player.handleKeyPress(keyCode);
            break;
            
        case 2:
            if (keyCode === 32) {
                gameState.screen = 0;
            }
            break;
    }
}

function keyReleased() {
    if (gameState.screen === 1) {
        player.handleKeyRelease();
    }
}

function mousePressed() {
    if (gameState.screen === 0) {
        if (mouseX < 240 && mouseX > 215 && mouseY < 440 && mouseY > 400) {
            player.selectedCar = (player.selectedCar - 1 + 2) % 2;
        }
        if (mouseX < 465 && mouseX > 440 && mouseY < 440 && mouseY > 400) {
            player.selectedCar = (player.selectedCar + 1) % 2;
        }
    }
}