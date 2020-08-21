import Mario from './sprites/Mario';
import Goomba from './sprites/Goomba';
import Turtle from './sprites/Turtle';
import Coin from './sprites/Coin';
import SMBTileSprite from './sprites/SMBTileSprite';
import Fire from './sprites/Fire';

//import makeAnimations from './helpers/animations';

class GameScene extends Phaser.Scene {

  constructor(test) {
    super({
      key: 'GameScene'
    });
  }

  preload() {

    // Music to play. It's not properly edited for an continous loop, but game play experience isn't really the aim of this repository either.
    this.load.audio('overworld', [
        'assets/audio/overworld.ogg',
        'assets/audio/overworld.mp3'
    ]);

    // Sound effects in a audioSprite.
    this.load.audioSprite('sfx', 'assets/audio/sfx.json', [
        'assets/audio/sfx.ogg',
        'assets/audio/sfx.mp3'
    ], {
        instances: 4
    });

    //this.load.image('blue-sky', 'assets/images/blue-sky.png'); // 16-bit later
    this.load.image('clouds', 'assets/images/clouds.png'); // 16-bit later

    // tilemap
    this.load.image('SuperMarioBros-World1-1', 'assets/tilemaps/tiles/super-mario.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/super-mario.json');

    // carrega os sprites
    // Support for switching between 8-bit and 16-bit tiles
    //this.load.spritesheet('tiles', 'assets/tilemaps/tiles/super-mario.png', {frameWidth: 16, frameHeight: 16, spacing: 2});
    //this.load.spritesheet('tiles-16bit', 'assets/tilemaps/tiles/super-mario-16bit.png', {frameWidth: 16, frameHeight: 16, spacing: 2});
    //this.load.spritesheet('mario', 'assets/sprites/mario-sprites.png', {frameWidth: 16,frameHeight: 32});
    // Beginning of an atlas to replace the spritesheets above. Always use spriteatlases. I use TexturePacker to prepare them.
    // Check rawAssets folder for the TexturePacker project I use to prepare these files.
    this.load.atlas('mario-sprites', 'assets/sprites/mario-sprites-full.png', 'assets/sprites/mario-sprites-full.json');

  }

  create() {

    // Add the background as an tilesprite.
    this.cameras.main.setBackgroundColor('#6888ff');
    // marca as bordas desse mapa com 212 x 15 blocos de 16x16 pixels
    this.physics.world.setBounds(0,0,16 * 212, 16 * 15);
    this.cameras.main.setRoundPixels(true);

    // Add and play the music
    this.music = this.sound.add('overworld');

    /*
    this.music.play({
        loop: true
    });
    */
    const map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 });
    const tileset = map.addTilesetImage('SuperMarioBros-World1-1');
    this.world = map.createDynamicLayer('world', tileset);

    console.log(tileset.tileData);

    // marca a colisao com os blocos do mapa
    map.setCollision([14, 15, 16, 21, 22, 23, 24, 25, 27, 28, 40, 41]);

    this.questionBlocks = map.filterTiles(tile => {
      //filtra somente os blocos que interessam
      if (tile.index == 41) {
        /*
        tile.collisionCallback = (mario, bloco) => {
          if (mario.body.blocked.up) {
            console.log('blocked up');
          }
          //console.log('Colidiu com o bloco: ', mario);
        };
        */
        return true;
      }

    });

    this.questionBlocksDelta = 0;

    console.log(this.questionBlocks);


    this.add.tileSprite(0, 0, this.world.width, 500, 'clouds');

    // An emitter for bricks when blocks are destroyed.
    this.blockEmitterManager = this.add.particles('mario-sprites');

    this.blockEmitter = this.blockEmitterManager.createEmitter({
        frame: {
            frames: ['brick'],
            cycle: true
        },
        gravityY: 1000,
        lifespan: 1000,
        speed: 400,
        angle: {
            min: -115,
            max: -70
        },
        frequency: -1
    });

    // MARIO!!!
    this.mario = new Mario({
        scene: this,
        key: 'mario',
        x: 16 * 6,
        y: 16 * 9
    });

    // aqui informa as colisões do mario com o tilemap
    this.physics.add.collider(this.mario, this.world, (mario, tile) => {

      // aqui testa se a cabeca do mari obateu em alguma coisa
      if (mario.body.blocked.up) {
        //console.log('houve colisao da cabeca do mario');

        // se ele bateu numa questionMark então mostra a moeda
        if (tile.index == 41) {
          tile.index = 44;
          // liga um contador de tempo até 12
          this.setIntervalCount((count) => {
            console.log(count);
            if (count < 6) {
              tile.pixelY--;
            }
            else {
              tile.pixelY++;
            }

            //se estiver na metade da contagem, mostra a moeda e anima
            if (count == 6) {
              // Make a coin
              let coin = new Coin({
                  scene: this.mario.scene,
                  key: 'coin',
                  x: tile.x * 16 + 8,
                  y: tile.y * 16 - 8,
                  tilemap: this.world
              });
              // aqui é o movimento de subida da moeda
              this.add.tween({
                targets: [coin],
                y: (coin.y - 18),
                alpha: 1,
                duration: 300,
                ease: 'Quad.easeOut',
                onComplete: () => {coin.destroy()},
              });
            }
          }, 8, 12); // 8 milisegundos e 12 ciclos


        }

        //se ele bateu num bloco de tijolo, destrou ele ou desloca
        if (tile.index == 15) {
          this.world.tilemap.removeTileAt(tile.x, tile.y);
          //this.blockEmitter.emitParticle(6, tile.x * 16, tile.y * 16);
          this.blockEmitter.explode(6, tile.pixelX + 8, tile.pixelY);
        }

      }// end if cabecada mario

    });



    // define o input do teclado
    this.cursorKeys = this.input.keyboard.createCursorKeys();

  }

  update(time, delta) {

    if (this.mario.x >= 202 && this.mario.x <= 3192)
      this.cameras.main.centerOnX(this.mario.x);

    // Run the update method of Mario
    this.mario.update(this.cursorKeys, time, delta);

    this.questionBlocksDelta += 20;
    let frame = 0;
    if (this.questionBlocksDelta > 1100)
      frame = 4;
    else if (this.questionBlocksDelta > 900)
      frame = 3;
    else if (this.questionBlocksDelta > 700)
      frame = 2;
    else if (this.questionBlocksDelta > 500)
      frame = 1;

    for (let tile of this.questionBlocks) {

      if (tile.index != 44) {
        if (frame == 4) {
          tile.index = 41;
        }
        else if (frame == 3) {
          tile.index = 42;
        }
        else if (frame == 2) {
          tile.index = 43
        }
        else if (frame == 1) {
          tile.index = 42;
        }
      }

      //console.log(this.questionBlocksDelta);
    }

    if (this.questionBlocksDelta > 1100) {
      this.questionBlocksDelta = 0;
      frame = 0;
    }


    /*
    // essa aqui nao deu certo, ainda não sei porque
    this.physics.world.collide(this.mario, this.world, () => {
      console.log('outra forma de colisao');
    });
    */


  }

  // funcao para intervalo de tempo com contagem máxima
  setIntervalCount(callback, delay, repetitions) {
    var x = 0;
    callback(x);
    var intervalID = window.setInterval(function () {
      if (++x === repetitions-1) {
        window.clearInterval(intervalID);
      }
      callback(x);
    }, delay);
  }



}// end class

export default GameScene;
