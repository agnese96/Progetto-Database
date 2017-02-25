<?php
  require "connection.php";
  $IDUtente = require "lib/decodeToken.php";

  $sql = "SELECT CONCAT_WS(' ', Cognome, Nome) AS Nominativo, FotoProfilo, Email
          FROM Utenti u JOIN Contatti c ON u.Email = c.Email2
          WHERE c.Email1 = '$IDUtente'
          ORDER BY Nominativo";

  if(! $result = $conn->query($sql)) {
    echo json_encode($data = ['erorr' => $conn->error]);
    exit();
  }

  if($result->num_rows > 0) {
    $rows = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($rows);
  }
  else {
    echo json_encode($data = ['error' => 'Nessun contatto trovato']);
    exit();
  }

  $conn->close();
 ?>
