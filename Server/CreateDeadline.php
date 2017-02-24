<?php
require "connection.php";
$IDUtente = require 'lib/decodeToken.php';
$Descrizione = $conn->real_escape_string($_POST["Descrizione"]);
$DataScadenza = $conn->real_escape_string($_POST["Data"]);
$DataScadenza = strstr($DataScadenza, " (", true);
$Promemoria = $conn->real_escape_string($_POST["Promemoria"]);
$Ricorrenza = $conn->real_escape_string($_POST["Ricorrenza"]);
$Frequenza = $conn->real_escape_string($_POST["Frequenza"]);
$Priorità = $conn->real_escape_string($_POST["Priorità"]);

$stmt = $conn->prepare("INSERT INTO Scadenze(Descrizione, Data, Priorità, Ricorrenza, Frequenza, Promemoria, IDCreatore) VALUES (?,?,?,?,?,?,?)");
$stmt->bind_param("ssiiiis", $Descrizione, $DataS, $Priorità, $Ricorrenza, $Frequenza, $Promemoria, $IDUtente);

$DataScadenza = new DateTime($DataScadenza);
//$DataScadenza->setTimestamp($DataScadenza);
$DataS=$DataScadenza->format('Y-m-d');

if(! $stmt->execute()){
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}
$ID = $conn->insert_id;
$data = ['IDScadenza' => $ID];

$conn->close();
echo json_encode($data);

 ?>
