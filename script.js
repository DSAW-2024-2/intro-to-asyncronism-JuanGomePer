function buscarPokemon() {
    let nombrePokemon = document.getElementById("pokemonInput").value.trim().toLowerCase();
    let urlApi = `https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`;

    fetch(urlApi)
    .then(response => response.json())
    .then(datosPokemon => mostrarPokemon(datosPokemon))
    .catch(() => mostrarError());
}

function mostrarPokemon(datosPokemon) {
    let infoDiv = document.getElementById("pokemonInfo");
    let tiposHTML = '';
    datosPokemon.types.forEach((item) => {
        tiposHTML += `<p class="tipo">${item.type.name}</p>`;
    });
    infoDiv.innerHTML = `
        <h2 class="nombre">${datosPokemon.name.toUpperCase()}</h2>
        <img class="foto" src="${datosPokemon.sprites.front_default}">   
        <div class="estadisticas">
            <p class="hp">Hp: ${datosPokemon.stats[0].base_stat}</p> 
            <p class="ataque">Attack: ${datosPokemon.stats[1].base_stat}</p> 
            <p class="defensa">Defense: ${datosPokemon.stats[2].base_stat}</p> 
            <p class="es-ataque">Special-Attack: ${datosPokemon.stats[3].base_stat}</p> 
            <p class="es-defensa">Special-Defense: ${datosPokemon.stats[4].base_stat}</p> 
            <p class="velocidad">Speed: ${datosPokemon.stats[5].base_stat}</p>
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
    document.getElementById("pokemonInput").value = "25";
    buscarPokemon();
};
