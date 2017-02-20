<?php
require 'JWT.php';
$token = $_POST['token'];

if(! $token=JWT::decode($token, 'secret_server_key'))
  echo json_encode(['error' => 'Devi fare il login']);
return $IDUtente = $token->email;
 ?>
