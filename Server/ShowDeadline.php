<?php
require "connection.php";
$IDUtente = require 'lib/decodeToken.php';
$Data = $conn->real_escape_string($_POST["Data"]);
$IDScadenza = $conn->real_escape_string($_POST["IDScadenza"]);

$sql = "SELECT Descrizione, Data, IFNULL(Ricorrenza,0) as Ricorrenza, IFNULL(Frequenza,0) as Frequenza, IFNULL(Promemoria,0) as Promemoria
        FROM Scadenze
        WHERE IDScadenza=$IDScadenza AND IDCreatore='$IDUtente' ";
if(! $result = $conn->query($sql)){
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}

if($result->num_rows > 0) {
  $row = $result->fetch_assoc();
  $row['owner']=checkOwner($IDUtente, $IDScadenza, $conn);
  echo json_encode($row);
}
else {
  echo json_encode($data = ['error' => 'Scadenza non trovato']);
  exit();
}

$conn->close();
?>
