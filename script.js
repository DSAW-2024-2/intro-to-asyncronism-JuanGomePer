let evolveData = {}; 
let nextEvolution = null; 
let evolutionHistory = []; 

function searchPokemon() {
    let pokemonName = document.getElementById("pokemonInput").value.trim().toLowerCase();
    let apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

    fetch(apiUrl)
    .then(response => response.json())
    .then(pokemonData => {
        document.querySelector(".toggle").checked = false;
        displayPokemon(pokemonData);
        getEvolutionChain(pokemonData.species.url);
        evolutionHistory = []; 
    })
    .catch(() => showError());
}

function random() {
    let randomNumber = Math.floor(Math.random() * 1025) + 1;
    let apiUrl = `https://pokeapi.co/api/v2/pokemon/${randomNumber}`;

    fetch(apiUrl)
    .then(response => response.json())
    .then(pokemonData => {
        document.querySelector(".toggle").checked = false;
        displayPokemon(pokemonData);
        getEvolutionChain(pokemonData.species.url);
        evolutionHistory = []; 
    })
    .catch(() => showError());
}

function displayPokemon(pokemonData) {
    let infoDiv = document.getElementById("pokemonInfo");
    let typesHTML = '';
    
    pokemonData.types.forEach((item) => {
        let typeColor = getComputedStyle(document.documentElement).getPropertyValue(`--color-${item.type.name}`);
        typesHTML += `<p style="background-color: ${typeColor.trim()}; padding: 5px 10px; border-radius: 5px; color: white; margin-top: 2px;">${item.type.name}</p>`;
    });

    document.querySelector(".toggle").addEventListener("change", function() {
        let pokemonImage = document.getElementById("pokemonImage");
        if (this.checked) {
            pokemonImage.src = pokemonData.sprites.front_shiny;
        } else {
            pokemonImage.src = pokemonData.sprites.front_default;
        }
    });

    infoDiv.innerHTML = `
        <div class="pokemon-header">
        <h2 class="name">${pokemonData.name.toUpperCase()} #${pokemonData.id}</h2>
        <img class="photo" id="pokemonImage" src="${pokemonData.sprites.front_default}">
        </div>
        <div class="stats">
            <p class="hp"><strong>Hp:</strong> ${pokemonData.stats[0].base_stat}</p> 
            <p class="attack"><strong>Attack:</strong> ${pokemonData.stats[1].base_stat}</p> 
            <p class="defense"><strong>Defense:</strong> ${pokemonData.stats[2].base_stat}</p> 
            <p class="sp-attack"><strong>Special-Attack:</strong> ${pokemonData.stats[3].base_stat}</p> 
            <p class="sp-defense"><strong>Special-Defense:</strong> ${pokemonData.stats[4].base_stat}</p> 
            <p class="speed"><strong>Speed:</strong> ${pokemonData.stats[5].base_stat}</p>
            ${typesHTML}
        </div>
    `;

    updateButtons();
}

function getEvolutionChain(url) {
    fetch(url)
    .then(response => response.json())
    .then(pokemonSpeciesData => {
        let evolutionChainUrl = pokemonSpeciesData.evolution_chain.url;
        return fetch(evolutionChainUrl);
    })
    .then(response => response.json())
    .then(evolutionChainData => {
        evolveData = evolutionChainData.chain;
        nextEvolution = evolveData; 
        updateButtons();
    })
    .catch(() => console.error("Error fetching evolution chain"));
}

document.getElementById("evolutionButton").addEventListener("click", function() {
    if (nextEvolution) {
        evolvePokemon(nextEvolution);
    }
});

function evolvePokemon(chain) {
    document.querySelector(".toggle").checked = false;
    if (chain.evolves_to.length > 0) {
        let nextPokemon = chain.evolves_to[0].species.name;
        let apiUrl = `https://pokeapi.co/api/v2/pokemon/${nextPokemon}`;

        fetch(apiUrl)
        .then(response => response.json())
        .then(pokemonData => {
            evolutionHistory.push(chain);
            displayPokemon(pokemonData);
            nextEvolution = chain.evolves_to[0];
            updateButtons();
        })
        .catch(() => showError());
    }
}

document.getElementById("involutionButton").addEventListener("click", function() {
    document.querySelector(".toggle").checked = false;
    if (evolutionHistory.length > 0) {
        let lastEvolution = evolutionHistory.pop();
        let apiUrl = `https://pokeapi.co/api/v2/pokemon/${lastEvolution.species.name}`;

        fetch(apiUrl)
        .then(response => response.json())
        .then(pokemonData => {
            displayPokemon(pokemonData);
            nextEvolution = lastEvolution;
            updateButtons();
        })
        .catch(() => showError());
    }
});

function updateButtons() {
    const evolutionButton = document.getElementById("evolutionButton");
    const involutionButton = document.getElementById("involutionButton");

    if (nextEvolution && nextEvolution.evolves_to.length > 0) {
        evolutionButton.disabled = false;
    } else {
        evolutionButton.disabled = true;
    }

    if (evolutionHistory.length > 0) {
        involutionButton.disabled = false;
    } else {
        involutionButton.disabled = true;
    }
}

function showError() {
    let infoDiv = document.getElementById("pokemonInfo");
    infoDiv.innerHTML = `
        <p class="error">Pokemon not found. <br> Try another name or number.</p> 
    `;
}

window.onload = function() {
    random();

    document.getElementById("pokemonInput").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            searchPokemon();
        }
    });
};
