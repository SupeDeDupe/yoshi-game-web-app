<?php
session_start();

$query = "SELECT * FROM score";

// Connect to MySQL
if ( !( $database = mysqli_connect( "localhost", "root", "" ) ) )
    die( "<p>Could not connect to database</p></body></html>" );

if ( !mysqli_select_db( $database, "flightseats" ) )
    die( "<p>Could not open the database</p></body></html>" );

// query flightseats database
if ( !( $result = mysqli_query( $database, $query ) ) ) 
{
    print( "<p>Could not execute query!</p>" );
    die( mysql_error() . "</body></html>" );
} // end if

// fetch each record in result set
for ( $counter = 0; $row = mysqli_fetch_row( $result ); ++$counter )
{
    if ($counter == 0)
    {
        $_SESSION["highScoreUser"] = $row[0];
        $_SESSION["highScore"] = $row[1]; 
    }
    else if ($row[1] > $_SESSION["highScore"])
    {
        $_SESSION["highScoreUser"] = $row[0];
        $_SESSION["highScore"] = $row[1]; 
    }
} // end for

mysqli_close( $database );


?>

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
                    if (! $_SESSION["alreadyLoaded"])
                        $_SESSION["username"] = $_POST["name"];

                    print(  "Name: " ); 
                    print(  $_SESSION["username"] ."<br />\r\n"); 
                    //print(  "Last Score: " ); 
                    //print(  $_SESSION["lastScore"] ."<br />\r\n"); 
                    print(  "High Score: " ); 
                    print(  $_SESSION["highScore"] . " by " . $_SESSION["highScoreUser"] ."<br />\r\n"); 

                    $_SESSION["alreadyLoaded"] = true;
                    
                ?>
            </p>
        	<div id="yoshiGameContainer">
            	<div id="score">0</div>
    			<canvas id="yoshiAnimation"></canvas>
    		</div>
            <script src="animation.js"></script>

            <form method="get" action="game.php">
                <p class = "buttons">
                    <button id="saveButton" type = "submit" name="save" value="save" disabled>Save Score</button>
                    <button type="submit">Restart</button>
                    <input id = "scoreToSave" type = "hidden" name = "score">
                </p>        
            </form>

            <?php
                if($_GET){
                    if(isset($_GET['save'])){
                        insert();
                    }
                }
                function insert()
                {

                    // Connect to MySQL
                if ( !( $database = mysqli_connect( "localhost", "root", "" ) ) )
                    die( "<p>Could not connect to database</p></body></html>" );

                if ( !mysqli_select_db( $database, "flightseats" ) )
                    die( "<p>Could not open the database</p></body></html>" );

                    $user = $_SESSION["username"];
                    $score = $_GET['score'];
                    
                   $insert = "INSERT INTO score " .
                   "( Username, ScoreValue )" .
                   " VALUES ( '$user'," . 
                   " '$score' )";
                   
                    if (!( $result = mysqli_query($database, $insert) ) ) {
                        die("Insert failed");
                      }

                    mysqli_close( $database );
                    
                }

            ?>

        </div>
    </body>
</html>