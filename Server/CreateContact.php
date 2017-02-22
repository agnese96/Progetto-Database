<?php
require "connection.php";
$IDUtente = require 'lib/decodeToken.php';
$IDContatto = $conn->real_escape_string($_POST["IDContatto"]);

$sql = "SELECT * FROM Utenti WHERE Email = '$IDContatto'";

if(! $result = $conn->query($sql)) {
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}
if($result->num_rows <> 1) {
  echo json_encode($data = ['warning' => true]);
  exit();
}

$sql1 = "INSERT INTO Contatti(Email1, Email2) VALUES ('$IDUtente', '$IDContatto')";

if(! $result = $conn->query($sql1)) {
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}

$conn->close();
echo json_encode($data = ['success' => true]);
 ?>
