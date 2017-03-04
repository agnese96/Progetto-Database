<?php
  require 'connection.php';
  $IDUtente = require 'lib/decodeToken.php';
  $VistaCalendario = $conn->real_escape_string($_POST['VistaCalendario']);
  $OraInizioGiorno = $conn->real_escape_string($_POST['OraInizioGiorno']);

  $sql = "UPDATE Utenti
          SET VistaCalendario='$VistaCalendario', OraInizioGiorno='$OraInizioGiorno'
          WHERE Email = '$IDUtente'";

  if(! $result = $conn->query($sql)) {
    echo json_encode($data = ['error' => $conn->error]);
    exit();
  }

  echo json_encode($data = ['success' => true]);
  $conn->close();
 ?>
