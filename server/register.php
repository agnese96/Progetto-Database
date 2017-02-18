<?php
require "connection.php";
$cognome = $_POST["cognome"];
$nome = $_POST["nome"];
$email = $_POST["email"];
$password = password_hash( $_POST["password"], PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO Utenti(nome, cognome, email, password) VALUES (?,?,?,?)");
$stmt->bind_param("ssss", $nome, $cognome, $email, $password);

if($stmt->execute()) {
  $data = (object) ['success' => true];
}
else $data = (object) ['error' => 'Non so cosa sia successo :D'];
echo json_encode($data);
?>
