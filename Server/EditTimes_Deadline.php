<?php
require 'connection.php';
$IDUtente = require 'lib/decodeToken.php';
$IDScadenza = $conn->real_escape_string($_POST['IDScadenza']);
$Data  = $conn->real_escape_string($_POST['Data']);

$sql="UPDATE Scadenze SET Data='$Data'
      WHERE IDScadenza=$IDScadenza";

if(! $conn->query($sql)) {
  echo json_encode($data=['error'=>$conn->error]);
  exit();
}

echo json_encode($data=['success'=>true]);

$conn->close();
 ?>
