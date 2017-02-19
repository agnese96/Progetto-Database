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

$stmt1 = $conn->prepare("INSERT INTO Eventi(Titolo, Descrizione, Ricorrenza, Frequenza, Promemoria, NomeCategoria, IDCreatore) VALUES(?,?,?,?,?,?,?)");
$stmt1->bind_param("ssiiiss", $Titolo,$Descrizione,$Ricorrenza,$Frequenza,$Promemoria,$NomeCategoria,$IDCreatore);

if(! $stmt1->execute()){
  echo json_encode($data = ['error' => "Impossibile aggiungere l'evento"]);
  exit();
}

$ID = $conn->insert_id;   //prendo l'id dell'ultimo evento inserito.

$stmt = $conn->prepare("INSERT INTO DateEvento(IDEvento, DataInizio, DataFine) VALUES(?,?,?)");
$data = ['IDEvento' => $ID];
$DataInizio = new DateTime($DataInizio);
$DataFine = new DateTime($DataFine);
$DataLimite= new DateTime();
$DataLimite->add(new DateInterval('P24M'));
$stmt->bind_param("iss", $ID, $DataI, $DataF);
if($Ricorrenza == -1) $illimitato = true; else $illimitato = false;
do {
  if(! $illimitato)
    $Ricorrenza--;
    $DataI=$DataInizio->format('Y-m-d');
    $DataF=$DataFine->format('Y-m-d');
    //TODO: Se c'è un problema nell'inserimento di uno degli eventi ricorrenti eliminare tutto ciò che è stato fatto finora
    if(! $stmt->execute()){
      echo json_encode($data = ['error' => "Impossibile creare l'evento $x!"]);
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
