<?php
require "connection.php";
$IDUtente = require 'lib/decodeToken.php';

$sql = "SELECT OraInizioGiorno, VistaCalendario
        FROM Utenti
        WHERE Email = '$IDUtente'";

if(! $result = $conn->query($sql)) {
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}

if($result->num_rows == 1) {
  $row = $result->fetch_assoc();
  echo json_encode($row);
}
else {
  echo json_encode($data = ['warning' => 'Nessuna preferenza trovata.']);
  exit();
}

$conn->close();
 ?>
