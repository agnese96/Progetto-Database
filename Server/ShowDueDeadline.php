<?php
  require "connection.php";
  $IDUtente = require 'lib/decodeToken.php';

//  $DataRecente = ('Y-m-d', strtotime($Data. ' - 7 days'));
//  $DataCorrente = curdate();

  $sql = "SELECT IDScadenza, Descrizione, Data, Priorità as Priority
          FROM Scadenze
          WHERE IDCreatore='$IDUtente' AND (DATEDIFF(Data,CURDATE()) < 7 OR DATEDIFF(DATE_SUB(Data, INTERVAL Promemoria DAY),CURDATE()) < 7)
          ORDER BY Data, Priorità";

  if(! $result = $conn->query($sql)){
    echo json_encode($data = ['error' => $conn->error]);
    exit();
  }

  if($result->num_rows > 0) {
    $rows = $result->fetch_all(MYSQLI_ASSOC);
    //$rows['owner']=checkOwner($IDUtente, $IDScadenza, $conn);
    echo json_encode($rows);
  }
  else {
    echo json_encode($data = ['error' => 'Nessuna scadenza trovata']);
    exit();
  }

  $conn->close();
 ?>
