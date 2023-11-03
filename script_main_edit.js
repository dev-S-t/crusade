window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = 800;
    const CANVAS_HEIGHT = canvas.height = 400;
    let gameSpeed = 4;
    class InputHandler {
        constructor() {
            this.keys = [];
            //lexical scoping
            window.addEventListener('keydown', e => {
                if (e.key == 'ArrowDown' ||
                    e.key == 'ArrowUp' ||
                    e.key == 'ArrowRight' ||
                    e.key == 'ArrowLeft' &&
                    this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                }
                console.log(e.key, this.keys);
            });
            window.addEventListener('keyup', e => {
                if (e.key == 'ArrowDown' ||
                    e.key == 'ArrowUp' ||
                    e.key == 'ArrowRight' ||
                    e.key == 'ArrowLeft') {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
                console.log(e.key, this.keys);
            });
        }

    }

    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameHeight = gameHeight;
            this.gameWidth = gameWidth;
            this.width = 192;
            this.height = 200;
            this.x = 0;
            this.y = this.gameHeight - this.height;
            this.image = document.getElementById('playerImage');
            this.frameX = 0;
            this.frameY = 1;
            this.maxFrame = 6;
            this.fps = 1;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.speed = 0;
            this.vy = 0;
            this.weight = 1;
        }
        draw(context) {
            context.fillStyle = 'white';
            // context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y + 50, this.width, this.height);
        }
        update(input, deltaTime) {
            // this.x++;

            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }


            //controls
            if (input.keys.indexOf('ArrowRight') > -1) {
                this.speed = 5;

            } else if (input.keys.indexOf('ArrowLeft') > -1) {
                this.speed = -5;

            } else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()) {
                this.vy -= 18;

            } else {
                this.speed = 0;
            }

            //horizontal movement
            this.x += this.speed;
            if (this.x < 0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
            //vertical movement
            this.y += this.vy;
            if (!this.onGround()) {
                this.vy += this.weight;
            } else {
                this.vy = 0;
            }

            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height

        }
        onGround() {
            return this.y >= this.gameHeight - this.height;
        }

    }

    class Background {
        constructor(image, y, speedModifier) {
            this.x = 0;
            this.y = y;
            this.height = 224;
            this.width = 1323;
            this.image = image;
            this.speedModifier = speedModifier;
            this.speed = gameSpeed * this.speedModifier;
        }
        update() {
            this.speed = gameSpeed * this.speedModifier
            if (this.x <= -this.width) {
                this.x = 0;
            }
            this.x = Math.floor(this.x - this.speed);
        }
        draw() {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + this.width - 1, this.y, this.width, this.height);
        }

    }

    class Enemy {

    }

    function handleEnemies() {

    }

    function displayStatusText() {

    }

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);


    const backgroundlayer1 = new Image();
    backgroundlayer1.src = "web/web_hill1.png";
    const backgroundlayer2 = new Image();
    backgroundlayer2.src = "web/web_hill2.png";
    const backgroundlayer3 = new Image();
    backgroundlayer3.src = "web/web_hill3.png";
    const backgroundlayer4 = new Image();
    backgroundlayer4.src = "web/web_hill4.png";
    const backgroundlayer5 = new Image();
    backgroundlayer5.src = "web/web_hill5.png";
    const backgroundlayer6 = new Image();
    backgroundlayer6.src = "web/platform_main.png";


    const layer1 = new Background(backgroundlayer1, 90, 0.1);
    const layer2 = new Background(backgroundlayer2, 130, 0.2);
    const layer3 = new Background(backgroundlayer3, 150, 0.3);
    const layer4 = new Background(backgroundlayer4, 175, 0.5);
    const layer5 = new Background(backgroundlayer5, 175, 0.6);
    const layer6 = new Background(backgroundlayer6, 175, 1);

    const gameObjects = [layer1, layer2, layer3, layer4, layer5, layer6]

    let lastTime = 0;



    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        gameObjects.forEach(Object => { //es6 arrow method to ommit function key_word
            Object.update();
            Object.draw();
        })
        player.draw(ctx);
        player.update(input, deltaTime);

        requestAnimationFrame(animate);
    }
    animate(0);


});