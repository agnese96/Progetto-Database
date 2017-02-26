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
  $AddedPartecipants   = isset($_POST['AddedPartecipants']) ? $_POST['AddedPartecipants'] : [];
  $RemovedPartecipants = isset($_POST['RemovedPartecipants']) ? $_POST['RemovedPartecipants'] : [];

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
    $sql2 = "INSERT INTO NotificheEvento(Tipo, Data, Ora, TitoloEvento, IDEvento, DataInizio)
              VALUES('Nuovo invito a un evento', CURDATE(), CURTIME(), '$Titolo', $IDEvento, $DataID)";
    if(! $result2 = $conn->query($sql2)) {
      echo json_encode($data = ['error' => $conn->error]);
      exit();
    }
    $ric = $conn->prepare("INSERT INTO Ricevere(Email, IDNotifica) VALUES(?,?)");
    $ric->bind_param("si", $IDInvitato, $IDNotifica);

//Dentro il for creo n tuple in ricevere e n tuple in invitare
    for($i=0; $i<$n; $i++) {
      $IDInvitato = $AddedPartecipants[$i]['Email'];
      if(! $stmt->execute()) {
        echo json_encode($data = ['error' => $conn->error]);
        exit();
      }
      if(! $ric->execute()) {
        echo json_encode($data = ['error' => $conn->error]);
        exit();
      }
    }
  }

  $n1 = count($RemovedPartecipants);
  if($n1 > 0) {
    $stmt =$conn->prepare( "DELETE FROM Invitare WHERE Email=? AND IDEvento=? AND DataInizio=? ");
    $stmt->bind_param("sis", $IDInvitato, $IDEvento, $DataInizio);
    $sql2 = "INSERT INTO NotificheEvento(Tipo, Data, Ora, TitoloEvento, IDEvento, DataInizio)
              VALUES('Rimozione dalla lista dei partecipanti', CURDATE(), CURTIME(), '$Titolo', $IDEvento, $DataID)";
    if(! $result2 = $conn->query($sql2)) {
      echo json_encode($data = ['error' => $conn->error]);
      exit();
    }
    $ric = $conn->prepare("INSERT INTO Ricevere(Email, IDNotifica) VALUES(?,?)");
    $ric->bind_param("si", $IDInvitato, $IDNotifica);

//Dentro il for creo n tuple in ricevere e n tuple in invitare
    for($i=0; $i<$n1; $i++) {
      $IDInvitato = $RemovedPartecipants[$i]['Email'];
      if(! $stmt->execute()) {
        echo json_encode($data = ['error' => "Errore rimozione $i"]);
        exit();
      }
      if(! $ric->execute()) {
        echo json_encode($data = ['error' => $conn->error]);
        exit();
      }
    }
  }
  echo json_encode($data=['success' => true, 'idevento' => $IDEvento]);
  $conn->close();
 ?>
