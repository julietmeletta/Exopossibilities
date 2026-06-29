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
    card.textContent = planet.pl_name;
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