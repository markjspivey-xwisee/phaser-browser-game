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

function preload() {
    // no assets to preload
}

function create() {
    // Create a red circle graphics object and enable physics on it
    ball = this.add.circle(400, 300, 25, 0xff0000);
    this.physics.add.existing(ball);
    ball.body.setCollideWorldBounds(true);
    ball.body.setBounce(1, 1);
    ball.body.setVelocity(150, -150);
}

function update() {
    // nothing needed here for now
}

const game = new Phaser.Game(config);
