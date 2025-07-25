const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1e1e1e',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let ball;
let paddle;
let cursors;
let score = 0;
let scoreText;
let bricks;
let gameOver = false;
let gameOverText;

function preload() {
    // nothing to preload for simple shapes
}

function create() {
    // Create ball
    ball = this.physics.add.circle(config.width / 2, config.height / 2 + 100, 10, 0xff0000);
    ball.body.setCollideWorldBounds(true);
    ball.body.setBounce(1, 1);
    // give initial velocity
    ball.body.setVelocity(150, -150);

    // Create paddle
    paddle = this.add.rectangle(config.width / 2, config.height - 30, 100, 20, 0x00ff00);
    this.physics.add.existing(paddle);
    paddle.body.setCollideWorldBounds(true);
    paddle.body.setImmovable(true);

    // Create bricks group
    bricks = this.physics.add.staticGroup();
    const rows = 3;
    const cols = 10;
    const brickWidth = 60;
    const brickHeight = 20;
    const offsetX = (config.width - cols * brickWidth) / 2 + brickWidth / 2;
    const offsetY = 80;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = offsetX + col * brickWidth;
            const y = offsetY + row * (brickHeight + 10);
            const color = Phaser.Display.Color.RandomRGB().color;
            const brick = this.add.rectangle(x, y, brickWidth - 10, brickHeight, color);
            bricks.add(brick);
        }
    }

    // enable physics for bricks in static group
    bricks.refresh();

    // Colliders
    this.physics.add.collider(ball, paddle, null, null, this);
    this.physics.add.collider(ball, bricks, hitBrick, null, this);

    // Input
    cursors = this.input.keyboard.createCursorKeys();

    // Score text
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '20px', fill: '#ffffff' });
    gameOverText = this.add.text(config.width / 2, config.height / 2, '', { fontSize: '32px', fill: '#ffffff' });
    gameOverText.setOrigin(0.5);
}

function update() {
    if (gameOver) {
        // stop game update once game over
        return;
    }

    // Paddle movement
    paddle.body.setVelocityX(0);
    if (cursors.left.isDown) {
        paddle.body.setVelocityX(-300);
    } else if (cursors.right.isDown) {
        paddle.body.setVelocityX(300);
    }

    // Clamp paddle position (because body setVelocityX may allow overshoot)
    paddle.x = Phaser.Math.Clamp(paddle.x, paddle.width / 2, config.width - paddle.width / 2);

    // Check for ball falling off screen
    if (ball.y > config.height) {
        gameOver = true;
        gameOverText.setText('Game Over');
        this.physics.pause();
    }

    // Check if all bricks destroyed
    if (bricks.countActive() === 0) {
        gameOver = true;
        gameOverText.setText('You Win!');
        this.physics.pause();
    }
}

function hitBrick(ballObj, brickObj) {
    // Disable brick
    brickObj.disableBody(true, true);
    // Increase score
    score += 10;
    scoreText.setText('Score: ' + score);
    // For variety, invert Y velocity
    ballObj.body.setVelocityY(-ballObj.body.velocity.y);
}

const game = new Phaser.Game(config);
