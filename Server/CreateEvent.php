<?php
require "connection.php";
$Titolo = $conn->real_escape_string($_POST["Titolo"]);
$Descrizione = $conn->real_escape_string($_POST["Descrizione"]);
$Ricorrenza = $conn->real_escape_string($_POST["Ricorrenza"]);
$Frequenza = $conn->real_escape_string($_POST["Frequenza"]);
$Promemoria = $conn->real_escape_string($_POST["Promemoria"]);
$DataInizio = $conn->real_escape_string($_POST["DataInizio"]);
$OraInizio = $conn->real_escape_string($_POST["OraInizio"]);
//$DataInizio .= $OraInizio;
$DataFine = $conn->real_escape_string($_POST["DataFine"]);
$OraFine = $conn->real_escape_string($_POST["OraFine"]);
//$DataFine .= $OraFine;
$NomeCategoria = $conn->real_escape_string($_POST["NomeCategoria"]);

/*
if($Ricorrenza == 0)  // if user didn't insert any value
  $ric = 24;
else if($Ricorrenza > 24) {
  $ric = 24;

}
else {
  $ric = $Ricorrenza;   // if user inserted some value
  $Ricorrenza
}
*/

$stmt1 = $conn->prepare("INSERT INTO Eventi(Titolo, Descrizione, Ricorrenza, Frequenza, Promemoria, NomeCategoria) VALUES(?,?,?,?,?,?)");
$stmt1->bind_param("ssiiis", $Titolo,$Descrizione,$Ricorrenza,$Frequenza,$Promemoria,$NomeCategoria);
//$stmt1->execute();

$ID = $conn->insert_id;

$stmt = $conn->prepare("INSERT INTO DateEvento(IDEvento, DataInizio, DataFine) VALUES(?,?,?)");
$stmt->bind_param("iss", $ID, $DataI, $DataF);
//$stmt->execute();

/*
for($x = 0; $x < $ric; $x++)
{
  $DataI = $DataInizio.$OraInizio;    //unisco gg-mm-aaaa con l'orario
  $DataF = $DataFine.$OraFine;    //unisco gg-mm-aaaa con l'orario
  $stmt->execute();
  $DataInizio = date('Y-m-d', strtotime($DataInizio."+ $Frequenza days"));    //incremento la data inizio di un numero di giorni pari a "frequenza"
  $DataFine = date('Y-m-d', strtotime($DataFine."+ $Frequenza days"));    //incremento la data fine di un numero di giorni pari a "frequenza"
}
*/

if($stmt->execute() && $stmt1->execute())
  $data = (object) ['success' => true];
else
  $data = (object) ['error' => 'Si è verificato un errore :('];


echo json_encode($data);
?>
