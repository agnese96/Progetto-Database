<?php

  require './lib/JWT.php';

  $token = array();
  $token['id'] = "agnese@mail.it";
  echo JWT::encode($token, 'secret_server_key');

  $token  = JWT::decode($_POST['token'], 'secret_server_key');
  echo $token->id;
 ?>
