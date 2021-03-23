
const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    backgroundColor: '#9adaea',
    useTicker: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y : 300},
            debug: true
        },
        matter: {
            gravity: { y: 1 },
            enableSleep: false,
            debug: true
        }},
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};



var speed2;
var cody
var pipe
var over = false
const mapSize = 100
var stars
var score







let cursors
/**
 * 
 * @param {Phaser.Scene} scene 
 * @param {number} over 
 * @param {string} texture 
 * @param {number} scrollFactor
 */

const infiniteAdd = (scene, mapSize, texture, scrollFactor) =>{
    height = 600
    width= 800
    let x = 0
    for (let i = 0; i < mapSize; i++) {
        const m =   scene.add.image(x, height, texture)
        .setOrigin(0,1)
        .setScrollFactor(scrollFactor)
        x += m.width - 5
          
    }
   
   
    
    

}

var game =  new Phaser.Game(config)

function preload ()
{
    this.load.image('plateau', 'assets/plateau.png');
    this.load.image('pipe', 'assets/romanColumn.png')
    this.load.image('sky', 'assets/sky.png')
    this.load.image('montagne1', 'assets/mountains1.png')
    this.load.image('montagne2', 'assets/mountains2.png')
    this.load.image('montagne3', 'assets/mountains3.png')
    this.load.image('ground', 'assets/hills.png')
    this.load.image('clouds', 'assets/clouds.png')
    this.load.image('bird', 'assets/bird.png')
    this.load.image('star', 'assets/star.png')

    

}
var ground

function create ()
{
   

    const width = 800
    const height = 600
    this.add.image(width*0.5 , height*0.5 , 'sky').setScrollFactor(0)


    infiniteAdd(this, mapSize, 'montagne3', 0.05)

    infiniteAdd(this, mapSize, 'montagne2', 0.1 )

    infiniteAdd(this, mapSize, 'montagne1', 0.15)

    infiniteAdd(this, mapSize, 'clouds', 0.2)

    infiniteAdd(this, mapSize, 'plateau', 0.45)

    infiniteAdd(this, mapSize, 'ground', 0.55)

    





// Création des colonnes qui arrivent par le haut
   pipe = this.physics.add.image(1400 ,0, 'pipe').setScale(0.5)
   pipe.rotation = 3.12
   pipe.body.allowGravity = false
   pipe.setImmovable(true)
   .setScrollFactor(0)
   .setSize(175, 500, true)
   .setVelocity(-300, 0)    
   .setOffset(95,200)

// Création des colonnes qui arrivent par le bas
   pipe2 = this.physics.add.image(1500,600, 'pipe').setScale(0.5)
   pipe2.setScrollFactor(0)
   pipe2.body.allowGravity = false
   pipe2.setImmovable(true)
   .setSize(175, 500, true)
   .setVelocity(-300, 0)
   .setOffset(95,0)
   

// Création du personnage à contrôler
    cody = this.physics.add.image(300, 375, 'bird')
    .setScale(0.03)
    .setBounce(0.2)
    .setCollideWorldBounds(true)
    .setGravityY(50)
    .setScrollFactor(0)


   stars = this.physics.add.group()
   star = stars.create(600, 300, 'star')
   .setScale(0.02)
   .setImmovable(true)
   .setScrollFactor(false)
   .setBounce(1,1)
   
  star.body.allowGravity= false
    

    speed2 = Phaser.Math.GetSpeed(600, 3);
    
    this.cameras.main.setBounds(0, 0, width*mapSize, height)

    
    
    cursors = this.input.keyboard.createCursorKeys()


}



function update (time, delta)
   
     
{

    const cam = this.cameras.main
    const speed = 3
    cam.scrollX += speed
    this.physics.collide(cody,[pipe, pipe2]) 
    this.physics.add.overlap(cody, star, collectStar, null, this)


    
    if(pipe.x < -30){
        pipe.x = Math.random()*(900 - 1200) + 1200
        pipe.y = Math.random()*(-50 - 50) + 50

    }

   // pipe2.x -= 3
    if(pipe2.x < -30){
        pipe2.x = Math.random()*(900 - 1200) + 1200
        pipe2.y = Math.random()*(650 - 550 ) + 550

    }

    if(star.x <-50){
        star.x = Math.random()*(1100-3000)+3000
        star.y = Math.random()*(500-100)+100
    }

    if (cody.body.velocity.y >0) {
        cody.rotation = 0.5
    }

  

    if (cursors.left.isDown){
        cody.x -= 4; 
    }
    if (cursors.right.isDown){
        cody.x += 4

    }
    if (cursors.space.isDown){
        cody.setVelocityY(-200)
        for (let i = 0; i <= 0.5; i += 0.001) {
            cody.rotation = -i
            
        }

    if (cody.body.velocityY >= 0) {
        for (let i = 0; i <= 0.5; i += 0.001) {
            cody.rotation = i
            
        }
        
    }

    

    }

    

   
}

function collectStar(cody, star, score){
    star.disableBody(true, true)
    score += 12
    createStar(star)

}

function createStar(star){
    x = Math.random()*(1100-3000)+3000
    y = Math.random()*(500-100)+100
    star.enableBody(true, x, y, true, true).setVelocity(-300, 0)
}

function gameOver(){

}



