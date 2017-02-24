<?php
require "connection.php";
$IDUtente = require 'lib/decodeToken.php';
$DataEvento = $conn->real_escape_string($_POST["DataEvento"]);
$IDEvento = $conn->real_escape_string($_POST["IDEvento"]);

if(checkOwner($IDUtente, $IDEvento, $conn)){
  $sql = "SELECT IDCreatore, Titolo, Descrizione, DataInizio, DataFine, OraInizio, OraFine, IFNULL(Ricorrenza,0) as Ricorrenza, IFNULL(Frequenza,0) as Frequenza, IFNULL(Promemoria,0) as Promemoria, IFNULL(NomeCategoria,0) as NomeCategoria
          FROM Eventi e JOIN DateEvento d ON e.IDEvento=d.IDEvento
          WHERE d.DataInizio='$DataEvento' AND d.IDEvento=$IDEvento AND e.IDCreatore='$IDUtente' ";
}else {
  $sql = "SELECT IDCreatore, Titolo, Descrizione, d.DataInizio, DataFine, OraInizio, OraFine, IFNULL(Ricorrenza,0) as Ricorrenza, IFNULL(Frequenza,0) as Frequenza, IFNULL(Promemoria,0) as Promemoria, IFNULL(NomeCategoria,0) as NomeCategoria, Partecipa
          FROM (Eventi e JOIN DateEvento d ON e.IDEvento=d.IDEvento) JOIN  Invitare i ON (d.IDEvento=i.IDEvento AND d.DataInizio=i.DataInizio)
          WHERE d.DataInizio='$DataEvento' AND d.IDEvento=$IDEvento AND i.Email='$IDUtente'";
}

$sql1 = "SELECT u.Email, CONCAT_WS(' ', Cognome, Nome) AS Nominativo, u.FotoProfilo, i.Partecipa
        FROM (DateEvento de JOIN Invitare i ON de.IDEvento=i.IDEvento AND de.DataInizio=i.DataInizio) JOIN Utenti u ON i.Email=u.Email
        WHERE de.DataInizio='$DataEvento' AND de.IDEvento=$IDEvento AND (i.Email>'$IDUtente' OR i.Email<'$IDUtente')";

if(! $result = $conn->query($sql)){
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}

if($result->num_rows > 0) {
  if(! $result1 = $conn->query($sql1)){
    echo json_encode($data = ['error' => $conn->error]);
    exit();
  }
  $row = $result->fetch_assoc();
  if($result1->num_rows > 0) {
      $rows = $result1->fetch_all(MYSQLI_ASSOC);
      echo json_encode($data = ['event' => $row, 'partecipants' => $rows]);
  }
  else
    echo json_encode($data = ['event' => $row]);
}
else {
  echo json_encode($data = ['error' => 'Evento non trovato']);
  exit();
}

$conn->close();
?>
