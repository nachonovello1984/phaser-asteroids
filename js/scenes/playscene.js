import Shoot from './../gameObjects/shoot.js';
import Asteroid from '../gameObjects/asteroid.js';

export default class PlayScene extends Phaser.Scene {

    constructor() {
        super({ key: 'PlayScene', active: true });
        this.lastFired = 0;
        this.asteroidElapsedTime = 3000;
    }

    preload() {
        this.load.image('background', './img/background.png');
        this.load.image('ship', './img/ship.png');
        this.load.image('asteroid-1', './img/asteroid-1.png');
        this.load.image('shoot', './img/shoot.png');
    }

    create() {

        this.add.image(0, 0, 'background');
        this.add.image(640, 0, 'background');
        this.add.image(0, 480, 'background');
        this.add.image(640, 480, 'background');

        this.ship = this.physics.add.image(400, 300, 'ship');
        this.ship.setDamping(true);
        this.ship.setDrag(0.99);
        this.ship.setMaxVelocity(200);
        this.ship.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.shootsGroup = this.physics.add.group({
            classType: Shoot,
            maxSize: 10,
            runChildUpdate: true
        });

        this.asteroidsGroup = this.physics.add.group();

        this.asteroidsArray = [];

        this.asteroidsTimedEvent = this.time.addEvent({
            delay: this.asteroidElapsedTime,
            callback: this.addAsteroid,
            callbackScope: this,
            loop: true
        });
    }

    update(time, delta) {
        if (this.cursors.up.isDown) {
            this.physics.velocityFromRotation(this.ship.rotation, 200, this.ship.body.acceleration);
        } else {
            this.ship.setAcceleration(0);
        }

        if (this.cursors.space.isDown && time > this.lastFired) {
            let shoot = this.shootsGroup.get();

            if (shoot) {
                shoot.fire(this.ship.x, this.ship.y, this.ship.rotation);

                this.lastFired = time + 50;
            }
        }

        if (this.cursors.left.isDown) {
            this.ship.setAngularVelocity(-300);
        } else if (this.cursors.right.isDown) {
            this.ship.setAngularVelocity(300);
        } else {
            this.ship.setAngularVelocity(0);
        }

        this.asteroidsArray = this.asteroidsArray.filter(function (asteroid) {
            return asteroid.active;
        });

        for (let asteroid of this.asteroidsArray) {
            if (!asteroid.isOrbiting()) {
                asteroid.fire(this.ship.x, this.ship.y);
            }

            asteroid.update(time, delta);
        }
    }

    addAsteroid() {
        let asteroid = new Asteroid(this, 200, 300, 'asteroid-1', 0);
        this.asteroidsGroup.add(asteroid, true);
        this.asteroidsArray.push(asteroid);

    }
}