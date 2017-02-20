<?php
require "connection.php";
$IDUtente = require 'lib/decodeToken.php';
$DataEvento = $conn->real_escape_string($_POST["DataEvento"]);
$IDEvento = $conn->real_escape_string($_POST["IDEvento"]);


// $sql = "SELECT Titolo, Descrizione, IFNULL(Ricorrenza,0) as Ricorrenza, IFNULL(Frequenza,0) as Frequenza, IFNULL(Promemoria,0) as Promemoria, IFNULL(NomeCategoria,0) as NomeCategoria
//         FROM Eventi, DateEvento d, Invitare i
//         WHERE d.DataInizio=$DataEvento AND d.IDEvento=$IDEvento AND i.DataInizio=$DataEvento AND i.IDEvento=$IDEvento AND
//         (IDCreatore='$IDUtente' OR Email='$IDUtente')";

$sql = "SELECT Titolo, Descrizione, DataInizio, DataFine, OraInizio, OraFine, IFNULL(Ricorrenza,0) as Ricorrenza, IFNULL(Frequenza,0) as Frequenza, IFNULL(Promemoria,0) as Promemoria, IFNULL(NomeCategoria,0) as NomeCategoria
        FROM Eventi e JOIN DateEvento d ON e.IDEvento=d.IDEvento
        WHERE d.DataInizio='$DataEvento' AND d.IDEvento=$IDEvento AND e.IDCreatore='$IDUtente' ";
if(! $result = $conn->query($sql)){
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}

if($result->num_rows > 0) {
  $row = $result->fetch_assoc();
  echo json_encode($row);
}
else {
  echo json_encode($data = ['error' => 'Evento non trovato']);
  exit();
}

$conn->close();
?>
