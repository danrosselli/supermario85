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

    const map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 });
    const tileset = map.addTilesetImage('SuperMarioBros-World1-1');
    this.world = map.createDynamicLayer('world', tileset);

    // marca a colisao com os blocos do mapa
    map.setCollision([14, 15, 16, 21, 22, 23, 24, 25, 27, 28, 40, 41]);

    /*
    let questionBlock = map.filterTiles(tile => {
      //filtra somente os blocos que interessam
      if (tile.index == 41) {
        //console.log(tile);
        //tile.setSize(8,8);
        //tile.faceTop = false;
        tile.collisionCallback = (mario, bloco) => {
          if (mario.body.blocked.up) {
            console.log('blocked up');
          }
          //console.log('Colidiu com o bloco: ', mario);
          //bloco.setSize(8, 8);
        };
        return true;
      }

    });
    */

    this.add.tileSprite(0, 0, this.world.width, 500, 'clouds');

    // MARIO!!!
    this.mario = new Mario({
        scene: this,
        key: 'mario',
        x: 16 * 6,
        y: 16 * 9
    });

    // aqui informa as colisões dos sprites
    this.physics.add.collider(this.mario, this.world, (mario, tile) => {

      if (mario.body.blocked.up) {
        console.log('houve colisao da cabeca do mario');
        // se ele bateu numa questionMark então mostra a moeda
        if (tile.index == 41) {
          setTimeout(() => {tile.index = 42;}, 100);
          // Make a coin
          let coin = new Coin({
              scene: this.mario.scene,
              key: 'coin',
              x: tile.x * 16 + 8,
              y: tile.y * 16 - 8,
              tilemap: this.world
          });

        }
        else if(tile.index==42) {
          setTimeout(() => {tile.index = 43;}, 100);

        }
        else if(tile.index==43) {
          setTimeout(() => {tile.index = 44;}, 100);
        }

      }

    });



    // define o input do teclado
    this.cursorKeys = this.input.keyboard.createCursorKeys();

  }

  update(time, delta) {

    if (this.mario.x >= 202 && this.mario.x <= 3192)
      this.cameras.main.centerOnX(this.mario.x);

    // Run the update method of Mario
    this.mario.update(this.cursorKeys, time, delta);

    /*
    // essa aqui nao deu certo, ainda não sei porque
    this.physics.world.collide(this.mario, this.world, () => {
      console.log('outra forma de colisao');
    });
    */


  }

}

export default GameScene;
