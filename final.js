export class final {
    constructor(canvas, keyMap) {
        
   
        this.canvas = canvas;
        this.keyMap = keyMap;
       
        // set size of canvas
        canvas.width = 640;
        canvas.height = 480;
        
        // save canvas context as member
        this.ctx = canvas.getContext('2d'); 
        
        //game ball
        this.box = new Box(); 
        this.box.xVel = 2; // units: pixels per frame
        this.box.yVel = 2;
        this.box.minX = 150;
        this.box.width = 20;
        this.box.height = 20;
        this.box.minY = 300;
        
        //left wall
        this.left_wall = new Box();
        this.left_wall.minX = 0;
        this.left_wall.minY = 0;
        this.left_wall.width = 10;
        this.left_wall.height = canvas.height;
        this.left_wall.color = [255, 0, 0];   
        
        //right wall
        this.right_wall = new Box();
        this.right_wall.minX = canvas.width;
        this.right_wall.minY = 0;
        this.right_wall.width = 10;
        this.right_wall.height = canvas.height;
        this.right_wall.color = [255, 0, 0];   
        
        
         //bottom wall
//        this.bottom_wall = new Box();
//        this.bottom_wall.minX = 0;
//        this.bottom_wall.minY = this.canvas.height;
//        this.bottom_wall.width = this.canvas.width;
//        this.bottom_wall.height = 10;
//        this.bottom_wall.color = [255, 0, 0];  
        
        //top wall
        this.top_wall = new Box();
        this.top_wall.minX = 0;
        this.top_wall.minY = 0;
        this.top_wall.width = this.canvas.width;
        this.top_wall.height = 10;
        this.top_wall.color = [255, 0, 0];  
        
        // Set up the obstacle (paddle on the left side)
       // this.paddle = new Box();
        this.paddle = new Box();
        this.paddle.minX = 200;
        this.paddle.minY = canvas.height -40;;
        this.paddle.width = 200;
        this.paddle.height = 10;
        this.paddle.color = [0, 255, 255];     
        this.paddle.breakable = false;
        this.paddle.active = true;
        this.paddle.isPaddle = true;
        
        this.obstacles = [this.left_wall, this.right_wall, this.paddle, this.top_wall]
        
         //bricks
        for (var row = 0; row < 4; row++) {
            for (var block = 0; block < 10; block++ ) {
                this.brick = new Box();
                this.brick.minX = 19+(62*block)
                this.brick.minY = 10+(40*row) 
                this.brick.width = (this.canvas.width-60)/12;
                this.brick.height = 30;          //4 rows
                this.brick.color = [30*block, 30*row, 20*block];  
                this.brick.breakable = true;
                this.brick.active = true;
                this.obstacles.push(this.brick)
            }
        }
        
        // state variables
        this.gameOver = false;
        this.paused = false;
        this.gameStarted = false;
    
    }
    mainLoop() {
        // Compute the FPS
        // First get #milliseconds since previous draw
        const elapsed = performance.now() - this.prevDraw;

        if (elapsed < 1000/60) {
            return;
        }
        // 1000 seconds = elapsed * fps. So fps = 1000/elapsed
        const fps = 1000 / elapsed;
        // Write the FPS in a <p> element.
        document.getElementById('fps').innerHTML = fps;

        
        this.update();
        this.draw();
 
        // Save the value of performance.now() for FPS calculation
        this.prevDraw = performance.now();
    }
    
    update() {
        // Update the obstacle using keyboard info
        if (this.keyMap['s']) {
            this.gameStarted = !this.gameStarted;
        }
        if (!this.gameStarted) {
            return;
        }
        
        if (this.keyMap['ArrowLeft']) {
            this.paddle.minX -= 3;
            if (this.paddle.minX < 0) {
                this.paddle.minX = 0;
            }
        }
        if (this.keyMap['ArrowRight']) {
            this.paddle.minX += 3;
            if (this.paddle.minX + this.paddle.width > this.canvas.width) {
                this.paddle.minX = this.canvas.width - this.paddle.width;
            }
        }
        
        if (this.keyMap['p'] && !this.gameOver) {
            this.paused = !this.paused;
        }
        
        if (this.paused) {
            return;
        }
        
        
        this.box.update(this.obstacles);  
        
        //check if ball goes off bottom of screen, if so, go to initialize ball
        if (this.box.minY > this.canvas.height) {
            this.initializeBall()

        }
        
        //check for bricks all being broken
        if (this.obstacles.length <= 4) {
            this.gameOver = true;
            this.winner = 1;
        }
       
        // Check for winning
        if (this.box.failed == 3) {
            this.gameOver = true     
            this.winner = 2

        }
       
    }
    

    initializeBall() {
        this.box.minX = 100;
        this.box.minY = 170;
        this.box.width = 20;
        this.box.height = 20;
        this.box.xVel = 1;
        this.box.yVel = 1;  
        this.box.color = [255, 255, 0];
        this.box.breakable = false;
        this.box.active = true;
        this.box.failed+=1;
        
            
        this.draw()
        
    }
    
    initializeBricks() {
        for (var row = 0; row < 4; row++) {
            for (var block = 0; block < 10; block++ ) {
                this.brick = new Box();
                this.brick.minX = 19+(62*block)
                this.brick.minY = 10+(40*row) 
                this.brick.width = (this.canvas.width-60)/12;
                this.brick.height = 30;          //4 rows
                this.brick.color = [25*block, 20*row, 100];  
                this.brick.breakable = true;
                this.brick.active = true;
                this.obstacles.push(this.brick)
            }
        }
        this.draw()
    }
    
    draw() {
         // clear background
        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);     
        
        if (this.paused) {
            this.ctx.font = "50px serif";
            this.ctx.textAlign = "center";            
            this.ctx.fillStyle = "rgb(255,0,0)";
            this.ctx.fillText("PAUSED", this.canvas.width/2, this.canvas.height/2);
        }
       
        //draw ball
        this.box.draw(this.ctx)
        this.paddle.draw(this.ctx)
        
        //draw bricks
        for (var i = 0; i < this.obstacles.length; i++) {
            if (this.obstacles[i].active && this.obstacles[i].breakable) {
                this.obstacles[i].draw(this.ctx);
            }
        }
         if (this.gameOver) {
            let x = "You lose";
            if (this.winner == 1) {
                x = "You win";
            }
            this.ctx.font = "50px serif";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = 'rgb(12,12,12)';
            this.ctx.fillText(x, this.canvas.width/2, this.canvas.height/2)       
        }
        
        if (!this.gameStarted) {
            let x = "Welcome! Try to destroy all the bricks"
            let y = "by bouncing the ball off the paddle and into the bricks."
            let z = "If you destroy all the bricks without the ball falling off the"
            let b = "screen, you win! You have 3 chances. Good luck!"
            let a = "Press S to start."
            
            this.ctx.font = "25px serif";
            this.ctx.wordWrap = "normal";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = 'rgb(12,12,12)';
            this.ctx.fillText(x, this.canvas.width/2, this.canvas.height/2)   
            this.ctx.fillText(y, this.canvas.width/2, this.canvas.height/2 +30)   
            this.ctx.fillText(z, this.canvas.width/2, this.canvas.height/2 +60)   
            this.ctx.fillText(b, this.canvas.width/2, this.canvas.height/2 +90)  
            this.ctx.fillText(a, this.canvas.width/2, this.canvas.height/2 +120)  
        }
    }
}


