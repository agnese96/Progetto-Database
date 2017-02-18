<?php

  require './lib/JWT.php';
  require 'connection.php';
  $email = $conn->real_escape_string($_POST['email']);
  $password = $_POST['password'];

/*  if(strlen ($email) == 0) || strlen($password) == 0) {
    header("Location: loginView.html");
    exit;
  }*/

	$sql="SELECT FotoProfilo, Password FROM Utenti WHERE email='$email';";
  $ris = $conn->query($sql);
	if($ris->num_rows == 1){
    $row = $ris->fetch_assoc();//come fetch array
    if(password_verify($password, $row['Password'])) {
      $data = array();
      $data['email'] = $email;
      $token = JWT::encode($data, 'secret_server_key');
      $data = (object) ['token' => $token, 'email' => $email, 'photo' => $row['FotoProfilo']];
      echo json_encode($data);
      exit;
    } else
    $error = "Password errata!";
	} else
	 $error = "Questa email non risulta registrata. Registrati ora!";

  $conn->close();
  $data = (object) ['error' => $error];
  echo json_encode($data);
 ?>