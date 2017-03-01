<?php
  require 'connection.php';
  $IDUtente = require 'lib/decodeToken.php';
  $IDScadenza = $conn->real_escape_string($_POST['IDScadenza']);
  if(! checkOwnerDeadline($IDUtente, $IDScadenza, $conn)) {
    echo json_encode($data=['error' => $conn->error]);
    exit();
  }

  $Descrizione = $conn->real_escape_string($_POST['Descrizione']);
  $Data = $conn->real_escape_string($_POST['Data']);
  $Promemoria = $conn->real_escape_string($_POST['Promemoria']);
  $Frequenza = $conn->real_escape_string($_POST['Frequenza']);
  $Ricorrenza = $conn->real_escape_string($_POST['Ricorrenza']);
  $Priorità = $conn->real_escape_string($_POST['Priority']);

  $sql = "UPDATE Scadenze
          SET Descrizione='$Descrizione', Data='$Data', Promemoria=$Promemoria, Frequenza=$Frequenza, Ricorrenza=$Ricorrenza, Priorità=$Priorità
          WHERE IDScadenza='$IDScadenza'";
  if(! $result = $conn->query($sql)) {
    echo json_encode($data = ['error' => $conn->error]);
    exit();
  }

  echo json_encode($data = ['success' => true, 'idscadenza' => $IDScadenza]);
  $conn->close();
 ?>
