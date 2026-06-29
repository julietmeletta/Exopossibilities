let allPlanets = [];

async function getPlanets() {
  const response = await fetch("planets.json");
  allPlanets = await response.json();
  renderPlanets(allPlanets);
}

function renderPlanets(planetArray) {
  const container = document.getElementById("planet_list");
  container.innerHTML = "";

  for (const planet of planetArray) {
    const card = document.createElement("div");
    card.classList.add("planet_card");

    card.innerHTML = `
      <h3>${planet.pl_name}</h3>
      <p>Radius: ${planet.pl_rade}</p>
      <p>Mass: ${planet.pl_bmasse}</p>
      <p>Equilibrium Temperature: ${planet.pl_eqt}</p>
      <p>Distance from Earth: ${planet.sy_dist}</p>
    `;

    container.appendChild(card);
  }
}

function handleSearch() {
  const query = document.getElementById("search-input").value.toLowerCase();
  const filtered = allPlanets.filter(planet =>
    planet.pl_name.toLowerCase().includes(query)
  );
  renderPlanets(filtered);
}

document.getElementById("search-input").addEventListener("input", handleSearch);

getPlanets();