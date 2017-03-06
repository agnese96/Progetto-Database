<?php
require "connection.php";
$IDUtente = require "lib/decodeToken.php";

$sql = "SELECT TitoloEvento, Data, Ora, Tipo, de.IDEvento, de.DataInizio, OraInizio, Promemoria
        FROM ((NotificheEvento ne JOIN Ricevere r ON ne.IDNotifica=r.IDNotifica)
              JOIN DateEvento de ON (de.DataInizio=ne.DataInizio AND de.IDEvento=ne.IDEvento))
              JOIN Eventi e ON (de.IDEvento=e.IDEvento)
        WHERE Data<=CURDATE() AND CURTIME()<=DATE_ADD(Ora, INTERVAL Promemoria HOUR) AND r.Email='$IDUtente'
        ORDER BY Data, Ora DESC";

$sql1 = "SELECT Data, Descrizione, IDScadenza, DATE_SUB(Data, INTERVAL Promemoria DAY) AS DataNotifica
        FROM Scadenze
        WHERE CURDATE()>=DATE_SUB(Data, INTERVAL Promemoria DAY) AND IDCreatore='$IDUtente'
        ORDER BY Data DESC";

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
