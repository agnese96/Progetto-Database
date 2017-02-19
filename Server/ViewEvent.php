<?php
require "connection.php";
require "lib/JWT.php";
$DataEvento = $conn->real_escape_string($_POST["DataEvento"]);
$IDEvento = $conn->real_escape_string($_POST["IDEvento"]);
$token = $_POST['token'];

if(! $token=JWT::decode($token, 'secret_server_key'))
  echo json_encode(['error' => 'Devi fare il login']);
$IDCreatore = $token->email;

$sql = "SELECT Titolo, Descrizione, IFNULL(Ricorrenza,0), IFNULL(Frequenza,0), IFNULL(Promemoria,0)
        FROM Eventi, DateEventi
        WHERE IDCreatore=$IDCreatore AND DataEvento=$DataEvento AND IDEvento=$IDEvento";
$result = $conn->query($sql);

if($result->num_rows > 0) {
  $row = $result->fetch_assoc();
  echo json_encode($row);
}
else {
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}


$conn->close();
?>
