<?php
require "connection.php";
$IDUtente = require 'lib/decodeToken.php';
$Titolo = $conn->real_escape_string($_POST["Titolo"]);
$Descrizione = $conn->real_escape_string($_POST["Descrizione"]);
$Ricorrenza = $conn->real_escape_string($_POST["Ricorrenza"]);
$Frequenza = $conn->real_escape_string($_POST["Frequenza"]);
$Promemoria = $conn->real_escape_string($_POST["Promemoria"]);
$DataInizio = $conn->real_escape_string($_POST["DataInizio"]);
$DataInizio = strstr($DataInizio, " (", true);
$OraInizio = $conn->real_escape_string($_POST["OraInizio"]);
$OraInizio = strstr($OraInizio, " (", true);
$DataFine = $conn->real_escape_string($_POST["DataFine"]);
$DataFine = strstr($DataFine, " (", true);
$OraFine = $conn->real_escape_string($_POST["OraFine"]);
$OraFine = strstr($OraFine, " (", true);
$NomeCategoria = $conn->real_escape_string($_POST["NomeCategoria"]);
$HasPartecipants = $_POST['HasPartecipants'];

if($HasPartecipants == 1){
  $Partecipanti=$_POST['Partecipanti'];
}


if($Ricorrenza!=0 && $Frequenza==0) {
  echo json_encode($data = ['error' => 'Frequenza deve essere almeno 1!']);
  exit();
}

set_time_limit(300);

//TODO: Permettere di avere dei campi facoltativi, controllare quindi se ho tutti i valori ed eventualmente modificare la query.
$stmt1 = $conn->prepare("INSERT INTO Eventi(Titolo, Descrizione, Ricorrenza, Frequenza, Promemoria, NomeCategoria, IDCreatore) VALUES(?,?,?,?,?,?,?)");
$stmt1->bind_param("ssiiiss", $Titolo,$Descrizione,$Ricorrenza,$Frequenza,$Promemoria,$NomeCategoria,$IDUtente);

if(! $stmt1->execute()){
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}

$ID = $conn->insert_id;   //prendo l'id dell'ultimo evento inserito.

$stmt = $conn->prepare("INSERT INTO DateEvento(IDEvento, DataInizio, DataFine, OraInizio, OraFine) VALUES(?,?,?,?,?)");
$not = $conn->prepare("INSERT INTO NotificheEvento(Tipo, Data, Ora, TitoloEvento, IDEvento, DataInizio) VALUES('P',?,?,?,?,?)");
$not->bind_param('sssis',$DataNotifica, $OraNotifica, $Titolo, $ID, $DataI);
$ric = $conn->prepare("INSERT INTO Ricevere (Email, IDNotifica) VALUES (?,?)");
$ric->bind_param('si',$IDUtente, $IDNotifica);
$DataInizio = new DateTime($DataInizio);
$DataFine = new DateTime($DataFine);

$OraInizio = new DateTime($OraInizio);
$OraInizio = ($OraInizio)->format('H:i:s');
$OraFine = new DateTime($OraFine);
$OraFine = ($OraFine)->format('H:i:s');
$DataLimite = new DateTime();
$DataLimite->add(new DateInterval('P24M'));
$stmt->bind_param("issss", $ID, $DataI, $DataF, $OraInizio, $OraFine);
//Query da eseguire per inserire i partecipanti e associare le relative notifiche
if($HasPartecipants) {
  $inv1 = $conn->prepare("INSERT INTO Invitare(Email, DataInizio, IDEvento) VALUES(?,?,?)");
  $inv1->bind_param("ssi", $Email, $DataI, $ID);
  $not1 = $conn->prepare("INSERT INTO NotificheEvento(Tipo, Data, Ora, TitoloEvento, IDEvento, DataInizio) VALUES('N',CURDATE(),CURTIME(),?,?,?)");
  $not1->bind_param('sis', $Titolo, $ID, $DataI);
  $ric1 = $conn->prepare("INSERT INTO Ricevere (Email, IDNotifica) VALUES (?,?)");
  $ric1->bind_param('si',$Email, $IDNotifica1);
  $ric2 = $conn->prepare("INSERT INTO Ricevere (Email, IDNotifica) VALUES (?,?)");
  $ric2->bind_param('si',$Email, $IDNotifica);
}
if($Ricorrenza == -1) $illimitato = true; else $illimitato = false;

$data = ['IDEvento' => $ID, 'DataEvento' => $DataInizio->format('Y-m-d')];

do {
  if(! $illimitato)
    $Ricorrenza--;
    $DataI=$DataInizio->format('Y-m-d');
    $DataF=$DataFine->format('Y-m-d');
    $DataNotifica=$DataInizio->sub(new DateInterval('PT'.$Promemoria.'H'))->format('Y-m-d');
    $OraNotifica=(new DateTime($OraInizio))->sub(new DateInterval('PT'.$Promemoria.'H'))->format('H:i:s');
    //TODO: Se c'è un problema nell'inserimento di uno degli eventi ricorrenti eliminare tutto ciò che è stato fatto finora
    if(! $stmt->execute()){
      echo json_encode($data = ['error' => $conn->error]);
      exit();
    }
    if(! $not->execute()){
      echo json_encode($data = ['error' => $conn->error]);
      exit();
    }
    $IDNotifica=$conn->insert_id;
    if(! $ric->execute()){
      echo json_encode($data = ['error' => $conn->error]);
      exit();
    }
    if($HasPartecipants) {
      if(! $not1->execute()) {
        echo json_encode($data = ['error' => $conn->error]);
        exit();
      }
      $IDNotifica1=$conn->insert_id;
      $n = count($Partecipanti);

      for($i=0; $i<$n; $i++) {
        $Email = $Partecipanti[$i]['Email'];
        if(! $inv1->execute()) {
          echo json_encode($data = ['error' => $conn->error]);
          exit();
        }
        if(! $ric1->execute()){
          echo json_encode($data = ['error' => $conn->error]);
          exit();
        }
        //Creo la notifica di Promemoria
        if(! $ric2->execute()){
          echo json_encode($data = ['error' => $conn->error]);
          exit();
        }
      }
    }
    $DataInizio->add(new DateInterval('P'.$Frequenza.'D'));
    $DataFine->add(new DateInterval('P'.$Frequenza.'D'));

} while (($Ricorrenza>0 || $illimitato) && $DataInizio < $DataLimite);

if(! $illimitato){
  $conn->query("UPDATE Eventi SET Ricorrenza=$Ricorrenza WHERE IDEvento=$ID");
}

$conn->close();
echo json_encode($data);
?>
