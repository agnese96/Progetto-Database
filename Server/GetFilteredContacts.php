<?php
  require "connection.php";
  $IDUtente = require "lib/decodeToken.php";
  $Key = $conn->real_escape_string($_POST["Key"]);

  $sql = "SELECT CONCAT_WS(' ', Cognome, Nome) AS Nominativo, FotoProfilo
          FROM Utenti u JOIN Contatti c ON u.Email = c.Email2
          WHERE c.Email1 = '$IDUtente' AND (Nome LIKE '%$Key%' OR Email LIKE '%$Key%' OR Cognome LIKE '%$Key%')
          ORDER BY Cognome, Nome";

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
