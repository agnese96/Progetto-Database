<?php
  require 'connection.php';

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
  $AddedPartecipants = $conn->real_escape_string($_POST['AddedPartecipants']);
  $RemovedPartecipants = $conn->real_escape_string($_POST['RemovedPartecipants']);

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

  $n = count($AddedPartecipants);
  if( $n > 0) {
    $stmt = $conn->prepare("INSERT INTO Invitare(Email, DataInizio, IDEvento) VALUES(?,?,?)");
    $stmt->bind_param("ssi", $IDInvitato, $DataInizio, $IDEvento);
    for($i=0; $i<$n; $i++) {
      $IDInvitato = $AddedPartecipants[$i]['Email'];
      if(! $stmt->execute()) {
        echo json_encode($data = ['error' => $conn->error]);
        exit();
      }
    }
    echo json_encode($data = ['success' => true]);
  }

  $n1 = count($RemovedPartecipants);
  if($n1 > 0) {
    $stmt = "DELETE FROM Invitare WHERE Email=? AND IDEvento=? AND DataInizio=? ";
    $stmt->bind_param("sis", $IDInvitato, $IDEvento, $DataInizio);
    for($i=0; $i<$n; $i++) {
      $IDInvitato = $RemovedPartecipants[$i]['Email'];
      if(! $stmt->execute()) {
        echo json_encode($data = ['error' => $conn->error]);
        exit();
      }
    }
    echo json_encode($data = ['success' => true]);
  }

  echo json_encode($data=['success' => true, 'idevento' => $IDEvento]);
  $conn->close();
 ?>
