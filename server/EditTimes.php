<?php
require 'connection.php';

$IDUtente= require 'lib/decodeToken.php';
$IDEvento = $conn->real_escape_string($_POST['IDEvento']);
if(! checkOwner($IDUtente, $IDEvento, $conn)){
  echo json_encode($data=['error' => 'NOT_AUTHORIZED']);
  exit();
}

$DataInizio  = $conn->real_escape_string($_POST['DataInizio']);
$OraInizio = $conn->real_escape_string($_POST['OraInizio']);
$DataFine = $conn->real_escape_string($_POST['DataFine']);
$OraFine = $conn->real_escape_string($_POST['OraFine']);
$DataID = $conn->real_escape_string($_POST['DataID']);

$sql="UPDATE DateEvento SET DataInizio='$DataInizio', OraInizio='$OraInizio', DataFine='$DataFine', OraFine='$OraFine'
      WHERE IDEvento=$IDEvento AND DataInizio='$DataID'";
if(! $conn->query($sql)) {
  echo json_encode($data=['error'=>$conn->error]);
  exit();
}
echo json_encode($data=['success'=>true]);
$conn->close();
 ?>
