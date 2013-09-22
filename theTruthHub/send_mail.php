<?php

$to = "jaxzon5@gmail.com";
$subject = "The Truth Hub";


$name = $_REQUEST["name"];
$email = $_REQUEST["email"];
$message = $_REQUEST["message"];

$finalMessage = "You have received an email from " . $email . "\n\rThey said: " . $message;


mail($to, $subject, $message);


?>

<h1>Thanks <?php echo $name;?> I will be in touch with you shortly.</h1>
