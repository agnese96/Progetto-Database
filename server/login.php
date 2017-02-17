<?php

  require './lib/JWT.php';

  $username = $_POST['username'];
  $password = $_POST['password'];

/*  if(strlen ($username) == 0) || strlen($password) == 0) {
    header("Location: loginView.html");
    exit;
  }*/

  $connessione=mysql_connect("localhost", "root", "");
	if(mysql_select_db(Agenda))
	{
		$sql="SELECT * FROM Utenti WHERE email='$username' AND password='$password';";
		$ris1 = mysql_query($sql);
		$ris = mysql_fetch_array($ris1);
		if($ris){
			//$_SESSION['un'] = $username;
			header("Location: home.php");
			exit;
		} else
			echo "Nome utente o password errati. Riprova!";
	}
	else mysql_error ();
	mysql_close($connessione);

  $token = array();
  $token['id'] = "agnese@mail.it";
  echo JWT::encode($token, 'secret_server_key');

 ?>
