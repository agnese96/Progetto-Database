<? php
  require 'connection.php';
  $IDUtente = require 'lib/decodeToken.php';
  $VistaCalendario = $conn->real_escape_string($_POST['VistaCalendario']);
  $OrarioInizioGiorno = $conn->real_escape_string($_POST['OrarioInizioGiorno']);

  $sql = "UPDATE Utenti
          SET VistaCalendario='$VistaCalendario', OrarioInizioGiorno='$OrarioInizioGiorno'
          WHERE Email = '$IDUtente'";

  if(! $result = $conn->query($sql)) {
    echo json_encode($data = ['error' => $conn->error]);
    exit();
  }

  echo json_encode($data = ['success' => true]);
  $conn->close();
 ?>
