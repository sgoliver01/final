    
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
        


////       Set up the box (bouncing around the screen)
//        this.box = new Box();
//        this.box.minX = 290
//        this.box.minY = 300
//        this.box.xVel = 3; // units: pixels per frame
//        this.box.yVel = 3;
//        this.box.width = 20;
//        this.box.height = 20;
//        
        
        
        this.ball = new Ball()
        

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
          //  console.log("BREAK")
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
       //     console.log(newBrick.color)
        }
    }
        
       
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
        this.eyeLeftInner.xVel = this.ball.xVel/16
        this.eyeLeftInner.yVel = this.ball.yVel/20

        
        
        this.eyeRight = new Circle();
        this.eyeRight.x = 315;
        this.eyeRight.y = 441;
        this.eyeRight.radius = 8;
        
        
        this.eyeRightInner = new Circle();
        this.eyeRightInner.x = 315;
        this.eyeRightInner.y = 441;
        this.eyeRightInner.radius = 4;
        this.eyeRightInner.xVel = this.ball.xVel/16
        this.eyeRightInner.yVel = this.ball.yVel/20
        
        
        this.Xs = []
        this.Ys = []
        
              
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
         
//        this.box.minX = 290
//        this.box.minY = 300
//        this.box.xVel = 3; // units: pixels per frame
//        this.box.yVel = 3;
//    
//        this.box.width = 20;
//        this.box.height = 20;
//         
         
         
        //reset Ball
        this.ball.x = 300;
        this.ball.y = 300;
        this.ball.xVel = 3;
        this.ball.yVel = 3;
         
        const boxHeight = Math.ceil(this.ball.radius * 2 / this.ball.numRows); //10
        for (let row = 0; row < this.ball.numRows; row++) {          
        const boxY = this.ball.y - this.ball.radius + ((row) * boxHeight+2);    
        const boxX = this.ball.x - this.ball.radius
        this.ball.bBoxes[row].minX = this.ball.x - (Math.sqrt(this.ball.radius**2 - ((boxY-this.ball.y)**2))) 
        this.ball.bBoxes[row].minY = boxY;
        this.ball.bBoxes[row].width = (Math.sqrt(this.ball.radius**2 - ((boxY-this.ball.y)**2)) * 2)
        this.ball.bBoxes[row].height = boxHeight
        
//        console.log(this.ball)
//        
         
        }
             
             
             
         
         //reset right eye
        this.eyeRightInner.x = 315;
        this.eyeRightInner.y = 441;
        this.eyeRightInner.radius = 4;
        this.eyeRightInner.xVel = this.ball.xVel/20
        this.eyeRightInner.yVel = this.ball.yVel/20
         
         
         //reset left eye
        this.eyeLeftInner.x = 290;
        this.eyeLeftInner.y = 441;
        this.eyeLeftInner.radius = 4;
        this.eyeLeftInner.xVel = this.ball.xVel/20
        this.eyeLeftInner.yVel = this.ball.yVel/20
         
         
         this.Xs = []
         this.Ys = []
    }
    
    update() {
        // Update the obstacle using keyboard info
        
  
        // Check for losing
        if (this.ball.y + this.ball.radius > this.canvas.height) {
            
           
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
    
//        this.box.update(obstacles, this.eyeLeft, this.eyeRight, this.eyeLeftInner, this.eyeRightInner, this.Xs, this.Ys); 
        this.ball.update(obstacles, this.eyeLeft, this.eyeRight, this.eyeLeftInner, this.eyeRightInner, this.Xs, this.Ys); 
        
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
        //loop through the xs and ys
        
        for (var i = 0; i < this.Xs.length; i ++) {
            this.trail = new Trail(this.Xs.slice(i)[0], this.Xs.slice(i+1)[0], this.Ys.slice(i)[0], this.Ys.slice(i+1)[0])
            
            this.trail.stroke = 'rgba(' + [255, 0, 0, i / 100] + ')';
        
            this.trail.draw(this.ctx)
            
        }
            
        
        if (this.gameStarted){
        this.ball.draw(this.ctx)
//        this.box.draw(this.ctx);
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

    update(obstacles, eyeLeft, eyeRight, eyeLeftInner, eyeRightInner, Xs, Ys) {
        //in all circumstances check if the inner eye is on the outside of the outter eye... if (eyeLeftInner.x < eyeLeft) ... undo last step
        
        // move x and y

        // move x
        this.minX += this.xVel;
        eyeLeftInner.x += eyeLeftInner.xVel;
        eyeRightInner.x += eyeRightInner.xVel;

        
        //bound eye on the left side
        
        if (eyeLeftInner.x < eyeLeft.x - 2) {
            eyeLeftInner.x = eyeLeft.x -2
        }
        
        if (eyeRightInner.x < eyeRight.x -2 ) {
            eyeRightInner.x = eyeRight.x -2
        }
        
        //bound eye on the right
        
         if (eyeLeftInner.x > eyeLeft.x + 2) {
            eyeLeftInner.x = eyeLeft.x + 2
        }
        
        if (eyeRightInner.x > eyeRight.x + 2) {
            eyeRightInner.x = eyeRight.x + 2
        }
        
        

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
                     
//                      let scaleFactor = (1+ (Math.abs((dist-(o.width/2)) / (o.width/2)) /50)) 
                          
                        let scaleFactor = 1 + (distance_from_center/50)                     
                        this.xVel = 5*distance_from_center
//                        eyeLeftInner.xVel = 5*distance_from_center/200
//                        eyeRightInner.xVel = 5*distance_from_center/200
//                     
                    }
                    
                    //ball hits left  
                    else {
                    
//                       let scaleFactor = (1+(Math.abs((dist-  (o.width/2) / (o.width/2)) /50)))
             
                        let scaleFactor = 1 + (distance_from_center/50)        
                        this.xVel = -5*distance_from_center 
//                        eyeLeftInner.xVel = -5*distance_from_center/200
//                        eyeRightInner.xVel = -5*distance_from_center/200
                  
                        
                    }            
                }

            }
        }

        }
            
        // move y
        this.minY += this.yVel;
        eyeLeftInner.y += eyeLeftInner.yVel;
        eyeRightInner.y += eyeRightInner.yVel;
        
        if (eyeLeftInner.y > eyeLeft.y) {
            eyeLeftInner.y = eyeLeft.y
        }
        
        if (eyeRightInner.y > eyeRight.y) {
            eyeRightInner.y = eyeRight.y
        }
        
        
                
        if (eyeLeftInner.y < eyeLeft.y - 2) {

            eyeLeftInner.y = eyeLeft.y - 2
        }
        
        if (eyeRightInner.y < eyeRight.y -2) {
            eyeRightInner.y = eyeRight.y - 2
        }
        

        for (const o of obstacles) {
             if (o.active){
            if (this.intersects(o)) {
                // undo the step that caused the collision
                this.minY -= this.yVel;
//                eyeLeftInner.y -= eyeLeftInner.yVel
//                eyeRightInner.y -= eyeRightInner.yVel
//                
                
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
       
                    //right 
                    if (ball_pos > paddle_mid){
                        
                        this.xVel = 5*distance_from_center 
                        eyeLeftInner.xVel = 5*distance_from_center/200
                        eyeRightInner.xVel = 5*distance_from_center/200
                    
                    }
                    
                    //left  
                    else {
 
                        this.xVel = -5*distance_from_center
                        eyeLeftInner.xVel = -5*distance_from_center/200
                        eyeRightInner.xVel = -5*distance_from_center/200
                      
                        
                    }            
                }  
            }   
          }
        }

        if (Xs.length < 50) {
            Xs.push(this.minX + this.width/2)
        }
        else {
            Xs.shift()
            Xs.push(this.minX + this.width/2)
        }
        
        if (Ys.length < 50) {
            Ys.push(this.minY + this.height/2)
        }
        else {
            Ys.shift()
            Ys.push(this.minY + this.height/2)
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
        ctx.strokeStyle = 1;
        ctx.lineWidth = 2;
        ctx.stroke();
            
    }
}




