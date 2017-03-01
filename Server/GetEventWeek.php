<?php
require "connection.php";
$IDUtente = require "lib/decodeToken.php";
$Week = $conn->real_escape_string($_POST['Week']);
$Year = $conn->real_escape_string($_POST['Year']);

/*$sql = "SELECT e.IDEvento, Titolo, de.DataInizio, OraInizio, DataFine, OraFine, NomeCategoria
        FROM (DateEvento de JOIN Eventi e ON e.IDEvento = de.IDEvento) JOIN Invitare i ON (e.IDEvento=i.IDEvento AND de.DataInizio=i.DataInizio)
        WHERE week(de.DataInizio) = $Week AND year(de.DataInizio) = $Year AND (e.IDCreatore='$IDUtente' OR i.Email='$IDUtente')";*/
$sql = "SELECT e.IDEvento, Titolo, de.DataInizio, OraInizio, DataFine, OraFine, NomeCategoria
        FROM (DateEvento de JOIN Eventi e ON e.IDEvento = de.IDEvento) JOIN Invitare i ON (e.IDEvento=i.IDEvento AND de.DataInizio=i.DataInizio)
        WHERE (week(de.DataInizio) <= $Week OR week(de.DataFine) >= $Week) AND (year(de.DataInizio) <= $Year OR year(de.DataFine) >= $Year) AND i.Email='$IDUtente'
        UNION
        SELECT e.IDEvento, Titolo, de.DataInizio, OraInizio, DataFine, OraFine, NomeCategoria
        FROM DateEvento de JOIN Eventi e ON e.IDEvento = de.IDEvento
        WHERE (week(de.DataInizio) <= $Week OR week(de.DataFine) >= $Week) AND (year(de.DataInizio) <= $Year OR year(de.DataFine) >= $Year) AND e.IDCreatore='$IDUtente'";


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
