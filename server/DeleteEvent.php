<?php
require "connection.php";
$IDUtente = require 'lib/decodeToken.php';
$IDEvento = $_POST["IDEvento"];
$DataInizio = $conn->real_escape_string($_POST["DataID"]);

if(! checkOwner($IDUtente, $IDEvento, $conn)) {
  echo json_encode($data=['error' => 'NOT_AUTHORIZED']);
  exit();
}

$sql = "SELECT Email FROM Invitare WHERE IDEvento = $IDEvento";
if(! $result = $conn->query($sql)) {
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}
//Se è un evento condiviso mando ai partecipanti la notifica che l'evento è stato eliminato.
if($result->num_rows){
  $rows = $result->fetch_all(MYSQLI_ASSOC);
  if($res= $conn->query("SELECT Titolo FROM Eventi WHERE IDEvento = $IDEvento")){
      $row = $res->fetch_assoc();
      $Titolo = $row['Titolo'];
  }else {
    echo json_encode($data = ['error' => $conn->error]);
    exit();
  }
  $Data = (new DateTime())->format('Y-m-d');
  $Ora = (new DateTime())->format('H:i:s');
  $sql= "INSERT INTO NotificheEvento (Tipo, Data, Ora, TitoloEvento, IDEvento, DataInizio) VALUES ('D', $Data, $Ora, $Titolo, $IDEvento, $DataInizio )";
  if(! $conn->query($sql)){
    echo json_encode($data = ['error' => $conn->error]);
    exit();
  }
  $IDNotifica = $conn->insert_id;
  $sql= "INSERT INTO Ricevere( Email, IDNotifica ) VALUES (?, $IDNotifica)";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param('s',$email);
  for ($i=0; $i < count($rows); $i++) {
    $email=$rows[$i]['Email'];
    if(! $stmt->execute()){
      echo json_encode($data = ['error' => $conn->error]);
      exit();
    }
  }
}
$sql = "DELETE FROM Eventi WHERE IDEvento = $IDEvento";

if(! $result = $conn->query($sql)) {
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}

$conn->close();
echo json_encode($data = ['success' => true]);
 ?>
