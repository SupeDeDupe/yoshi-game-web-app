var forwardInSpriteSheet = true;
var groundY = 200;
var yoshiVelocity = 10;
var yoshiSpriteX = 200;
var yoshiSpriteY = groundY;

var jumpHeight = 50;
var jumpSpeed = 10;
var upperJumpBound = 50;
var goingUp = false;

var yoshiWidth;
var yoshiHeight;
var frameCount;
var yoshiRight = true;
var dirChange = false;

var lastImgChange = new Date().getTime();
var yoshiMotionDelay = 50;

function start() 
{
    window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
	})();
}

(function () {
			
	var yoshi;
	var yoshiImage;
	var canvas;	
	var rockImage;
	var rock1;


	function gameLoop () {
	

	  window.requestAnimationFrame(gameLoop);

	  rock1.updateRock();
	  rock1.renderRock();

	  //yoshi.update();
	  //yoshi.render();
	}

	function rock (options) {
		var rock ={};

		rock.context = options.context;
		rock.width = options.width;
		rock.height = options.height;
		rock.image = options.image;
		rock.x = options.x;
		rock.y = options.y;

		rock.updateRock = function () {
			if (rock.y < groundY)
				rock.y += jumpSpeed;
		};

		rock.renderRock = function () {
		
		  // Clear the canvas
		  rock.context.clearRect(0, 0, canvas.width, canvas.height);
		  
		  // Draw the animation
		  rock.context.drawImage(
		    rock.image,
		    0,
		    0,
		    rock.width,
		    rock.height,
		    rock.x,
		    rock.y,
		    rock.width,
		    rock.height);
		};

		return rock;
	}
	
	function sprite (options) {
	
		var fullSprite = {},
			frameIndex = 0,
			numberOfFrames = options.numberOfFrames || 1;
		
		fullSprite.context = options.context;
		fullSprite.width = options.width;
		fullSprite.height = options.height;
		fullSprite.image = options.image;

		yoshiWidth = fullSprite.width / numberOfFrames;
		yoshiHeight = fullSprite.height / numberOfFrames;
		
		fullSprite.update = function () {

            var currTime = new Date().getTime();

            if (currTime - lastImgChange > yoshiMotionDelay)
            {
            	lastImgChange = new Date().getTime();
				
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
               	if(yoshiSpriteX+fullSprite.width / numberOfFrames > 500 || yoshiSpriteX < 0)
               		yoshiVelocity *= -1;
                
                yoshiSpriteX += yoshiVelocity;
*/
                if(!goingUp && yoshiSpriteY < groundY)
                	yoshiSpriteY += jumpSpeed;

                if (dirChange)
                {
                	yoshiRight = !yoshiRight;
                	if (yoshiRight)
                	{
						yoshi.image.src = "yoshi_right.png";
                	}
		  			else
		  			{
		  				yoshi.image.src = "yoshi_left.png";
		  			}
		  			dirChange = false;
		  			//document.getElementById("score").innerHTML = yoshi.ticksPerFrame;
		  			//var why = window.prompt(yoshi.ticksPerFrame );
		  		}
                
            }
        };
		
		fullSprite.render = function () {
		
		  // Clear the canvas
		  fullSprite.context.clearRect(0, 0, canvas.width, canvas.height);
		  
		  // Draw the animation
		  fullSprite.context.drawImage(
		    fullSprite.image,
		    frameIndex * fullSprite.width / numberOfFrames,
		    0,
		    fullSprite.width / numberOfFrames,
		    fullSprite.height,
		    yoshiSpriteX,
		    yoshiSpriteY,
		    fullSprite.width / numberOfFrames,
		    fullSprite.height);
		};
		
		return fullSprite;
	}
	
	// Get canvas
	canvas = document.getElementById("yoshiAnimation");
	canvas.width = 500;
	canvas.height = 310;
	
	// Create sprite sheet
	yoshiImage = new Image();	
	
	// Create sprite
	yoshi = sprite({
		context: canvas.getContext("2d"),
		width: 136,
		height: 40,
		image: yoshiImage,
		numberOfFrames: 5,
	});
	
	// Load sprite sheet
	yoshiImage.addEventListener("load", gameLoop);
	yoshiImage.src = "yoshi_right.png";

	rockImage = new Image();	

	rock1 = rock({
		context: canvas.getContext("2d"),
		width: 50,
		height: 50,
		image: rockImage,
		x: 30,
		y: 30,
	});

	rockImage.addEventListener("load", gameLoop);
	rockImage.src = "rock.png";

} ());


window.onkeydown = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;

   // jump up
   if (key == 38 && yoshiSpriteY+yoshiHeight > 35) 
   {
       yoshiSpriteY -= jumpHeight;
   } 
   // jump down
   else if (key == 40) 
   {
   		if(yoshiSpriteY < groundY)
       		yoshiSpriteY += 10;
   } 
   // Walk right
   else if (key == 39 && yoshiSpriteX+yoshiWidth < 500) 
   {
       yoshiSpriteX += yoshiVelocity;
       if (!yoshiRight)
       	dirChange = true;
   }
   // Walk left
   else if (key == 37 && yoshiSpriteX > 0) 
   {
       yoshiSpriteX -= yoshiVelocity;
       if (yoshiRight)
       	dirChange = true;
   }
}