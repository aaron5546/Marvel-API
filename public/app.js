// Función para verificar el estado de inicio de sesión
function checkLoginState() {
  FB.getLoginStatus(function (response) {
    statusChangeCallback(response);
  });
}

// Función de callback para manejar la respuesta de inicio de sesión
function statusChangeCallback(response) {
  if (response.status === "connected") {
    // Usuario está conectado y autorizado
    console.log("Usuario conectado y autorizado");
    const accessToken = response.authResponse.accessToken;

    // Ejemplo de petición POST con fetch a tu servidor backend
    fetch("http://pruebadentapp.000webhostapp.com/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Respuesta del servidor:", data);
      })
      .catch((error) => {
        console.error("Error al enviar el accessToken al servidor:", error);
      });
  } else {
    // Usuario no está conectado a la aplicación o no ha autorizado
    console.log("Usuario no conectado o no autorizado");
  }
}

// Inicializa el SDK de Facebook
window.fbAsyncInit = function () {
  FB.init({
    appId: "431397039697442",
    cookie: true,
    xfbml: true,
    version: "v11.0",
  });

  FB.AppEvents.logPageView();
};

// Carga asíncrona del SDK de Facebook
(function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");

// Función para compartir en Facebook
function shareOnFacebook(url) {
  FB.ui(
    {
      method: "share",
      href: url,
    },
    function (response) {
      // Puedes manejar la respuesta aquí si lo necesitas
      console.log("Respuesta de compartir en Facebook:", response);
    }
  );
}

// Función para guardar el cómic en favoritos
function saveComic(comicId, comicTitle, comicUrl) {
  if (!comicId || !comicTitle || !comicUrl) {
    console.error("Datos del cómic inválidos", {
      comicId,
      comicTitle,
      comicUrl,
    });
    return;
  }

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const comic = { id: comicId, title: comicTitle, url: comicUrl };
  if (!favorites.some((fav) => fav.id === comicId)) {
    favorites.push(comic);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Comic guardado en favoritos");
    updateFavoritesList();
  } else {
    alert("El comic ya está en favoritos");
  }
}

// Función para eliminar un cómic de favoritos
function removeFavorite(comicId) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter((fav) => fav.id !== comicId);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoritesList();
}

// Función para actualizar la lista de favoritos
function updateFavoritesList() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const favoritesList = document.getElementById("favoritesList");
  favoritesList.innerHTML = "";

  if (favorites.length === 0) {
    favoritesList.innerHTML =
      '<a class="dropdown-item" href="#">No hay favoritos</a>';
  } else {
    favorites.forEach((favorite) => {
      if (!favorite.id || !favorite.title || !favorite.url) {
        return; // Saltar cualquier favorito inválido
      }

      const favoriteItem = document.createElement("div");
      favoriteItem.className = "dropdown-item favorite-item";
      favoriteItem.innerHTML = `
        <a href="${favorite.url}" target="_blank">${favorite.title}</a>
        <button class="btn btn-danger btn-sm" onclick="removeFavorite('${favorite.id}')">&times;</button>
      `;
      favoritesList.appendChild(favoriteItem);
    });
  }
}

const renderComics = async () => {
  const publicKey = "09036dcbacf95e6abf25dde767f612b8";
  const url = `https://gateway.marvel.com:443/v1/public/comics?apikey=${publicKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("La respuesta de la red no fue correcta");
    }
    const data = await response.json();
    const comics = data.data.results;

    const container = document.querySelector("#marvel-row");
    let html = "";

    comics.forEach((comic) => {
      if (!comic.id || !comic.title || !comic.urls || comic.urls.length === 0) {
        console.error("Datos del cómic inválidos", comic);
        return;
      }

      html += `
        <div class="col-md-4 mb-4">
          <div class="card position-relative">
            <img src="${comic.thumbnail.path}.${
        comic.thumbnail.extension
      }" class="card-img-top" alt="${comic.title}">
            <div class="card-body">
              <h5 class="card-title">${comic.title}</h5>
              <p class="card-text">${
                comic.description || "Descripción no disponible"
              }</p>
              <a href="${
                comic.urls[0].url
              }" class="btn btn-primary" target="_blank">Ver comic</a>
              <button class="btn btn-outline-primary btn-save mt-2" onclick="saveComic('${
                comic.id
              }', '${comic.title}', '${comic.urls[0].url}')">Guardar</button>
              <div class="dropdown card-options">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="optionsDropdown${
                  comic.id
                }" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  &#x2022;&#x2022;&#x2022;
                </button>
                <div class="dropdown-menu" aria-labelledby="optionsDropdown${
                  comic.id
                }">
                  <a class="dropdown-item" href="#" onclick="shareOnFacebook('${
                    comic.urls[0].url
                  }')">Compartir en Facebook</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
};

// Llama a la función para renderizar los cómics
renderComics();
// Actualiza la lista de favoritos al cargar la página
updateFavoritesList();
