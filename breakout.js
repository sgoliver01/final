export class Breakout {
    constructor(canvas, keyMap) {

        // save canvas and keyMap as members
        this.canvas = canvas;
        this.keyMap = keyMap;
        
        // set size of canvas
        canvas.width = 640;
        canvas.height = 480;
        
        // save canvas context as member
        this.ctx = canvas.getContext('2d'); 

        // Set up the box (bouncing around the screen)
        this.box = new Box();
        this.box.minX = 100
        this.box.minY = 300
        this.box.xVel = 3; // units: pixels per frame
        this.box.yVel = 3;
    
        this.box.width = 20;
        this.box.height = 20;
        

        // Set up the player paddle (paddle on the left side)
        this.paddle = new Box();
        this.paddle.minX = 250;
        this.paddle.minY = 432;
        this.paddle.width = 105;
        this.paddle.height = 20;
        this.paddle.color = [255, 255, 255]; 
        this.paddle.isPaddle = true;
        

        this.brickArray = []
        
        
        for (let r = 0; r<4; r++){
        for (let c = 0; c < 10; c++) {
            const newBrick = new Box()
            newBrick.minX = (c+1)*8 + (c*55)
            newBrick.minY = 30+ (40*r)
            newBrick.width = 55
            newBrick.height = 15
            newBrick.randomizeColor()
            newBrick.xVel= 0
            newBrick.yVel= 0
            newBrick.isBrick = true
            this.brickArray.push(newBrick)
        }
    }

//        this.obstacles= this.obstacles.concat(this.brickArray)
       
//        
     
        // prevDraw is a member variable used for throttling framerate
        this.prevDraw = 0;
        
        // state variables
        this.gameOver = false;
        this.paused = false;
        this.gameStarted = false;
        this.playerWin;
        this.lives = 3
        
        
        this.eyeLeft = new Circle();
        this.eyeLeft.x = 290;
        this.eyeLeft.y = 441;
        this.eyeLeft.radius = 8;
        
        this.eyeLeftInner = new Circle();
        this.eyeLeftInner.x = 290;
        this.eyeLeftInner.y = 441;
        this.eyeLeftInner.radius = 4;
        this.eyeLeftInner.xVel = .07
        this.eyeLeftInner.yVel = .07

        
        
        this.eyeRight = new Circle();
        this.eyeRight.x = 315;
        this.eyeRight.y = 441;
        this.eyeRight.radius = 8;
        
        
        this.eyeRightInner = new Circle();
        this.eyeRightInner.x = 315;
        this.eyeRightInner.y = 441;
        this.eyeRightInner.radius = 4;
        this.eyeRightInner.xVel = this.box.xVel/16
        this.eyeRightInner.yVel = this.box.yVel/16
        
     

       
                
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
        
    }
     resetBall(){ 
        this.box.minX = 100
        this.box.minY = 300
        this.box.xVel = 3; // units: pixels per frame
        this.box.yVel = 3;
    
        this.box.width = 20;
        this.box.height = 20;
         
    }
    
    update() {
        // Update the obstacle using keyboard info
        
           // Check for winning
        if (this.box.minY + this.box.height > this.canvas.height) {
            
           
            // Ball too low -> I lost
            this.lives -=1
        
            if (this.lives <1){
            this.gameOver = true;
            return
            } 
            this.resetBall()

        }
        
        
        
        if (this.keyMap['ArrowLeft']) {
            this.paddle.minX -= 6.5;
            this.eyeLeft.x -= 6.5;
            this.eyeRight.x -= 6.5;
            this.eyeLeftInner.x -= 6.5;
            this.eyeRightInner.x -= 6.5;
            if (this.paddle.minX < 0) {
                this.paddle.minX = 0;
                this.eyeLeft.x = 40;
                this.eyeLeftInner.x = 40;
                this.eyeRight.x = 65;
                this.eyeRightInner.x = 65;
            }
            
        }
        if (this.keyMap['ArrowRight']) {
            this.paddle.minX += 6.5;
            this.eyeLeft.x += 6.5;
            this.eyeRight.x += 6.5;
            this.eyeLeftInner.x += 6.5;
            this.eyeRightInner.x += 6.5;
            if (this.paddle.minX + this.paddle.width > this.canvas.width) {
                this.paddle.minX = this.canvas.width - this.paddle.width;
                this.eyeLeft.x = 576;
                this.eyeLeftInner.x = 576;
                this.eyeRight.x = 601;
                this.eyeRightInner.x = 601;
            }
        }
        
        if (this.keyMap['p'] && !this.gameOver) {
            this.paused = true
        }
        
        if (this.keyMap['u'] && !this.gameOver) {
            this.paused = false;
        }
        
        if (this.paused) {
            return;
        }
        
         if (this.keyMap['s'] && !this.gameOver) {
            this.gameStarted = true;
        }
        
        if (!this.gameStarted){
            return 
        }
        
        this.playerWin= true
        for (const brick of this.brickArray) {
                if (brick.active) {
                this.playerWin = false;
                break;
              }
        }
        if (this.playerWin){
            return
        }
        
        
    

        // Update the box (move, bounce, etc. according to box.xVel and box.yVel)
        const obstacles = [this.paddle].concat(this.brickArray);
      
        
        const topEdge = new Box();
        topEdge.minX = 0;
        topEdge.minY = -10;
        topEdge.width = this.canvas.width;
        topEdge.height = 10;
        obstacles.push(topEdge);
        

        
        // Create left edge
        const leftEdge = new Box();
        leftEdge.minX = -10;
        leftEdge.minY = 0;
        leftEdge.width = 10;
        leftEdge.height = this.canvas.height;
        obstacles.push(leftEdge);

        // Create right edge
        const rightEdge = new Box();
        rightEdge.minX = this.canvas.width;
        rightEdge.minY = 0;
        rightEdge.width = 10;
        rightEdge.height = this.canvas.height;
        obstacles.push(rightEdge);
        
        
        
        this.box.update(obstacles, this.eyeLeft, this.eyeRight, this.eyeLeftInner, this.eyeRightInner);
        
        
     
        
        
    }
    
    
   
    draw() {
        
        // clear background
        this.ctx.fillStyle = "rgb(10, 10, 10)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);  
        
        
         if (!this.gameStarted) {
            this.ctx.font = "15px serif";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "rgb(255,0,0)";
            const lines = ["Welcome to my breakout game.",
                   "Move the paddle with the left and right arrow keys.",
                    "You have 3 lives.",
                   "Press s to start.",
                   "Press p to pause and u to unpause."];
            const lineHeight = 20;
            const y = this.canvas.height/2 - (lines.length * lineHeight)/2;
            lines.forEach((line, i) => {
                this.ctx.fillText(line, this.canvas.width/2, y + i * lineHeight);
                
            } );
             
         }

        
        if (this.playerWin){
             
            this.ctx.font = "50px serif";
            this.ctx.textAlign = "center";            
            this.ctx.fillStyle = "rgb(0,255,0)";
            this.ctx.fillText("You Win!", this.canvas.width/2, this.canvas.height/2);
        }
        
        
        if (this.paused) {
            this.ctx.font = "50px serif";
            this.ctx.textAlign = "center";            
            this.ctx.fillStyle = "rgb(255,0,0)";
            this.ctx.fillText("PAUSED", this.canvas.width/2, this.canvas.height/2);
        }

        // potentially draw victory text
        if (this.gameOver) {
            
            this.ctx.font = "50px serif";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = 'rgb(255,255,255)';
            this.ctx.fillText("You Lose!", this.canvas.width/2, this.canvas.height/2)            
        }
        
        
        if (this.gameStarted){
        // Draw the box
        this.box.draw(this.ctx);
        this.paddle.draw(this.ctx);
        this.eyeRightInner.draw(this.ctx)
        this.eyeLeftInner.draw(this.ctx)
        this.eyeRight.draw(this.ctx)
        this.eyeLeft.draw(this.ctx)
       
        
        for (const brick of this.brickArray){
            brick.draw(this.ctx)
        }
        
        }

        // Save the value of performance.now() for FPS calculation
        this.prevDraw = performance.now();
    }
}