class Ball {
    
    constructor() {
        this.x = 300;
        this.y = 300;
        this.radius = 14;
        this.sAngle = 0;
        this.eAngle = 2* Math.PI;
        this.xVel = 3;
        this.yVel = 3;
        this.bBoxes = []
        this.numRows = 14
               
          
        const boxHeight = Math.ceil(this.radius * 2 / this.numRows) ; //10
//        console.log("box height:", boxHeight)

        for (let row = 0; row < this.numRows; row++) {
               
            const boxY = this.y - this.radius + ((row) * boxHeight+1); 
//            console.log("y:", boxY)     
            const boxX = this.x - this.radius

            const box = new Box()
            box.minX = this.x - (Math.sqrt(this.radius**2 - ((boxY-this.y)**2))) 
//            console.log("x:", box.minX)
            box.minY = boxY;
            box.width = (Math.sqrt(this.radius**2 - ((boxY-this.y)**2)) * 2)
            box.height = boxHeight
            box.xVel = 0
            box.yVel = 0
            box.randomizeColor()

            this.bBoxes.push(box);
      }

    }
    
    
 
    update(obstacles, eyeLeft, eyeRight, eyeLeftInner, eyeRightInner, Xs, Ys)  {
        //in all circumstances check if the inner eye is on the outside of the outter eye... if (eyeLeftInner.x < eyeLeft) ... undo last step
        
        // move x and y

        // move x
        this.x += this.xVel;
//        console.log(this)
        eyeLeftInner.x += eyeLeftInner.xVel;
        eyeRightInner.x += eyeRightInner.xVel;
            
        this.increaseX(this.xVel)

        
//        bound eye on the left side
        
        if (eyeLeftInner.x < eyeLeft.x - 2) {
            eyeLeftInner.x = eyeLeft.x -2
        }
        
        if (eyeRightInner.x < eyeRight.x -2 ) {
            eyeRightInner.x = eyeRight.x -2
        }
        
        //bound eye on the right
        
         if (eyeLeftInner.x > eyeLeft.x + 2) {
            eyeLeftInner.x = eyeLeft.x + 2
        }
        
        if (eyeRightInner.x > eyeRight.x + 2) {
            eyeRightInner.x = eyeRight.x + 2
        }
        
        

        for (const o of obstacles) {
            
            if (o.active){
                
            for (let i=0; i<this.bBoxes.length; i++){
            
            if (this.bBoxes[i].intersects(o)) {
                // undo the step that caused the collision
               this.increaseX(-this.xVel)
                this.x -= this.xVel
                eyeLeftInner.x -= eyeLeftInner.xVel;
                eyeRightInner.x -= eyeRightInner.xVel;
                
                // reverse xVel to bounce
                this.setXvelocity(-this.xVel)
                this.xVel *=-1
                eyeLeftInner.xVel *= -1;
                eyeRightInner.xVel *= -1;

                              
                 if (o.isBrick){
                    o.active = false
                    o.color = [0,0,0]
                    //o.draw(this.ctx)
                }
                
        
                if (o.isPaddle){
                       
                    const paddle_mid = o.minX +(o.width/2)
                    const ball_pos = this.x
                    const distance_from_center = Math.abs(paddle_mid - ball_pos)/20


                    //ball hits right 
                    if (ball_pos > paddle_mid){
                        
                        this.xVel = 5*distance_from_center
                        this.setXvelocity(5*distance_from_center)
                        eyeLeftInner.xVel = 5*distance_from_center/200
                        eyeRightInner.xVel = 5*distance_from_center/200
//                     
                    }
                    
                    //ball hits left  
                    else {       
                        this.xVel = -5*distance_from_center 
                        this.setXvelocity(-5*distance_from_center)
                        eyeLeftInner.xVel = -5*distance_from_center/200
                        eyeRightInner.xVel = -5*distance_from_center/200       
                    }            
                }
            }
            }
        }
        }
            
        // move y
        this.y += this.yVel;
        this.increaseY(this.yVel)
        
        eyeLeftInner.y += eyeLeftInner.yVel;
        eyeRightInner.y += eyeRightInner.yVel;
        
        if (eyeLeftInner.y > eyeLeft.y) {
            eyeLeftInner.y = eyeLeft.y
        }
        
        if (eyeRightInner.y > eyeRight.y) {
            eyeRightInner.y = eyeRight.y
        }
           
        if (eyeLeftInner.y < eyeLeft.y - 2) {

            eyeLeftInner.y = eyeLeft.y - 2
        }
        
        if (eyeRightInner.y < eyeRight.y -2) {
            eyeRightInner.y = eyeRight.y - 2
        }
        

        for (const o of obstacles) {
            
            
             if (o.active){
                 
                for (let i=0; i<this.bBoxes.length; i++){
                     
                     
            if (this.bBoxes[i].intersects(o)) {
                // undo the step that caused the collision
                
               this.increaseY(-this.yVel)
                this.y -= this.yVel
//                eyeLeftInner.y -= eyeLeftInner.yVel
//                eyeRightInner.y -= eyeRightInner.yVel
//                
                
                // reverse yVel to bounce
                this.yVel *= -1;
                this.setYvelocity(-this.yVel)              
                eyeLeftInner.yVel *= -1
                eyeRightInner.yVel *= -1;
                
                
                   if (o.isBrick){
                    o.active = false
                    o.color = [0,0,0]
                    //o.draw(this.ctx)
                }
                
          if (o.isPaddle) {
              
              const paddle_mid = o.minX +(o.width/2)
              const ball_pos = this.x
              const distance_from_center = Math.abs(paddle_mid - ball_pos)/20
           
                    //right 
                    if (ball_pos > paddle_mid){
           
                        this.xVel = 5*distance_from_center
                        this.setXvelocity(5*distance_from_center)
                        eyeLeftInner.xVel = 5*distance_from_center/200
                        eyeRightInner.xVel = 5*distance_from_center/200
                    
                    }
                    
                    //left 
                    else {
                        
                        this.xVel = -5*distance_from_center 
                        this.setXvelocity(-5*distance_from_center)
                        eyeLeftInner.xVel = -5*distance_from_center/200
                        eyeRightInner.xVel = -5*distance_from_center/200
                      
                        
                    }            
                }
  
            }   
          }
             }
        }
        

        if (Xs.length < 50) {
            Xs.push(this.bBoxes[4].minX + this.bBoxes[4].width/2)
        }
        else {
            Xs.shift()
            Xs.push(this.bBoxes[4].minX + this.bBoxes[4].width/2)
        }
        
        if (Ys.length < 50) {
            Ys.push(this.bBoxes[4].minY + this.bBoxes[4].height/2)
        }
        else {
            Ys.shift()
            Ys.push(this.bBoxes[4].minY + this.bBoxes[4].height/2)
        }
        
    }
    
    
    
