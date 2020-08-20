export default class Mario extends Phaser.GameObjects.Sprite {

  constructor(config) {

    super(config.scene, config.x, config.y, config.key);
    config.scene.physics.world.enable(this);
    config.scene.physics.world.setBounds(0,0,3392, 240);
    config.scene.add.existing(this);
    this.body.setMaxVelocity(150, 250);
    this.body.setDrag(500);
    this.createAnimations(config.scene);
    this.anims.play('stand');
    this.body.setSize(16, 16);
    this.jumpCount = 0;
    this.body.collideWorldBounds = true;
    //this.setCollideWorldBounds(true);
    //this.onWorldBounds = true;
    //this.body.onCollide = new Phaser.Signal();
    //this.body.onCollide.add(hitSprite, this);

  }

  update(keys, time, delta) {

    // aqui testa se o movimento de jumping pode acorrer
    if (keys.up.isDown &&
        this.body.blocked.down &&
        this.body.velocity.y == 0 &&
        this.jumpCount == 0
        ) {

      this.anims.play('jump');
      this.jumpCount = 10;
      this.body.setAccelerationY(-2500);

      // aqui liga um intervalo que funciona enquanto ele está no ar
      this.jumpInterval = setInterval(()=>{
        if (keys.up.isDown)
          this.body.setAccelerationY(-2500);
        else
          this.body.setAccelerationY(0);
        this.jumpCount--;
        if (this.jumpCount == 0 || this.body.blocked.down) {
          clearInterval(this.jumpInterval);
          this.body.setAccelerationY(0);
          this.jumpCount = 0;
        }
      }, 25);
    }

    if (keys.right.isDown) {
      //console.log('seta direita');
      this.flipX = false;
      if (!this.body.blocked.down) {
        this.body.setAccelerationX(150);
      }
      else {
        this.body.setAccelerationX(700);
        if (!this.jumpCount) {
          if (this.body.velocity.x < 0)
            this.anims.play('turn', true);
          else
            this.anims.play('walk', true);
        }

      }
    }
    else if (keys.left.isDown) {
      this.flipX = true;
      if (!this.body.blocked.down) {
        this.body.setAccelerationX(-150);
      }
      else {
        this.body.setAccelerationX(-700);
        if (!this.jumpCount) {
          if (this.body.velocity.x > 0)
            this.anims.play('turn', true);
          else
            this.anims.play('walk', true);
        }
      }
    }
    else if (keys.down.isDown) {
      this.body.setAccelerationY(1000);
      //this.anims.play('walk-down', true);
    }

    // se nenhuma das teclas estão pressionadas
    if (!keys.left.isDown && !keys.right.isDown) {
      this.body.setAccelerationX(0);
    }

    // se nenhuma das teclas estão pressionadas
    if (!keys.up.isDown && !keys.down.isDown) {
      this.body.setAccelerationY(0);
    }

    // aqui fica na posicao de stand se ele está parado, está no chao e nao está pulando
    if (this.body.speed < 6 && this.body.blocked.down && this.jumpCount == 0) {
      this.anims.play('stand', true);
    }

  }

  createAnimations(scene) {
    // animacao para o hero
    scene.anims.create({
      key: 'walk',
      repeat: -1,
      frameRate: 10,
      frames: scene.anims.generateFrameNames('mario-sprites', {prefix: 'mario/walk', start: 1, end: 3 }),
    });

    scene.anims.create({
      key: 'swim',
      repeat: -1,
      frameRate: 10,
      frames: scene.anims.generateFrameNames('mario-sprites', {prefix: 'mario/swim', start: 1, end: 6 }),
    });

    scene.anims.create({
      key: 'climb',
      repeat: -1,
      frameRate: 10,
      frames: scene.anims.generateFrameNames('mario-sprites', {prefix: 'mario/swin', start: 1, end: 2 }),
    });

    scene.anims.create({
      key: 'stand',
      repeat: -1,
      frameRate: 10,
      frames: [{frame: 'mario/stand', key: 'mario-sprites'}],
    });

    scene.anims.create({
      key: 'turn',
      repeat: -1,
      frameRate: 10,
      frames: [{frame: 'mario/turn', key: 'mario-sprites'}],
    });

    scene.anims.create({
      key: 'jump',
      repeat: -1,
      frameRate: 10,
      frames: [{frame: 'mario/jump', key: 'mario-sprites'}],
    });

    scene.anims.create({
        key: 'grow',
        frames: [
          {frame: 'mario/half', key: 'mario-sprites'},
          {frame: 'mario/stand', key: 'mario-sprites'},
          {frame: 'mario/half', key: 'mario-sprites'},
          {frame: 'mario/standSuper', key: 'mario-sprites'},
          {frame: 'mario/half', key: 'mario-sprites'},
          {frame: 'mario/standSuper', key: 'mario-sprites'},
        ],
        frameRate: 1,
        repeat: 0,
        repeatDelay: 0
    });


  }


}// end class
