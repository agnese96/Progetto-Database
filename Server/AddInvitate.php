<?php
  require 'connection.php';

  $IDUtente = require 'lib/decodeToken.php';
  $IDEvento = $conn->real_escape_string($_POST['IDEvento']);
  $IDInvitato = $conn->real_escape_string($_POST['IDInvitato']);
  $DataEvento = $conn->real_escape_string($_POST['DataEvento']);
  if(! checkOwner($IDUtente, $IDEvento, $conn)) {
    echo json_encode($data = ['error' => $conn->error]);
    exit();
  }

  $sql = "INSERT INTO Invitare(Email, DataInizio, IDEvento, Partecipa) VALUES('$IDInvitato', '$DataEvento', $IDEvento, NULL)";

  if(! $result = $conn->query($sql)) {
    echo json_encode($data = ['error' => $conn->error]);
    exit();
  }

  echo json_encode($data = ['success' => true]);
  $conn->close();
?>
