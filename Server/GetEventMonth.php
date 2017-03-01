<?php
require "connection.php";
$IDUtente = require "lib/decodeToken.php";
$Month = $conn->real_escape_string($_POST['Month']);
$Year = $conn->real_escape_string($_POST['Year']);

$sql = "SELECT e.IDEvento, Titolo, DataInizio, OraInizio, DataFine, OraFine, NomeCategoria
        FROM (DateEvento de JOIN Eventi e ON e.IDEvento = de.IDEvento) ev JOIN Invitare i ON (ev.IDEvento=i.IDEvento AND ev.DataInizio=i.DataInizio)
        WHERE month(DataInizio) = $Month AND year(DataInizio) = $Year AND (e.IDCreatore = $IDUtente OR i.Email=$IDUtente)";

if(! $result = $conn->query($sql)) {
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}
if($result->num_rows > 0) {
  $rows = $result->fetch_all(MYSQLI_ASSOC);
  echo json_encode($rows);
}
else {
  echo json_encode($data = ['error' => 'Nessun evento trovato']);
  exit();
}

$conn->close();
 ?>
