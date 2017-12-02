<!DOCTYPE html>

<html>
    <head>
        <title>Yoshi Game</title>
        <link rel="stylesheet" type="text/css" href="yoshi_game.css" />
    </head>
    <body>

        <div class="bg">
            <p id = "name_id" class = "name">
                <?php 
                    print(  "Name: " ); 
                    print(  $_POST["name"] ); 
                ?>
            </p>
        	<div id="yoshiGameContainer">
            	<div id="score">0</div>
    			<canvas id="yoshiAnimation"></canvas>
    		</div>
            <script src="animation.js"></script>
        </div>
    </body>
</html>