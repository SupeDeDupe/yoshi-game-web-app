<?php
session_start();

$_SESSION["alreadyLoaded"] = false;
//$_SESSION["highScore"] = 0;
//$_SESSION["lastScore"] = 0;
?>

<!DOCTYPE html>

<html>
   <head>
      <meta charset = "utf-8">
      <title>Animated Yoshi Game</title>
      <link rel="stylesheet" type="text/css" href="yoshi_game.css" />
   </head>
   <body>

      <div class="bg">
         <h1>Yoshi Game</h1>

         <p>Enter your name or handle: </p>
      
         <form method = "post" action = "game.php" >

            <div><label>Name:</label> 
               <input type = "text" name = "name" required></div>

            <!-- create a submit button -->
            <p><input type = "submit" name = "submit" value = "Start Game!"></p>
         </form>

         <p>This site was tested using Google Chrome</p>
      </div>
   </body>
</html>