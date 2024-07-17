<?php
session_start();
include("conexion.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $correo = $_POST['email'];
    $pass = $_POST['password'];

    if (!empty($correo) && !empty($pass)) {
        $conn = new mysqli($servidor, $usuario, $password, $bdd);
        if ($conn->connect_error) {
            die("La conexion ha fallado: " . $conn->connect_error);
        }

        // Consulta preparada para evitar inyecciones SQL
        $stmt = $conn->prepare("SELECT password FROM registrou WHERE correo = ?");
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            // Verifica la contraseña usando password_verify
            if (password_verify($pass, $row['password'])) {
                $_SESSION['correo'] = $correo;
                header("location: principal.html");
                exit(); // Asegura que no se ejecuten mas líneas despues del redireccionamiento
            } else {
                header("location: index.html?error=1"); // Contraseña incorrecta
                exit();
            }
        } else {
            header("location: index.html?error=1"); // Correo no encontrado
            exit();
        }

        $stmt->close();
        $conn->close();
    } else {
        header("location: index.html?error=2"); // Campos vacíos
        exit();
    }
} else {
    header("location: index.html");
    exit();
}
?>

