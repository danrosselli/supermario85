export default class Coin extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
        config.scene.physics.world.enable(this);
        config.scene.physics.world.setBounds(0,0,3392, 240);
        config.scene.add.existing(this);
        //config.scene.physics.add.collider(this, config.tilemap);
        // é só no play q ele desenha a moeda animada
        this.createAnimations(config.scene);
        this.anims.play('spin');
        //let tween = config.scene.add.tween(this).to({y:0}, 1000, Phaser.Easing.Sinusoidal.InOut, true);
        //tween.start();
        /*
        config.scene.add.tween({
          targets: this,
          ease: 'Sine.easeInOut',
          offset:
        });
        */
        this.body.setSize(16, 16);
    }

    update() {

    }

    disapear() {

    }

    createAnimations(scene) {

      scene.anims.create({
        key: 'coin',
        repeat: -1,
        frameRate: 5,
        frames: scene.anims.generateFrameNames('mario-sprites', {prefix: 'coin/coin', start: 1, end: 3 }),
      });

      scene.anims.create({
        key: 'spin',
        repeat: -1,
        frameRate: 20,
        frames: scene.anims.generateFrameNames('mario-sprites', {prefix: 'coin/spin', start: 1, end: 4 }),
      });

      scene.anims.create({
        key: 'disapear',
        repeat: 3,
        frameRate: 10,
        frames: [
          {frame: 'coin/spin1', key: 'mario-sprites'},
          {frame: 'coin/spin2', key: 'mario-sprites'},
          {frame: 'coin/spin3', key: 'mario-sprites'},
          {frame: 'coin/spin4', key: 'mario-sprites'},
        ],
      });

    }
}
