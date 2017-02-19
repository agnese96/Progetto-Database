<?php
require "connection.php";
require 'lib/JWT.php';
$Titolo = $conn->real_escape_string($_POST["Titolo"]);
$Descrizione = $conn->real_escape_string($_POST["Descrizione"]);
$Ricorrenza = $conn->real_escape_string($_POST["Ricorrenza"]);
$Frequenza = $conn->real_escape_string($_POST["Frequenza"]);
$Promemoria = $conn->real_escape_string($_POST["Promemoria"]);
$DataInizio = $conn->real_escape_string($_POST["DataInizio"]);
$OraInizio = $conn->real_escape_string($_POST["OraInizio"]);
$DataFine = $conn->real_escape_string($_POST["DataFine"]);
$OraFine = $conn->real_escape_string($_POST["OraFine"]);
$NomeCategoria = $conn->real_escape_string($_POST["NomeCategoria"]);
$Token = $_POST['token'];
//$DataInizio .= $OraInizio;//$DataFine .= $OraFine;


if(! $Token=JWT::decode($Token, 'secret_server_key'))
  echo json_encode(['error' => 'Devi fare il login']);
$IDCreatore=$Token->email;

//TODO: Permettere di avere dei campi facoltativi, controllare quindi se ho tutti i valori ed eventualmente modificare la query.
$stmt1 = $conn->prepare("INSERT INTO Eventi(Titolo, Descrizione, Ricorrenza, Frequenza, Promemoria, NomeCategoria, IDCreatore) VALUES(?,?,?,?,?,?,?)");
$stmt1->bind_param("ssiiiss", $Titolo,$Descrizione,$Ricorrenza,$Frequenza,$Promemoria,$NomeCategoria,$IDCreatore);

if(! $stmt1->execute()){
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}

$ID = $conn->insert_id;   //prendo l'id dell'ultimo evento inserito.

$stmt = $conn->prepare("INSERT INTO DateEvento(IDEvento, DataInizio, DataFine, OraInizio, OraFine) VALUES(?,?,?,?,?)");
$not = $conn->prepare("INSERT INTO NotificheEvento(Tipo, Data, Ora, TitoloEvento, IDEvento, DataInizio) VALUES('P',?,?,?,?,?)");
$not->bind_param('sssis',$DataNotifica, $OraNotifica, $Titolo, $ID, $DataI);
$ric = $conn->prepare("INSERT INTO Ricevere (Email, IDNotifica) VALUES (?,?)");
$ric->bind_param('si',$IDCreatore, $IDNotifica);
$DataInizio = new DateTime($DataInizio);
$DataFine = new DateTime($DataFine);
$OraInizio= (new DateTime($OraInizio))->format('H:i:s');
$OraFine= (new DateTime($OraFine))->format('H:i:s');
$DataLimite= new DateTime();
$DataLimite->add(new DateInterval('P24M'));
$stmt->bind_param("issss", $ID, $DataI, $DataF, $OraInizio, $OraFine);
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
    $DataInizio->add(new DateInterval('P'.$Frequenza.'D'));
    $DataFine->add(new DateInterval('P'.$Frequenza.'D'));

} while (($Ricorrenza>0 || $illimitato) && $DataInizio < $DataLimite);

if(! $illimitato){
  $conn->query("UPDATE Eventi SET Ricorrenza=$Ricorrenza WHERE IDEvento=$ID");
}


$conn->close();
echo json_encode($data);
?>
