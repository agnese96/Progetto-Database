<?php
  require 'connection.php';

  $IDUtente = require 'lib/decodeToken.php';
  $IDEvento = $conn->real_escape_string($_POST['IDEvento']);
  $IDInvitato = $conn->real_escape_string($_POST['IDInvitato']);
  $DataInizio = $conn->real_escape_string($_POST['DataEvento']);
  if(! checkOwner($IDUtente, $IDEvento, $conn)) {
    echo json_encode($data = ['error' => $conn->error]);
    exit();
  }

  $sql = "DELETE FROM Invitare WHERE Email='$IDInvitato' AND IDEvento=$IDEvento AND DataInizio='$DataInizio' ";

  if(! $result = $conn->query($sql)) {
    echo json_encode($data = ['error' => $conn->error]);
    exit();
  }

  echo json_encode($data = ['success' => true]);
  $conn->close();
?>
