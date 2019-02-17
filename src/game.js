let BootScene = new Phaser.Class({
    
    Extends: Phaser.Scene,
 
    initialize:
 
    function BootScene (){
        Phaser.Scene.call(this, { key: 'BootScene' });
    },
 
    preload: function (){
        this.load.spritesheet('letters', 'assets/letters.png', { frameWidth: 50, frameHeight: 72 });
        this.load.spritesheet('eat', 'assets/eat_anim.png', { frameWidth: 1000, frameHeight: 1200 });
    },
    create: function(){
        this.scene.start('WorldScene');
    }
});

let WorldScene = new Phaser.Class({
    
    Extends: Phaser.Scene,
 
    initialize:
 
    function WorldScene (){
        Phaser.Scene.call(this, { key: 'WorldScene' });
    },
    create: function(){
        let self = this;
        this.backGround = this.cameras.main.setBackgroundColor('#d6e5fc');
        this.input.mouse.enable = true;
        this.scale = 0.1;
        this.happFace = this.physics.add.sprite(this.backGround.width/2, this.backGround.height/2, 'eat', 0).setScale(this.scale).setInteractive();
        /*this.happFace.on('pointerdown', changeFace);
        function changeFace(){
            self.happFace.visible = !self.happFace.visible;
        }*/
        this.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        this.letters = {
            number: [],
            pic: []
        };
        this.goal = {
            number: [],
            pic: [],
        };
        this.counter = 0;
        this.score = 0;
        this.p = 0;

        this.eating = this.anims.create({
            key: 'eat',
            frames: this.anims.generateFrameNumbers('eat', { frames: [0, 1, 2, 1, 0, 3, 0, 4, 0]}),
            frameRate: 36,
            repeat: 1
        });
        // letters
        for(let i = 0; i < 26; i++){
            this.letters.pic[i] = this.physics.add.sprite(i*(this.backGround.width/26) + this.backGround.width/52, this.backGround.height*1.1, 'letters', i).setScale(0.5);
            this.letters.number[i] = i;
        }
        this.wordLength = Phaser.Math.Between(3, 8);
        for(let i = 0; i < this.wordLength; i++){
            this.goal.number[i] = Phaser.Math.Between(0, 25);
            while(this.goal.number[i] === this.goal.number[i-1]){
                this.goal.number[i] = Phaser.Math.Between(0, 25);
            }
            this.goal.pic[i] = this.add.sprite(this.backGround.width*0.58 + i*50 + this.p*10, this.backGround.height*0.49, 'letters', this.goal.number[i]).setAlpha(0.2);
        }
        this.input.keyboard.on('keydown', function (event) {
            for(let i = 0; i < 26; i++){
                self.input.keyboard.on('keydown_' + self.alphabet[i], function (event) {
                    self.physics.moveTo(self.letters.pic[i], self.backGround.width/2, self.backGround.height/2, 1500, 300);
                    if(i === self.goal.number[0]){
                        self.goal.pic[0].setVisible(false);
                        self.goal.number.shift();
                        self.goal.pic.shift();
                        self.counter++;
                    }
                });
            }
        });
        // score
        this.scoreText = this.add.text(this.backGround.width*0.05, this.backGround.height*0.05, "Score: " + this.score, {
            font: "20px NovaMono",
            fill: "#000000",
            align: "left"
        }).setAlpha(0.3);
    },
    update: function(time, delta){
        let self = this;
        for(let i = 0; i < 26; i++){
            if(this.letters.pic[i].y < this.backGround.height/2){
                this.letters.pic[i].setVelocity(0);
                this.letters.pic[i].setPosition(i*(this.backGround.width/26) + this.backGround.width/52, this.backGround.height*1.1);
            }
        }
        // 2^30 > 1 000 000 000
        if(this.wordLength == this.counter){
            this.counter = 0;
            this.scoreText.setText("Score: " + ++this.score);
            this.happFace.anims.play('eat', true);
            if(this.score == Math.pow(2, this.p)){
                this.scale += 0.01;
                this.happFace.setScale(this.scale);
                this.p++;
            }
            this.wordLength = Phaser.Math.Between(3, 8);
            for(let i = 0; i < this.wordLength; i++){
                this.goal.number[i] = Phaser.Math.Between(0, 25);
                while(this.goal.number[i] === this.goal.number[i-1]){
                    this.goal.number[i] = Phaser.Math.Between(0, 25);
                }
                this.goal.pic[i] = this.add.sprite(this.backGround.width*0.58 + i*50 + this.p*10, this.backGround.height*0.49, 'letters', this.goal.number[i]).setAlpha(0.2);
            }
        }
        /*
        if(this.score == 1000000000){
            videogame coupon
        }
        */
    }
});



this.config = {
    type: Phaser.CANVAS,
    parent: 'content',
    width: window.innerWidth,
    height: window.innerHeight,
    zoom: 1,
    backgroundColor: '#ffffff',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        BootScene,
        WorldScene
    ]
};
let game = new Phaser.Game(this.config);