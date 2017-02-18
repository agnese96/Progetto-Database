<?php
require "connection.php";
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

//TODO: Controllo corretto per ricorrenze

$stmt1 = $conn->prepare("INSERT INTO Eventi(Titolo, Descrizione, Ricorrenza, Frequenza, Promemoria, NomeCategoria) VALUES(?,?,?,?,?,?)");
$stmt1->bind_param("ssiiis", $Titolo,$Descrizione,$Ricorrenza,$Frequenza,$Promemoria,$NomeCategoria);
if($stmt1->execute()){
  echo json_encode($data = ['error' => "Impossibile creare l'evento!"]);
  exit();
}

$ID = $conn->insert_id;//prendo l'id dell'ultimo evento inserito.

$stmt = $conn->prepare("INSERT INTO DateEvento(IDEvento, DataInizio, DataFine) VALUES(?,?,?)");
$stmt->bind_param("iss", $ID, $DataI, $DataF);

$data = ['IDEvento' => $ID ];

//TODO: Fare in modo che funzioni per gli eventi ricorrenti correttamente
for($x = 0; $x < $Ricorrenza; $x++)
{
  $DataI = $DataInizio.$OraInizio;    //unisco gg-mm-aaaa con l'orario
  $DataF = $DataFine.$OraFine;    //unisco gg-mm-aaaa con l'orario
  //TODO: Se c'è un problema nell'inserimento di uno degli eventi ricorrenti eliminare tutto ciò che è stato fatto finora
  if($stmt->execute()){
    echo json_encode($data = ['error' => "Impossibile creare l'evento!"]);
    exit();
  }
  $DataInizio = date('Y-m-d', strtotime($DataInizio."+ $Frequenza days"));    //incremento la data inizio di un numero di giorni pari a "frequenza"
  $DataFine = date('Y-m-d', strtotime($DataFine."+ $Frequenza days"));    //incremento la data fine di un numero di giorni pari a "frequenza"
}

$conn->close();
echo json_encode($data);
?>
