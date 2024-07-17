<?php

$servidor = "localhost";
$usuario = "root";
$password = "1234567";
$bdd = "marvel";

$conn = new mysqli($servidor,$usuario,$password,$bdd);

if($conn -> connect_error) {
    die ("la conexi&oacute;n ha fallado: ". $conn -> connect_error);
}


$conn->close();
?>

