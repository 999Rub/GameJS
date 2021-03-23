// Config du monde
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
            debug: false
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

// Variable qui seront utilisées au cour du jeu
var cody
var pipe
var over = false
const mapSize = 100
var stars
var score = 0
var start = false
var scoreText
var overText

// Paramètres de la scène pour le scroll infini
let cursors
/**
 * 
 * @param {Phaser.Scene} scene 
 * @param {number} over 
 * @param {string} texture 
 * @param {number} scrollFactor
 */

// Ajout infini du décor
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
    // Chargement des ressources
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
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

    

}
var ground

function create ()
{
   
// Dimensions de la fenêtre de jeu
    const width = 800
    const height = 600
    this.add.image(width*0.5 , height*0.5 , 'sky').setScrollFactor(0)

// Ajout des différents éléments du décor
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
   .setOffset(95,200)

// Création des colonnes qui arrivent par le bas
   pipe2 = this.physics.add.image(1500,600, 'pipe').setScale(0.5)
   pipe2.setScrollFactor(0)
   pipe2.body.allowGravity = false
   pipe2.setImmovable(true)
   .setSize(175, 500, true)
   .setOffset(95,0)
   

// Création du personnage à contrôler
    cody = this.physics.add.image(300, 375, 'bird')
    .setScale(0.03)
    .setBounce(0.2)
    .setScrollFactor(0)
    cody.body.allowGravity = false
    cody.setDataEnabled()
    cody.data.set('score', 0)

// Création des étoiles à récolter
   stars = this.physics.add.group()
   star = stars.create(Math.random()*(1100-3000)+3000, Math.random()*(500-100)+100, 'star')
   .setScale(0.02)
   .setImmovable(true)
   .setScrollFactor(false)
   .setBounce(1,1)
  star.body.allowGravity= false
    
// Ajout des texts de départ
    var add = this.add
    this.cameras.main.setBounds(0, 0, width*mapSize, height)
    WebFont.load({
        google: {
            families: [ 'Freckle Face', 'Finger Paint', 'Nosifer' ]
        },
    active: function(){
        add.text(16, 0, 'Press \nspace \nto start', 
        { fontFamily: 'Finger Paint', fontSize: 80, color: '#ffffff' })
        .setShadow(2, 2, "#333333", 2, false, true)
        add.text(500, 290, 'Collect stars to get points', 
        { fontFamily: 'Finger Paint', fontSize: 20, color: '#ffffff' })
        .setShadow(2, 2, "#333333", 2, false, true)
    }})
      
    
// Récup des touches clavier
    cursors = this.input.keyboard.createCursorKeys()

// Ajout du text score + du text gameOver
    scoreText = this.add.text(375, 10,'', 
        { fontFamily: 'Finger Paint', fontSize: 50, color: '#ffffff' })
        .setShadow(2, 2, "#333333", 2, false, true).setScrollFactor(false)
    overText = this.add.text(150, 150,'', 
        { fontFamily: 'Freckle Face', fontSize: 50, color: '#ffffff' })
        .setShadow(2, 2, "#333333", 2, false, true).setScrollFactor(false)
    

}



function update ()
   
     
{

// Check si le jeu à commencé
    if (start == true) {
        scoreText.setText([
            cody.data.get('score')
        ]).setVisible(true)
        
// Initialisation de différents paramètres pour lancer le jeu
        pipe.setVelocity(-300, 0)
        pipe2.setVelocity(-300, 0)
        cody.body.allowGravity = true
        cody.setGravityY(50)
        star.setVelocity(-300,0)
        const cam = this.cameras.main
        const speed = 3
        cam.scrollX += speed
        this.physics.collide(cody,[pipe, pipe2]) 
        this.physics.add.overlap(cody, star, collectStar, null, this)
        this.physics.add.overlap(cody, [pipe,pipe2], gameOver, null, this)
        
        

    // Retour du pipe haut à droite
        if(pipe.x < -30){
            pipe.x = Math.random()*(900 - 1200) + 1200
            pipe.y = Math.random()*(-50 - 50) + 50

        }

    // Retour du pipe bas à droite
        if(pipe2.x < -30){
            pipe2.x = Math.random()*(900 - 1200) + 1200
            pipe2.y = Math.random()*(650 - 550 ) + 550

        }
    // Retour à droite de l'étoile si loupée
        if(star.x <-50){
            star.x = Math.random()*(1100-3000)+3000
            star.y = Math.random()*(500-100)+100
        }
    // Animation chute quand personnage tombe
        if (cody.body.velocity.y >0) {
            cody.rotation = 0.5
        }

        }
    // Saut avec la touche espace
        if (cursors.space.isDown){
            cody.setVelocityY(-200)
            for (let i = 0; i <= 0.5; i += 0.001) {
                cody.rotation = -i
            }
        }
    // Animation saut vers le haut
        if (cody.body.velocityY >= 0) {
            for (let i = 0; i <= 0.5; i += 0.001) {
                cody.rotation = i
            
            }
        
        }
    // Fin du game si on sort du cadre
        if (cody.y > 650 || cody.y < -50) {
            gameOver()
        }
       
        
    
    // Si gameOver on recharge le jeu
        if (cursors.space.isDown && over == false){
            start = true     
        }
    // Si game over on reload la page avec espace
    if (cursors.space.isDown && over == true) {
        over = false
        document.location.reload()
    }
    

}

// Récolte des étoiles
function collectStar(cody, star){
    cody.data.values.score += 1
    star.disableBody(true, true)
    createStar(star)

}

// Création random des étoiles
function createStar(star){
    x = Math.random()*(1100-3000)+3000
    y = Math.random()*(500-100)+100
    star.enableBody(true, x, y, true, true).setVelocity(-300, 0)
}

// Fonction de fin de jeu
function gameOver(){
    start = false
    overText.setText([
        'Game Over ! ',
        '\n    Stars collected : '+ cody.getData('score'),
        '\n Press space to restart'
    ])
    pipe.setVelocity(0,0)
    pipe2.setVelocity(0,0)
    star.setVelocity(0,0)
    cody.rotation = 0.5
    over = true
    scoreText.setVisible(false)
}