    randomizeColor() {
        this.color[0] = Math.round(Math.random()*255);
        this.color[1] = Math.round(Math.random()*255);
        this.color[2] = Math.round(Math.random()*255);
    }
    
    
    increaseX(x){
          for (let i = 0; i < this.numRows; i++) {
              this.bBoxes[i].minX += x
          
        }
    }
        
    increaseY(y) {
          for (let i = 0; i < this.numRows; i++) {
              this.bBoxes[i].minY += y
          
          }
    }
    
    setXvelocity(x){
          for (let i = 0; i < this.numRows; i++) {
              this.bBoxes[i].xVel = x
          
        }
    }
    
    setYvelocity(y) {
          for (let i = 0; i < this.numRows; i++) {
              this.bBoxes[i].yVel = y
          
          }
    }
    
 
    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, this.sAngle, this.eAngle);
        ctx.fillStyle = "red"; // Set the fill color to blue
        ctx.fill();
        ctx.strokeStyle = "red";
        ctx.strokeStyle = 1;
        ctx.stroke();
        
//        for (let i = 0; i < this.numRows; i++) {
//        this.bBoxes[i].draw(ctx)
//        }          
    }

}


 class Trail {
     
     constructor(x1, x2, y1, y2) {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
        this.stroke = "red"
        this.opacity = .5
        this.width = 7
          
         
     }
     draw(ctx) {
         
         //clip if the abs value is bigger so that the line stays the same length 
//         if (abs(x1-x2)> 20) {
//             
//         }
        
          // start a new path
         ctx.beginPath()

        // place the cursor from the point the line should be started 
        ctx.moveTo(this.x2 , this.y2);


        // draw a line from current cursor position to the provided x,y coordinate
        ctx.lineTo(this.x1, this.y1);


        // set strokecolor
        ctx.strokeStyle = this.stroke;
         
        ctx.opacity = this.opacity; 

        // set lineWidht 
        ctx.lineWidth = this.width;
         

        // add stroke to the line 
        ctx.stroke();
      
        
    }

}