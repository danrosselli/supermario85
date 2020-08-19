export default class Mario extends Phaser.GameObjects.Sprite {

  constructor(config) {

    super(config.scene, config.x, config.y, config.key);
    config.scene.physics.world.enable(this);
    config.scene.physics.world.setBounds(0,0,3392, 240);
    config.scene.add.existing(this);
    this.body.setMaxVelocity(150, 250);
    this.body.setDrag(500);
    this.anims.play('stand');
    this.body.setSize(16, 16);
    this.jumpCount = 0;
    this.body.collideWorldBounds = true;
    //this.setCollideWorldBounds(true);
    //this.onWorldBounds = true;
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


}// end class
