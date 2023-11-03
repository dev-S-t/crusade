window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = 800;
    const CANVAS_HEIGHT = canvas.height = 400;
    let enemies = [];
    let gameOver = false;
    let time = 0.005; //how much for time
    let score = 0;
    let kill = 50;


    let gameSpeed = 4;
    class InputHandler {
        constructor() {
            this.keys = [];
            //lexical scoping
            window.addEventListener('keydown', e => {
                if (this.keys.indexOf(e.key) === -1) {
                    if (e.key == 'ArrowDown' ||
                        e.key == 'ArrowUp' ||
                        e.key == 'ArrowRight' ||
                        e.key == 'ArrowLeft' &&
                        this.keys.indexOf(e.key) === -1) {
                        this.keys.push(e.key);
                    }
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
            document.addEventListener("keydown", function(event) {
                if (event.key == "Enter" && gameOver) {
                    location.reload();

                }
            });
        }

    }

    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameHeight = gameHeight - 20;
            this.gameWidth = gameWidth;
            this.width = 192;
            this.height = 192;
            this.x = 0;
            this.y = this.gameHeight - this.height;
            this.image = document.getElementById('playerImage');
            this.frameX = 0;
            this.frameY = 1;
            this.maxFrame = 5;
            this.fps = 12;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.speed = 0;
            this.vy = 0;
            this.weight = 1;
            this.attack = 0;
        }
        draw(context) {
            // context.strokeStyle = 'white';
            // context.strokeRect(this.x, this.y, this.width, this.height);
            // context.beginPath();
            // context.arc(this.x + this.width / 2, this.y + this.height / 2 + 30, this.width / 3, 0, Math.PI * 2);
            // context.stroke();
            // context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y + 50, this.width, this.height);
        }
        update(input, deltaTime, enemies) {
            // collision detection
            enemies.forEach(enemy => {
                const dx = enemy.x - this.x;
                const dy = enemy.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < enemy.width / 3.8 + this.width / 3.8) {
                    console.log('Hit');
                    if (this.onAttack()) {
                        //mark the enemy for deletion
                        enemy.markedForDeletion = true;
                        score += kill;
                    } else {
                        //end the game
                        gameOver = true;
                    }
                }
                if (distance < enemy.width / 1.5 + this.width / 2) {
                    enemy.attack = 6;
                    console.log('in_range');
                }
            });
            // sprite animation

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
            //attack
            if (input.keys.indexOf('ArrowDown') > -1) {
                this.attack = 6;
            }

            //horizontal movement
            this.x += this.speed;
            if (this.x < 0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;



            //vertical movement
            this.y += this.vy;
            if (!this.onGround()) {
                this.vy += this.weight;
                this.frameY = 3;
                this.maxFrame = 2;
                // } else if (this.atRest()) {
                //     this.frameY = 0;
                //     gameSpeed = 0;
            } else if (this.onAttack()) {
                this.frameY = 2;
                this.attack -= 1;
            } else {
                this.vy = 0;
                this.frameY = 1;
                this.maxFrame = 5;
                // gameSpeed = this.speed
            }




            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height

        }
        onGround() {
            return this.y >= this.gameHeight - this.height;
        }
        atRest() {
            return this.x == 0;
        }
        onAttack() {
            return this.attack >= 0;
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
        constructor(gameWidth, gameHeight) {
            this.gameHeight = gameHeight + 30;
            this.gameWidth = gameWidth;
            this.width = 192;
            this.height = 192;
            this.image = document.getElementById('enemyImage');
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.frameX = 1;
            this.frameY = 1;
            this.maxFrame = 6;
            this.fps = 12;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.speed = 6;
            this.markedForDeletion = false;
            this.attack = 0;

        }
        draw(context) {
            // context.strokeStyle = 'white';
            // context.beginPath();
            // context.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 3, 0, Math.PI * 2);
            // context.stroke();
            context.drawImage(this.image, 1344 - (this.width * this.frameX), this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }
        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) {
                    this.frameX = 1;
                } else {
                    this.frameX++;
                }
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            this.x -= this.speed;
            if (this.x < 0 - this.width) this.markedForDeletion = true;

            //attack
            if (this.attack > 0) {
                this.frameY = 2;
                console.log('enemyFire', this.attack);
                this.attack -= 1;
            } else {
                this.frameY = 1;
            }
        }
    }

    // 

    function handleEnemies(deltaTime) {
        if (enemyTimer > enemyInterval + randomEnemyInterval) {
            enemies.push(new Enemy(canvas.width, canvas.height));
            randomEnemyInterval = Math.random() * 1000 + 500;
            enemyTimer = 0;
        } else {
            enemyTimer += deltaTime;
        }
        enemies.forEach((enemy, index) => {
            enemy.draw(ctx);
            enemy.update(deltaTime);

            //check if the enemy is marked for deletion or not
            if (enemy.markedForDeletion) {
                //remove the enemy from the array
                enemies.splice(index, 1);
            } else {
                //check if the game is over or not
                if (gameOver) {
                    //stop the animation loop
                    cancelAnimationFrame(animate);
                }
            }




        });
        enemies = enemies.filter(enemy => !enemy.markedForDeletion);
    }

    function updateTime() {
        //use setInterval to call this function every 1000 milliseconds (1 second)
        setInterval(function() {
            //if the game is not over, increase the time by one
            if (!gameOver) {
                score += time;
            }
        }, 1000);
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
    let enemyTimer = 0;
    let enemyInterval = 1000;
    let randomEnemyInterval = Math.random() * 1000 + 500;

    function drawScore(ctx, score) {
        //set the font, color, and alignment of the text
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        //draw the text at the top left corner of the canvas
        s = parseInt(score);
        ctx.fillText("Score: " + s, 20, 40);
    }

    class GameOverText {
        constructor(ctx, canvas) {
            //set the context and canvas properties
            this.ctx = ctx;
            this.canvas = canvas;
            //set the font, color, and alignment of the text
            this.font = "50px Arial";
            this.fillStyle = "whitr";
            this.textAlign = "center";
            //set the text string and position
            this.text = "Game Over";
            this.x = canvas.width / 2;
            this.y = canvas.height / 2;
        }

        //create a method to draw the text on the canvas
        draw() {
            //set the font, color, and alignment of the text
            this.ctx.font = this.font;
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.textAlign = this.textAlign;
            //draw the text on the canvas
            this.ctx.fillText(this.text, this.x, this.y);
        }
    }

    const gameOverText = new GameOverText(ctx, canvas);

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        gameObjects.forEach(Object => { //es6 arrow method to ommit function key_word
            Object.update();
            Object.draw();
        })

        player.draw(ctx);
        player.update(input, deltaTime, enemies);
        handleEnemies(deltaTime);
        updateTime();
        drawScore(ctx, score);
        console.log(score);
        if (!gameOver) { requestAnimationFrame(animate); } else { gameOverText.draw(); }
    }
    animate(0);


});