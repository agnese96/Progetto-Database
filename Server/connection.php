<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname="Agenda";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$conn->set_charset('utf8');

function checkOwner($IDUtente, $IDEvento, $conn) {
  $sql="SELECT Titolo
        FROM Eventi
        WHERE IDEvento = $IDEvento AND IDCreatore = '$IDUtente'";
  if($result = $conn->query($sql)){
    if($result->num_rows==1)
      return true;
  }
  return false;
}
function checkOwnerDeadline($IDUtente, $IDScadenza, $conn){
  $sql="SELECT Descrizione
        FROM Scadenze
        WHERE IDScadenza = $IDScadenza AND IDCreatore = '$IDUtente'";
  if($result = $conn->query($sql)){
    if($result->num_rows==1)
      return true;
  }
  return false;
}
?>
