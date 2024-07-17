<?php
$nombre = $_POST['nombre'];
$correo = $_POST['correo'];
$pass = $_POST['pass'];

include("conexion.php");

$conn = new mysqli($servidor, $usuario, $password, $bdd);
if ($conn->connect_error) {
    die("La conexion ha fallado: " . $conn->connect_error);
}

// Verificar si el correo ya existe
$sql_check = "SELECT correo FROM registrou WHERE correo = '$correo'";
$result = $conn->query($sql_check);

if ($result->num_rows > 0) {
    // Si el correo ya existe, mostrar un mensaje de error
    echo "Error: El correo electronico ya esta registrado.";
} else {
    // Si el correo no existe, insertar el nuevo registro
    $hashed_pass = password_hash($pass, PASSWORD_DEFAULT);
    $sql = "INSERT INTO registrou (nombre, correo, password) VALUES ('$nombre', '$correo', '$hashed_pass')";

    if ($conn->query($sql) === TRUE) {
        header("location: index.html");
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
