var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
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

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('spark0', 'assets/yellowParticle.png');
}

function create ()
{
    var emitter0 = this.add.particles('spark0').createEmitter({
        x: 400,
        y: 300,
        speed: { min: -800, max: 800 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.5, end: 0 },
        blendMode: 'SCREEN',
        //active: false,
        lifespan: 600,
        gravityY: 800
    });

    

    this.input.on('pointerdown', function (pointer) {
        emitter0.setPosition(pointer.x, pointer.y);
        emitter0.explode();
    });

}

function update ()
{
}

