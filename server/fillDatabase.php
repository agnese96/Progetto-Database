<?php
//$lastUser= isset($_GET['user']) ? $_GET['user'] : 0;
ini_set('max_execution_time', 240);

$lastUser=0;
$Users = [];
$Events= [];
$Deadlines=[];
$NomeCategoria=['Interessi','Lavoro','Personale','Sport','Studio'];
$lastEvent=0;
$lastDeadline=0;
for ($i=$lastUser; $i < 15; $i++) {
  $Users[$i] = ['cognome' => "Cognome $i", 'nome' => "Nome $i", 'email' => "prova$i@mail.it", 'password' => "password$i"];
  $registerResponse=postRequest('register.php',$Users[$i]);
  checkResponse($registerResponse,"Creazione utente iterazione $i");
  //Fa il login e salva il token
  $loginResponse = postRequest('login.php',$Users[$i]);
  checkResponse($loginResponse,"Login utente iterazione $i");
  $Users[$i]['token']=$loginResponse->token;
  //Crea 5 eventi
  for ($j=$lastEvent; $j < $lastEvent+5; $j++) {
    $DataInizio = (new DateTime())->add(new DateInterval('P'.mt_rand(0,30).'D'))->format('Y-m-d');
    $DataFine = (DateTime::createFromFormat('Y-m-d',$DataInizio))->add(new DateInterval('P'.mt_rand(0,5).'D'))->format('Y-m-d');
    $OraInizio = (new DateTime())->add(new DateInterval('PT'.mt_rand(0,23).'H'))->format('H:i:s');
    $OraFine = (DateTime::createFromFormat('H:i:s',$OraInizio))->add(new DateInterval('PT'.mt_rand(1,12).'H'))->format('H:i:s');
    $Events[$j] = ['token'=> $Users[$i]['token'], 'Titolo'=>"Evento $j",
    'Descrizione'=>"Evento di prova generato automaticamente numero: $j",
    'Ricorrenza'=>$j%5, 'Frequenza'=>mt_rand(2,30), 'Promemoria'=>mt_rand(0,12),
    'DataInizio'=>$DataInizio, 'OraInizio'=>$OraInizio, 'DataFine'=>$DataFine,
    'OraFine'=>$OraFine, 'NomeCategoria'=>$NomeCategoria[$j%5], 'HasPartecipants'=>false];
    $createEventResponse = postRequest('CreateEvent.php', $Events[$j]);
    checkResponse($createEventResponse,"Creazione eventi iterazione $i:$j");
    $Events[$j]['IDEvento'] = $createEventResponse->IDEvento;
  }
  $lastEvent+=5;
  //Crea 5 scadenze
  for ($k=$lastDeadline; $k < $lastDeadline+5; $k++) {
    $Data = (new DateTime())->add(new DateInterval('P'.mt_rand(2,50).'D'))->format('Y-m-d');
    $Deadlines[$k] = ['token'=> $Users[$i]['token'],
    'Descrizione'=>"Scadenza di prova generata automaticamente numero: $k",
    'Ricorrenza'=>$k%5, 'Frequenza'=>mt_rand(0,30), 'Promemoria'=>mt_rand(0,7),
    'Priority'=>mt_rand(0,3), 'DataScadenza'=>$Data];
    $createDeadlineResponse = postRequest('CreateDeadline.php', $Deadlines[$k]);
    //checkResponse($createDeadlineResponse,"Creazione scadenze iterazione $i:$k");
    $Deadlines[$k]['IDScadenza'] = $createDeadlineResponse->IDScadenza;
  }
  $lastDeadline+=5;
}
for ($i=$lastUser; $i < 15; $i++) {
  $Users[$i]['Contacts']=[];
  for ($j=0; $j < 15; $j++) {
    $Users[$i]['Contacts'][$j]=$Users[($i+$j+1)%15]['email'];
    $data=['token'=>$Users[$i]['token'], 'IDContatto'=>$Users[$i]['Contacts'][$j]];
    $CreateContactResponse=postRequest('CreateContact.php',$data);
    checkResponse($CreateContactResponse, "Creazione contatti iterazione $i:$j");
  }
  for ($j=$lastEvent; $j < $lastEvent+5; $j++) {
    $DataInizio = (new DateTime())->add(new DateInterval('P'.mt_rand(0,30).'D'))->format('Y-m-d');
    $DataFine = (DateTime::createFromFormat('Y-m-d',$DataInizio))->add(new DateInterval('P'.mt_rand(0,5).'D'))->format('Y-m-d');
    $OraInizio = (new DateTime())->add(new DateInterval('PT'.mt_rand(0,24).'H'))->format('H:i:s');
    $OraFine = (DateTime::createFromFormat('H:i:s',$OraInizio))->add(new DateInterval('PT'.mt_rand(0,12).'H'))->format('H:i:s');
    //costruzione Partecipanti
    for ($k=0; $k < 5; $k++) {
      $Partecipanti[$k]=['Email'=>$Users[$i]['Contacts'][$k]];
    }
    $Events[$j] = ['token'=> $Users[$i]['token'], 'Titolo'=>"Evento $j",
    'Descrizione'=>"Evento di prova generato automaticamente numero: $j",
    'Ricorrenza'=>$j%5, 'Frequenza'=>mt_rand(2,30), 'Promemoria'=>mt_rand(0,12),
    'DataInizio'=>$DataInizio, 'OraInizio'=>$OraInizio, 'DataFine'=>$DataFine,
    'OraFine'=>$OraFine, 'NomeCategoria'=>$NomeCategoria[$j%5], 'HasPartecipants'=>true, 'Partecipanti'=>$Partecipanti];
    $createEventResponse = postRequest('CreateEvent.php', $Events[$j]);
    checkResponse($createEventResponse,"Creazione eventi condivisi iterazione $i:$j");
    $Events[$j]['IDEvento'] = $createEventResponse->IDEvento;
  }
  $lastEvent+=5;
}

function checkResponse($res, $position){
  if(!$res){
    echo "$position: $res";
  }
  else if(isset($res->error)){
    echo "$position: $res->error";
    exit();
  }
}
function postRequest($file, $data){
  $url = 'http://localhost/Progetto-Database/server/'.$file;
  $options = array(
        'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($data),
    )
  );

  $context  = stream_context_create($options);
  $result = file_get_contents($url, false, $context);
  $res = json_decode($result);
  return $res;
}
 ?>
