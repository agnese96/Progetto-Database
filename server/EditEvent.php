<?php
  require 'connection.php';
  function checkOwner($IDUtente, $IDEvento, $conn) {
    $sql="SELECT Titolo
          FROM Eventi
          WHERE IDEvento = $IDEvento AND IDCreatore = '$IDUtente'";
    if($result = $conn->query($sql)){
      if($result->num_rows==1)
        return true;
    }
    return false;
  }

  $IDUtente= require 'lib/decodeToken.php';
  $IDEvento = $conn->real_escape_string($_POST['IDEvento']);
  if(! checkOwner($IDUtente, $IDEvento, $conn)){
    echo json_encode(['error1' => $conn->error]);
    exit();
  }

  $editedEvent=$_POST['editedEvent'];
  $editedDate=$_POST['editedDate'];

  if(count($editedEvent)) {
    $sql="UPDATE Eventi SET ";
    for($i=0; $i<count($editedEvent); $i++) {
      if($i!=0)
        $sql.=', ';
      $sql.=$editedEvent[$i]." = ".$_POST[ $editedEvent[$i] ];
    }
    $sql.="WHERE IDEvento=$IDEvento ";
    if(! $resul = $conn->execute($sql)) {
      echo json_encode(['error2' => $conn->error]);
      exit();
    }
  }

  if(count($editedDate)) {
    $DataID = $conn->real_escape_string($_POST['DataID']);
    $sql="UPDATE DateEvento SET ";
    for($i=0; $i<count($editedEvent); $i++) {
      if($i!=0)
        $sql.=', ';
      $sql.=$editedEvent[$i]." = ".$_POST[$editedEvent[$i]];
    }
    $sql.="WHERE IDEvento=$IDEvento AND DataInizio=$DataID";
    if(! $resul = $conn->execute($sql)) {
      echo json_encode(['error3' => $conn->error]);
      exit();
    }
  }
    echo json_encode(['success' => true]);
 ?>
