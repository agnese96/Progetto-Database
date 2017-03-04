<?php
require "connection.php";
$IDUtente = require 'lib/decodeToken.php';
$Nome = $conn->real_escape_string($_POST['Nome']);
$Cognome = $conn->real_escape_string($_POST['Cognome']);
$DataNascita = $conn->real_escape_string($_POST['DataNascita']);
$Città = $conn->real_escape_string($_POST['City']);
$Professione = $conn->real_escape_string($_POST['Professione']);

$sql = "UPDATE Utenti
        SET Nome='$Nome', Cognome='$Cognome', DataNascita='$DataNascita', Città='$Città', Professione='$Professione'
        WHERE Email = '$IDUtente'";

if(! $result = $conn->query($sql)) {
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}

echo json_encode($data = ['success' => true]);
$conn->close();
 ?>
