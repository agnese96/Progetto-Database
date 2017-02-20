<?php
  require 'connection.php';
  function checkOwner($IDUtente, $IDEvento, $conn) {
    $sql="SELECT Titolo
          FROM Eventi
          WHERE IDEvento = $IDEvento AND IDCreatore = '$IDUtente'";
    if($result = $conn->query($sql)){
      if($result->num_rows==1)
        return true;
    }
    return false;
  }

  $IDUtente= require 'lib/decodeToken.php';
  $IDEvento = $conn->real_escape_string($_POST['IDEvento']);
  if(! checkOwner($IDUtente, $IDEvento, $conn)){
    echo json_encode($data=['error' => $conn->error]);
    exit();
  }

  $DataInizio  = $conn->real_escape_string($_POST['DataInizio']);
  $OraInizio = $conn->real_escape_string($_POST['OraInizio']);
  $DataFine = $conn->real_escape_string($_POST['DataFine']);
  $OraFine = $conn->real_escape_string($_POST['OraFine']);
  $Descrizione = $conn->real_escape_string($_POST['Descrizione']);
  $Titolo = $conn->real_escape_string($_POST['Titolo']);
  $Frequenza = $conn->real_escape_string($_POST['Frequenza']);
  $Promemoria = $conn->real_escape_string($_POST['Promemoria']);
  $Ricorrenza = $conn->real_escape_string($_POST['Ricorrenza']);
  $NomeCategoria = $conn->real_escape_string($_POST['NomeCategoria']);
  $DataID = $conn->real_escape_string($_POST['DataID']);

  $sql = "UPDATE DateEvento
          SET DataInizio='$DataInizio', OraInizio='$OraInizio', DataFine='$DataFine', OraFine='$OraFine'
          WHERE IDEvento=$IDEvento AND DataInizio='$DataID'";
  $sql1 ="UPDATE Eventi
          SET Descrizione='$Descrizione', Titolo='$Titolo', Frequenza=$Frequenza, NomeCategoria='$NomeCategoria',
              Promemoria=$Promemoria, Ricorrenza=$Ricorrenza
          WHERE IDEvento=$IDEvento";
  if(! $result = $conn->query($sql)){
    echo json_encode($data = ['error' => $conn->error]);
    exit();
  }
  if(! $result1 = $conn->query($sql1)) {
    echo json_encode($data = ['error' => $conn->error]);
    exit();
  }

  echo json_encode($data=['success' => true, 'idevento' => $IDEvento]);
  $conn->close();
 ?>
