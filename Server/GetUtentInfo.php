<?php
require "connection.php";
$IDUtente = require 'lib/decodeToken.php';

$sql = "SELECT Email, Nome, Cognome, DataNascita, Città as City, Professione, FotoProfilo
        FROM Utenti
        WHERE Email = '$IDUtente'";

if(! $result = $conn->query($sql)) {
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}

if($result->num_rows > 0) {
  $rows = $result->fetch_all(MYSQLI_ASSOC);
  echo json_encode($rows);
}
else {
  echo json_encode($data = ['error' => 'Nessun utente trovato']);
  exit();
}

$conn->close();
 ?>
