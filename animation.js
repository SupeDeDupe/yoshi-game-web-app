
var forwardInSpriteSheet = true;
var groundY = 430;
var yoshiVelocity = 10;
var yoshiSpriteX = 200;
var yoshiSpriteY = groundY;

var score = 0;
var yoshi;
var yoshiImage;
var canvas = document.getElementById("yoshiAnimation");
var numRocks = 0;
var rocksFalling = new Array ();
var rockValuesX = new Array ();
var rockValuesY = new Array ();
var rocksLanded = new Array ();
var rockIndex = 0;
var rockSpeed = 1;
var endArray = false;

var rockSize = 30;
var rockStartY = -30;
var maxRocks = 5;

//var numCoins = 0;
//var maxCoins = 5;
//var coinValuesX = new Array ();
var coinCollected = true;
var coinSize = 20;
var coinX;
var coinY = groundY + coinSize;

var jumpHeight = 50;
var jumpSpeed = 10;
var upperJumpBound = 50;
var goingUp = false;

var gameOver = false;

var yoshiWidth;
var yoshiHeight;
var frameCount;
var yoshiRight = true;
var dirChange = false;

var lastRockMade = new Date().getTime();
var lastRockImgUpdate = new Date().getTime();
var lastYoshiImgChange = new Date().getTime();
var lastScoreChange = new Date().getTime();
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

	function gameLoop () {
	

	  window.requestAnimationFrame(gameLoop);

	  var time = new Date().getTime();

	  if(gameOver)
	  {
	  	//document.getElementById("gameover").innerHTML = "Game Over!";
	  	updateDatabaseScores();
	  }
	  else
	  {
	  	yoshi.update();
	  	yoshi.render();
	  	

	  	if(coinCollected)
	  		addCoin();

	  	drawCoin();

	  	if (time - lastRockMade > 1000)
	  	{
	  		addRock();
	  		lastRockMade = time;
	  	}

	  	for (var i = 0; i < numRocks; i++) {
	  		drawRock(i);
	  		if (rockValuesY[i] < groundY + rockSize)
	  		{
	  			if (time - lastRockImgUpdate > 10)
	  				rockValuesY[i] = rockValuesY[i]+rockSpeed;
	  		}
	  		else
	  		{
	  			rocksFalling[i] = false;
	  			rocksLanded[rocksLanded.length] = i;
	  		}
	  	}

	  	if (time - lastRockImgUpdate > 10)
	  		lastRockImgUpdate = new Date().getTime();
	  	
	  	rockSpeed = score+1;
	  }
	}

	function addCoin()
	{
		coinX = Math.floor( -10 + Math.random() *  canvas.width);
		coinCollected = false;
	}


	function drawCoin(rockIndex) {
		var ctx=canvas.getContext("2d");
    	var img = new Image();
    	img.src="camel.png";
    	
    	ctx.drawImage(img, coinX, coinY, coinSize, coinSize);
    	if(Math.abs(coinX - yoshiSpriteX ) < coinSize
    		&& Math.abs(coinY - yoshiSpriteY) < coinSize + 10
    		&& !coinCollected)
    	{
    			coinCollected = true;
    			score++;
            	lastScoreChange = new Date().getTime();
            	document.getElementById("score").innerHTML = score;
    	}
	}

	function addRock()
	{
		if (rocksLanded.length > maxRocks)
		{
			rockIndex = rocksLanded[0];
			rocksLanded = new Array();
			endArray = true;
		}

		rockValuesX[rockIndex] = Math.floor( -10 + Math.random() *  canvas.width);
		rockValuesY[rockIndex] = rockStartY;
		rocksFalling[rockIndex] = true;
		rockIndex++;

		if (!endArray)
			numRocks++;
	}


	function drawRock(rockIndex) {
		var ctx=canvas.getContext("2d");
    	var img = new Image();
    	img.src="rock.png";
    	
    	ctx.drawImage(img, rockValuesX[rockIndex], rockValuesY[rockIndex], rockSize, rockSize);
    	if(Math.abs(rockValuesX[rockIndex] - yoshiSpriteX ) < rockSize -5
    		&& Math.abs(rockValuesY[rockIndex] - yoshiSpriteY) < rockSize - 10
    		&& rocksFalling[rockIndex])
    			gameOver = true;
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

            if(currTime - lastScoreChange > 1000)
            {
            	//score++;
            	lastScoreChange = new Date().getTime();
            	document.getElementById("score").innerHTML = score;
            }

            if (currTime - lastYoshiImgChange > yoshiMotionDelay)
            {
            	lastYoshiImgChange = new Date().getTime();
				
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
	
	canvas.width = 900;
	canvas.height = 680;
	
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
} ());

function updateDatabaseScores()
{
	/*
	<?php

		session_start();

		$query = "SELECT * FROM seat";

		// Connect to MySQL
		if ( !( $database = mysqli_connect( "db.peicloud.ca", "tauU", "tautau" ) ) )
		    die( "<p>Could not connect to database</p></body></html>" );

		if ( !mysqli_select_db( $database, "tauDB" ) )
		    die( "<p>Could not open tauDB database</p></body></html>" );

		// query flightseats database
		if ( !( $result = mysqli_query( $database, $query ) ) ) 
		{
		    print( "<p>Could not execute query!</p>" );
		    die( mysql_error() . "</body></html>" );
		} // end if

	?>*/
}

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
   else if (key == 39 && yoshiSpriteX+yoshiWidth < 900) 
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