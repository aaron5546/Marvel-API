const express = require("express");
const path = require("path");
const axios = require("axios");
const dotenv = require("dotenv");
const { URLSearchParams } = require("url");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para parsear body JSON
app.use(express.json());
// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, "public")));

// Ruta para iniciar sesión con Facebook
app.get("/auth/facebook", (req, res) => {
  const redirectUri = `${process.env.FACEBOOK_REDIRECT_URI}`;
  const appId = process.env.FACEBOOK_CLIENT_ID;
  const url = `https://www.facebook.com/v11.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=public_profile,email`;

  res.redirect(url);
});

// Ruta de callback de Facebook para manejar el token de acceso
app.get("/callback", async (req, res) => {
  const { code } = req.query;
  const accessToken = await getAccessToken(code);

  // Puedes guardar el accessToken en sesión o manejarlo como prefieras
  // Aquí solo se imprime para propósitos de demostración
  console.log("Access Token:", accessToken);

  res.send("Autenticación exitosa. Puedes cerrar esta ventana.");
});

// Función para obtener el token de acceso usando el código de autorización
async function getAccessToken(code) {
  try {
    const params = new URLSearchParams();
    params.append("client_id", process.env.FACEBOOK_CLIENT_ID);
    params.append("client_secret", process.env.FACEBOOK_CLIENT_SECRET);
    params.append("redirect_uri", process.env.FACEBOOK_REDIRECT_URI);
    params.append("code", code);

    const response = await axios.get(
      "https://graph.facebook.com/v11.0/oauth/access_token",
      {
        params,
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Error al obtener el token de acceso:", error);
    throw new Error("No se pudo obtener el token de acceso");
  }
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
