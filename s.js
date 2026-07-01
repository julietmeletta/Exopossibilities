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
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
     window.location.href = `planet.html?name=${encodeURIComponent(planet.pl_name)}`;
    });

    card.innerHTML = `
      <h3>${planet.pl_name}</h3>
      <p>Radius: ${planet.pl_rade} R⊕</p>
      <p>Mass: ${planet.pl_bmasse} M⊕</p>
      <p>Equilibrium Temperature: ${planet.pl_eqt} K</p>
      <p>Distance from Earth: ${planet.sy_dist} pc</p>
    `;

    container.appendChild(card);
  }
}

function applyFilters() {
  const query = document.getElementById("search-input").value.toLowerCase();
  const minDist = parseFloat(document.getElementById("dist-min").value);
  const maxDist = parseFloat(document.getElementById("dist-max").value);
  const tempCategory = document.getElementById("temp-filter").value;

  const filtered = allPlanets.filter(planet => {
    const matchesName = planet.pl_name.toLowerCase().includes(query);
    const matchesDist = !planet.sy_dist || (planet.sy_dist >= minDist && planet.sy_dist <= maxDist);

    let matchesTemp = true;
    if (tempCategory === "cold") matchesTemp = planet.pl_eqt < 200;
    else if (tempCategory === "habitable") matchesTemp = planet.pl_eqt >= 200 && planet.pl_eqt <= 320;
    else if (tempCategory === "hot") matchesTemp = planet.pl_eqt > 320;

    return matchesName && matchesDist && matchesTemp;
  });

  renderPlanets(filtered);
}

function handleSearch() {
  applyFilters();
}

document.getElementById("search-input").addEventListener("input", handleSearch);

getPlanets();