<?php
require "connection.php";
$IDUtente = require 'lib/decodeToken.php';
$target_dir='/Applications/XAMPP/xamppfiles/htdocs/';
$output_dir='Progetto-Database/Assets/Img/';
$file_name=basename($_FILES['fileToUpload']['name']);
$target_file = $target_dir.$output_dir.$file_name;
$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
// Check if image file is a actual image or fake image
$check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
if($check == false) {
   echo json_encode($data=['error'=>'Il file non è un immagine']);
   exit();
}
if (!move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
    echo json_encode($data=['error'=>"Impossibile caricare l'immagine"]);
    exit();
}
$output_dir="http://localhost/$output_dir/$file_name";

$sql="UPDATE Utenti SET FotoProfilo='$output_dir'
      WHERE Email='$IDUtente'";
if(! $conn->query($sql)) {
  echo json_encode($data=['error'=>$conn->error]);
  exit();
}
echo json_encode($data=['photo'=>$output_dir]);
$conn->close();
 ?>
