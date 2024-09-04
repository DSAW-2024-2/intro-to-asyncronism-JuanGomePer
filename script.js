function buscarPokemon() {
    let nombrePokemon = document.getElementById("pokemonInput").value.trim().toLowerCase();
    let urlApi = `https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`;

    fetch(urlApi)
    .then(response => response.json())
    .then(datosPokemon => {
        document.querySelector(".toggle").checked = false;
        mostrarPokemon(datosPokemon);
    })
    .catch(() => mostrarError());
}

function aleatorio() {
    let numeroAleatorio = Math.floor(Math.random() * 1025) + 1;
    let urlApi = `https://pokeapi.co/api/v2/pokemon/${numeroAleatorio}`;

    fetch(urlApi)
    .then(response => response.json())
    .then(datosPokemon => {
        document.querySelector(".toggle").checked = false;
        mostrarPokemon(datosPokemon);
    })
    .catch(() => mostrarError());
}

function mostrarPokemon(datosPokemon) {
    let infoDiv = document.getElementById("pokemonInfo");
    let tiposHTML = '';
    
    datosPokemon.types.forEach((item) => {
        let colorTipo = getComputedStyle(document.documentElement).getPropertyValue(`--color-${item.type.name}`);
        tiposHTML += `<p style="background-color: ${colorTipo.trim()}; padding: 5px 10px; border-radius: 5px; color: white; margin-top: 2px;">${item.type.name}</p>`;
    });

    document.querySelector(".toggle").addEventListener("change", function() {
        let pokemonImage = document.getElementById("pokemonImage");
        if (this.checked) {
            pokemonImage.src = datosPokemon.sprites.front_shiny;
        } else {
            pokemonImage.src = datosPokemon.sprites.front_default;
        }
    });

    infoDiv.innerHTML = `
        <div class="encabezado-pokemon">
        <h2 class="nombre">${datosPokemon.name.toUpperCase()} #${datosPokemon.id}</h2>
        <img class="foto" id="pokemonImage" src="${datosPokemon.sprites.front_default}">
        </div>
        <div class="estadisticas">
            <p class="hp"><strong>Hp:</strong> ${datosPokemon.stats[0].base_stat}</p> 
            <p class="ataque"><strong>Attack:</strong> ${datosPokemon.stats[1].base_stat}</p> 
            <p class="defensa"><strong>Defense:</strong> ${datosPokemon.stats[2].base_stat}</p> 
            <p class="es-ataque"><strong>Special-Attack:</strong> ${datosPokemon.stats[3].base_stat}</p> 
            <p class="es-defensa"><strong>Special-Defense:</strong> ${datosPokemon.stats[4].base_stat}</p> 
            <p class="velocidad"><strong>Speed:</strong> ${datosPokemon.stats[5].base_stat}</p>
            ${tiposHTML}
        </div>
    `;
}


function mostrarError() {
    let infoDiv = document.getElementById("pokemonInfo");
    infoDiv.innerHTML = `
        <p class="error">Pokemon no encontrado. <br> Intente con otro nombre o número.</p> 
    `;
}

window.onload = function() {
    aleatorio();

    document.getElementById("pokemonInput").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            buscarPokemon();
        }
    });
};