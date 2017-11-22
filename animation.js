var forwardInSpriteSheet = true;
var groundY = 200;
var yoshiVelocity = 7;
var yoshiSpriteX = 200;
var yoshiSpriteY = groundY;

var jumpHeight = 50;
var jumpSpeed = 10;
var upperJumpBound = 50;
var goingUp = false;

(function() {

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

(function () {
			
	var yoshi,
		yoshiImage,
		canvas;					

	function gameLoop () {
	
	  window.requestAnimationFrame(gameLoop);

	  yoshi.update();
	  yoshi.render();
	}
	
	function sprite (options) {
	
		var that = {},
			frameIndex = 0,
			tickCount = 0,
			ticksPerFrame = options.ticksPerFrame || 0,
			numberOfFrames = options.numberOfFrames || 1;
		
		that.context = options.context;
		that.width = options.width;
		that.height = options.height;
		that.image = options.image;
		
		that.update = function () {

            tickCount += 1;

            if (tickCount > ticksPerFrame) {

				tickCount = 0;
				
                // If the current frame index is in range
                if (frameIndex < numberOfFrames - 1 && forwardInSpriteSheet) {	
                    // Go to the next frame
                    frameIndex += 1;
                } else if (!(frameIndex < numberOfFrames - 1) && forwardInSpriteSheet)
                { 
                    forwardInSpriteSheet = false;
                    frameIndex -= 1;
                }
                else if (frameIndex > 0 && !forwardInSpriteSheet)
               	{
               		frameIndex -= 1;
               	}
               	else
               	{
               		forwardInSpriteSheet = true;
               		frameIndex += 1;
               	}
/*
               	if(yoshiSpriteX+that.width > 500 || yoshiSpriteX < 0)
               		yoshiVelocity *= -1;
                
                yoshiSpriteX += yoshiVelocity;
*/
                if(!goingUp && yoshiSpriteY < groundY)
                	yoshiSpriteY += jumpSpeed;
            }
        };
		
		that.render = function () {
		
		  // Clear the canvas
		  that.context.clearRect(0, 0, canvas.width, canvas.height);
		  
		  // Draw the animation
		  that.context.drawImage(
		    that.image,
		    frameIndex * that.width / numberOfFrames,
		    0,
		    that.width / numberOfFrames,
		    that.height,
		    yoshiSpriteX,
		    yoshiSpriteY,
		    that.width / numberOfFrames,
		    that.height);
		};
		
		return that;
	}
	
	// Get canvas
	canvas = document.getElementById("yoshiAnimation");
	canvas.width = 500;
	canvas.height = 380;
	
	// Create sprite sheet
	yoshiImage = new Image();	
	
	// Create sprite
	yoshi = sprite({
		context: canvas.getContext("2d"),
		width: 136,
		height: 40,
		image: yoshiImage,
		numberOfFrames: 5,
		ticksPerFrame: 4
	});
	
	// Load sprite sheet
	yoshiImage.addEventListener("load", gameLoop);
	yoshiImage.src = "yoshi5.png";

} ());

window.onkeydown = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;


   if (key == 38) {
       yoshiSpriteY -= jumpHeight;
   } /*else if (key == 40) {
   		if(yoshiSpriteY < groundY)
       		yoshiSpriteY += 10;
   } else if (key == 39) {
       yoshiSpriteX += 5;
   }else if (key == 37) {
       yoshiSpriteX -= 5;
   }*/
}