class Box {
    constructor() {
        this.minX = 10;
        this.minY = 30;
        this.width = 20;
        this.height = 20;
        this.xVel = 1;
        this.yVel = 1;  
        this.color = [255, 0, 0];
        this.active = true
        this.breakable = false
        this.isPaddle = false
        
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

    update(obstacles, eyeLeft, eyeRight, eyeLeftInner, eyeRightInner) {
        //in all circumstances check if the inner eye is on the outside of the outter eye... if (eyeLeftInner.x < eyeLeftInner) ... undo last step
        
        // move x and y

        // move x
        this.minX += this.xVel;
        eyeLeftInner.x += eyeLeftInner.xVel;
        eyeRightInner.x += eyeRightInner.xVel;

        console.log(eyeLeftInner)
        for (const o of obstacles) {
            
            if (o.active){
                
            if (this.intersects(o)) {
                // undo the step that caused the collision
                this.minX -= this.xVel;
                eyeLeftInner.x -= eyeLeftInner.xVel;
                eyeRightInner.x -= eyeRightInner.xVel;
                
                // reverse xVel to bounce
                this.xVel *= -1;
                eyeLeftInner.xVel *= -1;
                eyeRightInner.xVel *= -1;

                
                
                 if (o.isBrick){
                    o.active = false
                    o.color = [0,0,0]
                    //o.draw(this.ctx)
                }
                
        
                if (o.isPaddle){
                       
                    const paddle_mid = o.minX +(o.width/2)
                    const ball_pos = this.minX
                    const distance_from_center = Math.abs(paddle_mid - ball_pos)/20


                    //ball hits right 
                    if (ball_pos > paddle_mid){
                       
//                        let dist =  o.minX+o.width-this.minX
//                        
//                        let scaleFactor = (1+ (Math.abs((dist-(o.width/2)) / (o.width/2)) /50))
//                   
//                        this.XVel *= scaleFactor 
                          
                        let scaleFactor = 1 + (distance_from_center/50) 
                        
                        
                        this.xVel = 5*distance_from_center
                        eyeLeftInner.xVel = 5*distance_from_center/200
                        eyeRightInner.xVel = 5*distance_from_center/200
                     
                    }
                    
                    //ball hits left  
                    else {
                        
                       
//                        let dist = this.minX - o.minX
//                        let scaleFactor = (1+(Math.abs((dist-  (o.width/2) / (o.width/2)) /50)))
//                     
//                        this.XVel *= scaleFactor 
                        
                         let scaleFactor = 1 + (distance_from_center/50)
                        
                        this.xVel = -5*distance_from_center 
                        eyeLeftInner.xVel = -5*distance_from_center/200
                        eyeRightInner.xVel = -5*distance_from_center/200
                  
                        
                    }            
                }

            }
        }

        }
            
        // move y
        this.minY += this.yVel;
        eyeLeftInner.y += eyeLeftInner.yVel;
        eyeRightInner.y += eyeRightInner.yVel;
        

        for (const o of obstacles) {
             if (o.active){
            if (this.intersects(o)) {
                // undo the step that caused the collision
                this.minY -= this.yVel;
                eyeLeftInner.y -= eyeLeftInner.yVel
                eyeRightInner.y -= eyeRightInner.yVel
                
                
                // reverse yVel to bounce
                this.yVel *= -1;
                eyeLeftInner.yVel *= -1
                eyeRightInner.yVel *= -1;
                
                
                   if (o.isBrick){
                    o.active = false
                    o.color = [0,0,0]
                    //o.draw(this.ctx)
                }
                
          if (o.isPaddle) {
              
              const paddle_mid = o.minX +(o.width/2)
              const ball_pos = this.minX
              const distance_from_center = Math.abs(paddle_mid - ball_pos)/20
              console.log("DFC: ", distance_from_center)
              console.log ("xvel = : ", this.xVel)
              
                              
             
                    //right 
                    if (ball_pos > paddle_mid){
                       
                        
                        
//                        let scaleFactor = (1+(Math.abs((dist- (o.width/2)) / (o.width/2)) /50))
                       
                        
                       let scaleFactor = 1 + (distance_from_center/50)
                        
                        
                        this.xVel = 5*distance_from_center 
                        eyeLeftInner.xVel = 5*distance_from_center/200
                        eyeRightInner.xVel = 5*distance_from_center/200
                    
                    }
                    
                    else {
                        
                        //left    
//                        let dist = this.minX - o.minX
//                        let scaleFactor = (1+(Math.abs((dist- (o.width/2) / (o.width/2)) /50)))
                    
                        let scaleFactor = 1 + (distance_from_center/50)
                        
                        this.xVel = -5*distance_from_center
                        
                        eyeLeftInner.xVel = -5*distance_from_center/200
                        eyeRightInner.xVel = -5*distance_from_center/200
                      
                        
                    }            
                }
  
            }   
          }
        }
    }

    draw(ctx) {
        if (this.active){
        const [r,g,b] = this.color;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(this.minX, this.minY, this.width, this.height);                
        }
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


class Circle {
    constructor() {
        this.x = 100;
        this.y = 170;
        this.radius = 20;
        this.sAngle = 0;
        this.eAngle = 2* Math.PI;
        this.xVel = 0;
        this.yVel = 0;

    }
    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, this.sAngle, this.eAngle);
        ctx.strokeStyle = "blue";
        ctx.stroke();
            
    }
}