class Box {
    constructor() {
        this.minX = 100;
        this.minY = 170;
        this.width = 20;
        this.height = 20;
        this.xVel = 1;
        this.yVel = 1;  
        this.color = [255, 255, 0];
        this.breakable = false;
        this.active = true;
        this.failed = 0;
        this.isPaddle = false;
        
    }
    
    randomizeColor() {
        this.color[0] = Math.round(Math.random()*255);
        this.color[1] = Math.round(Math.random()*255);
        this.color[2] = Math.round(Math.random()*255);
    }
    
    intersects(box2) {
        // the x-intervals
        const xi1 = [this.minX, this.minX + this.width];
        const xi2 = [box2.minX, box2.minX + box2.width];
        
        if (!intervalsOverlap(xi1, xi2)) {
            return false;
        }
        
        const yi1 = [this.minY, this.minY + this.height];
        const yi2 = [box2.minY, box2.minY + box2.height];
        
        return intervalsOverlap(yi1, yi2);
    }
    
    bounceNoise() {
        var context = new AudioContext()
        var o = context.createOscillator()
        var  g = context.createGain()
        o.connect(g)
        g.connect(context.destination)
        var frequency = 440.0
        o.frequency.value = frequency
        o.start(0)
        
        g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1)

        
    }


    
     update(obstacles) {
        // move x and y
        // move x
        this.minX += this.xVel;
         
         //check if ball hits the walls in x direction
         for (var o = 0; o < obstacles.length; o++) {
            if (this.intersects(obstacles[o])) {
                this.bounceNoise()
                //check if it is a brick or a wall
                if (obstacles[o].breakable == true) {
                // undo the step that caused the collision
                this.minX -= this.xVel;
                
                // reverse xVel to bounce
                this.xVel *= -1;
                
                this.randomizeColor();
                    
                obstacles[o].active = false;
                obstacles.splice(o,1)

                }
                else if (obstacles[o].isPaddle == true) {
                    const ball_pos = this.minX
                    const paddle_left = obstacles[o].minX
                   
                    
                    const paddle_mid = paddle_left + obstacles[o].width/2
                    const distance_from_center = Math.abs(paddle_mid - ball_pos)
                    let scaled_distance = 0;
                    if (distance_from_center > 50) {
                        scaled_distance = (distance_from_center/45)**2
                    }
                    else {
                        scaled_distance = 1+ (distance_from_center/75)
                        }

                    this.minX -= scaled_distance*this.xVel;
                
                    // reverse xVel to bounce
                    this.xVel = -scaled_distance;
                }
                else {
                // undo the step that caused the collision
                this.minX -= this.xVel;
                
                // reverse xVel to bounce
                this.xVel *= -1;
                
                this.randomizeColor();
                }
            }
        }

        // move y
        this.minY += this.yVel;
         
        //check if box hits balls in y direction
         for (var o = 0; o < obstacles.length; o++) {
            if (this.intersects(obstacles[o])) {
                this.bounceNoise()
                if (obstacles[o].breakable) {
                // undo the step that caused the collision
                this.minY -= this.yVel;
                
                // reverse yVel to bounce
                this.yVel *= -1;
                
                this.randomizeColor();
                    
                obstacles[o].active = false;
                obstacles.splice(o,1)
                 
                }
                 else if (obstacles[o].isPaddle) {
                    const ball_pos = this.minX
                    const paddle_left = obstacles[o].minX
                    const paddle_mid = paddle_left + obstacles[o].width/2
                    const distance_from_center = Math.abs(paddle_mid - ball_pos)
                    let scaled_distance = 0;
                    if (distance_from_center > 45) {
                        scaled_distance = (distance_from_center/45)**3.5
                        //if to the left, set positive x bounce
                        if (ball_pos > paddle_mid) {

                            this.minY -= this.yVel;
                            this.yVel *= -1;

                            // reverse xVel to bounce
                            this.xVel = scaled_distance;
                        }
                        //if to right
                        else {

                            this.minY -= this.yVel;
                            this.yVel *= -1;

                            // reverse xVel to bounce
                            this.xVel = -scaled_distance;
                        }
                    }
                    else {
                        //hits in middle make ball that hit left go to right and ball that hit right go to help
                        //hits on left side bounce to right
                        scaled_distance = 1.50+ (distance_from_center/75)

                        if ((paddle_mid - ball_pos) >0) {
                        
                            this.minY -= this.yVel;
                            this.yVel *= -1;

                            // reverse xVel to bounce
                            this.xVel = scaled_distance;
                            
                        }
                        else {
                            this.minY -= this.yVel;
                            this.yVel *= -1;

                            // reverse xVel to bounce
                            this.xVel = -scaled_distance;
                        }
                    }
                 }
                else {
                // undo the step that caused the collision
                this.minY -= this.yVel;
                
                // reverse yVel to bounce
                this.yVel *= -1;
                
                this.randomizeColor();
                }
            }   
        }
     }
   

    draw(ctx) {
        const [r,g,b] = this.color;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(this.minX, this.minY, this.width, this.height);     
    }
}


function intervalsOverlap(int1, int2) {
    const [a,b] = int1;
    const [c,d] = int2;
    if (a > c) {
        return intervalsOverlap(int2, int1);
    }
    return (b > c);
}