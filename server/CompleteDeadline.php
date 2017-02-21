<?php
  require 'connection.php';
  $IDUtente= require 'lib/decodeToken.php';
  $IDScadenza=$conn->real_escape_string($_POST['IDScadenza']);

  if(! checkOwnerDeadline($IDUtente, $IDScadenza, $conn)) {
    echo json_encode($data=['error' => 'NOT_AUTHORIZED']);
    exit();
  }

  $sql="SELECT Ricorrenza, Data, Frequenza
        FROM Scadenze
        WHERE IDScadenza=$IDScadenza AND (Ricorrenza > 0 OR Ricorrenza=-1)";
  if(! $result=$conn->query($sql)) {
    echo json_encode($data=['error' => $conn->error]);
    exit();
  }
  if($result->num_rows) {
    $row=$result->fetch_assoc();
    $newData=(new DateTime($row['Data']))->add(new DateInterval('P'.$row['Frequenza'].'D'))->format('Y-m-d');
    $Ricorrenza=$row['Ricorrenza'];
    if($Ricorrenza!=-1)
      $Ricorrenza--;
    $sql="UPDATE Scadenze SET Data='$newData', Ricorrenza=$Ricorrenza WHERE IDScadenza=$IDScadenza";
    if(! $result=$conn->query($sql)) {
      echo json_encode($data=['error' => $conn->error]);
      exit();
    }
    $data=['successUpdate' => true];
  }else{
    $sql="DELETE FROM Scadenze WHERE IDScadenza=$IDScadenza";
    if(! $result=$conn->query($sql)) {
      echo json_encode($data=['error' => $conn->error]);
      exit();
    }
    $data=['successDelete' => true];
  }
  $conn->close();
  echo json_encode($data);

 ?>
