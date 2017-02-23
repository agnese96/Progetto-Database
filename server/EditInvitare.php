<?php
require "connection.php";
$IDUtente = require 'lib/decodeToken.php';
$DataEvento = $conn->real_escape_string($_POST["DataEvento"]);
$IDEvento = $conn->real_escape_string($_POST["IDEvento"]);
$Partecipa = $conn->real_escape_string($_POST["Partecipa"]);

$sql="UPDATE Invitare SET Partecipa = '$Partecipa'
      WHERE Email = '$IDUtente' AND IDEvento = $IDEvento AND DataInizio = '$DataEvento'";
if(! $conn->query($sql)){
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}
$conn->close();
echo json_encode($data = ['success' => true]);

?>
