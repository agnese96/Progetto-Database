<?php
require "connection.php";
$IDUtente = require "lib/decodeToken.php";
$Week = $conn->real_escape_string($_POST['Week']);
$Year = $conn->real_escape_string($_POST['Year']);

$sql = "SELECT IDScadenza, Descrizione, Data, Priorità as Priority
        FROM Scadenze
        WHERE week(Data) = $Week AND year(Data) = $Year AND IDCreatore = '$IDUtente'";


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
