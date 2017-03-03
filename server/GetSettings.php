<?php
require "connection.php";
$IDUtente = require 'lib/decodeToken.php';

  $sql="SELECT Nome, Cognome, DataNascita, Città as City, Professione, VistaCalendario, OraInizioGiorno
        FROM  Utenti
        WHERE Email='$IDUtente'";
  if(!$result=$conn->query($sql)) {
    echo json_encode($data=['error'=>$conn->error]);
    exit();
  }
  if($result->num_rows==1) {
    $data=$result->fetch_assoc();
  }else{
    $data=['error'=>"Impossibile acquisire le impostazioni"];
  }
  echo json_encode($data);
  $conn->close();
 ?>
