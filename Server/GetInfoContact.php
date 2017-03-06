<?php
require "connection.php";
$IDUtente = require 'lib/decodeToken.php';
$IDContatto = $conn->real_escape_string($_POST["IDContatto"]);

$sql = "SELECT Email, Nome, Cognome, DataNascita, Città as City, Professione
        FROM Contatti JOIN Utenti ON Utenti.Email = Contatti.Email2
        WHERE Contatti.Email1 = '$IDUtente'";

if(! $result = $conn->query($sql)) {
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}

if($result->num_rows == 1) {
  $row = $result->fetch_assoc();
  echo json_encode($row);
}
else {
  echo json_encode($data = ['warning' => 'Nessuna inforamzione trovata.']);
  exit();
}

$conn->close();
 ?>
