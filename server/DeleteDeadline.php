<?php
require "connection.php";
$IDUtente = require 'lib/decodeToken.php';
$IDScadenza = $conn->real_escape_string($_POST["IDScadenza"]);

if(! checkOwnerDeadline($IDUtente, $IDScadenza, $conn)) {
  echo json_encode($data=['error' => 'NOT_AUTHORIZED']);
  exit();
}

$sql = "DELETE FROM Scadenze WHERE IDScadenza = '$IDScadenza'";

if(! $result = $conn->query($sql)) {
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}

$conn->close();
echo json_encode($data = ['success' => true]);
 ?>
