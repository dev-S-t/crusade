const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 400;
let gameSpeed = 4;


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


window.addEventListener('load', function() {
    class Layer {
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

    const layer1 = new Layer(backgroundlayer1, 90, 0.1);
    const layer2 = new Layer(backgroundlayer2, 130, 0.2);
    const layer3 = new Layer(backgroundlayer3, 150, 0.3);
    const layer4 = new Layer(backgroundlayer4, 175, 0.5);
    const layer5 = new Layer(backgroundlayer5, 175, 0.6);
    const layer6 = new Layer(backgroundlayer6, 175, 1);

    const gameObjects = [layer1, layer2, layer3, layer4, layer5, layer6]


    function animate() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        gameObjects.forEach(Object => { //es6 arrow method to ommit function key_word
            Object.update();
            Object.draw();

        })

        requestAnimationFrame(animate);


    }
    animate();
});