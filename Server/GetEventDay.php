<?php
require "connection.php";
$IDUtente = require "lib/decodeToken.php";
$Day = $conn->real_escape_string($_POST['Day']);
$Month = $conn->real_escape_string($_POST['Month']);
$Year = $conn->real_escape_string($_POST['Year']);

$sql = "SELECT e.IDEvento, Titolo, DataInizio, OraInizio, DataFine, OraFine, NomeCategoria
        FROM DateEvento de JOIN Eventi e ON e.IDEVento = de.IDevento
        WHERE day(DataInizio) = $Day AND month(DataInizio) = $Month AND year(DataInizio) = $Year";

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
