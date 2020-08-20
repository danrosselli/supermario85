export default class Coin extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
        config.scene.physics.world.enable(this);
        config.scene.physics.world.setBounds(0,0,3392, 240);
        config.scene.add.existing(this);
        config.scene.physics.add.collider(this, config.tilemap);
        // é só no play q ele desenha a moeda animada
        this.createAnimations(config.scene);
        this.anims.play('coin');
        this.body.setSize(16, 16);
    }

    update() {

    }

    createAnimations(scene) {
      scene.anims.create({
        key: 'coin',
        repeat: -1,
        frameRate: 5,
        frames: scene.anims.generateFrameNames('mario-sprites', {prefix: 'coin/coin', start: 1, end: 3 }),
      });
    }
}
