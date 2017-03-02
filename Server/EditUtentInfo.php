<?php
require "connection.php";
$IDUtente = require 'lib/decodeToken.php';
$FotoProfilo = $conn->real_escape_string($_POST['FotoProfilo']);
$Nome = $conn->real_escape_string($_POST['Nome']);
$Cognome = $conn->real_escape_string($_POST['Cognome']);
$DataNascita = $conn->real_escape_string($_POST['DataNascita']);
$Città = $conn->real_escape_string($_POST['City']);
$Professione = $conn->real_escape_string($_POST['Professione']);
$Preferenze = $conn->real_escape_string($_POST['Preferenze']);

if(isset($FotoProfilo)) {
  $sql = "UPDATE Utenti
          SET FotoProfilo='$FotoProfilo', Nome='$Nome', Cognome='$Cognome', DataNascita='$DataNascita', Città='$Città', Professione='$Professione', Preferenza='$Preferenza'
          WHERE Email = '$IDUtente'";
}
else {
  $sql = "UPDATE Utenti
          SET Nome='$Nome', Cognome='$Cognome', DataNascita='$DataNascita', Città='$Città', Professione='$Professione', Preferenza='$Preferenza'
          WHERE Email = '$IDUtente'";
}

if(! $result = $conn->query($sql)) {
  echo json_encode($data = ['error' => $conn->error]);
  exit();
}

echo json_encode($data = ['success' => ture]);
$conn->close();
 ?>
