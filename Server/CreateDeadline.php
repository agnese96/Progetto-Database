<?php
require "connection.php";
$IDUtente = require 'lib/decodeToken';
$Descrizione = $conn->real_escape_string($_POT["Descrizione"]);
$DataScadenza = $conn->real_escape_string($_POT["Data"]);
$Promemoria = $conn->real_escape_string($_POT["Promemoria"]);
$Ricorrenza = $conn->real_escape_string($_POT["Ricorrenza"]);
$Frequenza = $conn->real_escape_string($_POT["Frequenza"]);
$Priorità = $conn->real_escape_string($_POT["Priorità"]);

if(! $Token=JWT::decode($Token, 'secret_server_key'))
  echo json_encode(['error' => 'Devi fare il login']);
$IDUtente=$Token->email;

$stmt = $conn->prepare("INSERT INTO Scadenze(Descrizione, Data, Priorità, Ricorrenza, Frequenza, Promemoria, IDCreatore) VALUES (?,?,?,?,?,?,?)");
$stmt->bind_param("ssiiiis", $Descrizione, $DataScadenza, $Priorità, $Ricorrenza, $Frequenza, $IDUtente);

$ID = $conn->insert_id;

$DataScadenza = new DateTime($DataScadenza);
$DataLimite= new DateTime();
$DataLimite->add(new DateInterval('P24M'));
if($Ricorrenza == -1) $illimitato = true; else $illimitato = false;

$data = ['IDScadenza' => $ID, 'DataScadenza' => $DataScadenza->format('Y-m-d')];

do {
  if(! $illimitato)
    $Ricorrenza--;
    $DataScadenza=$DataScadenza->format('Y-m-d');
    //TODO: Se c'è un problema nell'inserimento di uno degli eventi ricorrenti eliminare tutto ciò che è stato fatto finora
    if(! $stmt->execute()){
      echo json_encode($data = ['error' => $conn->error]);
      exit();
    }
    $DataScadenza->add(new DateInterval('P'.$Frequenza.'D'));

} while (($Ricorrenza>0 || $illimitato) && $DataScadenza < $DataLimite);

if(! $illimitato){
  $conn->query("UPDATE Scadenze SET Ricorrenza=$Ricorrenza WHERE IDScadenza=$ID");
}

$conn->close();
echo json_encode($data);

 ?>
