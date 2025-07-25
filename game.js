const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#242424',
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

function preload() {
    // No assets to preload in this simple game
}

function create() {
    // Create the ball as a circle with physics enabled
    ball = this.physics.add.circle(400, 300, 12, 0xff0000);
    ball.body.setCollideWorldBounds(true);
    ball.body.setBounce(1, 1);
    ball.body.setVelocity(150, -150);

    // Create a paddle that the player controls
    paddle = this.add.rectangle(400, 550, 100, 20, 0xffffff);
    this.physics.add.existing(paddle);
    paddle.body.setCollideWorldBounds(true);
    paddle.body.setImmovable(true);

    // Add collision between the ball and the paddle
    this.physics.add.collider(ball, paddle, hitPaddle, null, this);

    // Set up cursor input for paddle movement
    cursors = this.input.keyboard.createCursorKeys();

    // Display score text
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '20px', fill: '#ffffff' });
}

function update() {
    // Reset paddle velocity
    paddle.body.setVelocityX(0);

    // Move paddle based on cursor input
    if (cursors.left.isDown) {
        paddle.body.setVelocityX(-300);
    } else if (cursors.right.isDown) {
        paddle.body.setVelocityX(300);
    }

    // Keep paddle within game bounds
    paddle.x = Phaser.Math.Clamp(paddle.x, paddle.width / 2, config.width - paddle.width / 2);

    // Reset ball if it goes past the bottom edge
    if (ball.y > config.height) {
        ball.setPosition(config.width / 2, config.height / 2);
        ball.body.setVelocity(150, -150);
        score = 0;
        scoreText.setText('Score: ' + score);
    }
}

function hitPaddle(ballObj, paddleObj) {
    // Increase score when the ball hits the paddle
    score += 1;
    scoreText.setText('Score: ' + score);
}

const game = new Phaser.Game(config);
