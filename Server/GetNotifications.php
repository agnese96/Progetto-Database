<?php
require "connection.php";
$IDUtente = require "lib\decodeToken.php";

$sql = "SELECT TitoloEvento, Data, Ora, Tipo, IDEvento, DataInizio
        FROM NotificheEvento ne JOIN Ricevere r ON ne.IDNotifica=r.IDNotifica
        WHERE Data<=CURDATE() AND CURTIME()<=DATE_ADD(Ora, INTERVAL 45 SECOND) AND r.Email='$IDUtente'";

$sql1 = "SELECT Data, Descrizione, Priorità
        FROM Scadenze
        WHERE CURDATE()>=DATE_SUB(Data, INTERVAL Promemoria DAY) AND IDCreatore='$IDUtente'";

if(! $result = $conn->query($sql)) {
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}
if(! $result1 = $conn->query($sql1)) {
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}


$rowsNE = [];
$rowsNS = [];

if($result->num_rows > 0)
  $rowsNE = $result->fetch_all(MYSQLI_ASSOC);
if($result1->num_rows > 0)
  $rowsNS = $result1->fetch_all(MYSQLI_ASSOC);

echo json_encode($data = ['NotificheEvento' => $rowsNE, 'NotificheScadenza' => $rowsNS]);

//echo json_encode($data = ['warning' => 'Nessuna notifica trovata']);

$conn->close();
 ?>
