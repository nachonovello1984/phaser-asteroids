import PlayScene from './scenes/playscene.js';

const config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    physics:{
        default: "arcade",
        arcade: {
            fps: 60,
            gravity: { y: 0 }
        }
    },
    scene: [PlayScene]
}

const game = new Phaser.Game(config);