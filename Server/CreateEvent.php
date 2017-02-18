<?php
require "connection.php"
$Titolo = $conn->real_escape_string($_POST["Titolo"]);
$Descrizione = $conn->real_escape_string($_POST["Descrizione"]);
$Ricorrenza = $conn->real_escape_string($_POST["Ricorrenza"]);
$Frequenza = $conn->real_escape_string($_POST["Frequenza"]);
$Promemoria = $conn->real_escape_string($_POST["Promemoria"]);
$DataInizio = $conn->real_escape_string($_POST["DataInizio"]);
$OraInizio = $conn->real_escape_string($_POST["OraInizio"]);
$DataInizio .= $OraInizio;
$DataFine = $conn->real_escape_string($_POST["DataFine"]);
$OraFine = $conn->real_escape_string($_POST["OraFine"]);
$DataFine .= $OraFine;

$stmt = $conn->prepare("INSERT INTO DateEvento(DataInizio, DataFine) VALUES(?,?)");
$stmt->bind_param("ss", $DataInizio, $DataFine);

$stmt1 = $conn->prepare("INSERT INTO Eventi(Titolo, Descrizione, Ricorrenza, Frequenza, Promemoria, NomeCategoria) VALUES(?,?,?,?,?,?)");
$stmt1->bind_param("ssiiis", $Titolo,$Descrizione,$Ricorrenza,$Frequenza,$Promemoria,$Promemoria);

if($stmt->execute() && $stmt1->execute()) {
  $data = (object) ['success' => true];
}
else $data = (object) ['error' => 'Si è verificato un errore :('];
echo json_encode($data);
?>
