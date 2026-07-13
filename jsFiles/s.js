let allPlanets = [];
let habitableC = [];
let habitableO = [];

async function getPlanets() {
  const [planetsRes, habitableCRes, habitableORes] = await Promise.all([
    fetch("jsonFiles/planets.json"),
    fetch("jsonFiles/habitableC.json"),
    fetch("jsonFiles/habitableO.json")
  ]);

  allPlanets = await planetsRes.json();
  habitableC = await habitableCRes.json();
  habitableO = await habitableORes.json();

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

    const imgSrc = getPlanetImageUrl(planet);
    card.innerHTML = `
  <div class="planet-type-wrapper">
    <img src="${imgSrc}" alt="${planet.pl_name} type" class="planet-type-img">
  </div>
  <h3>${planet.pl_name}</h3>
  <p>Radius: ${parseFloat(planet.pl_rade).toFixed(2)} R⊕</p>
  <p>Mass: ${parseFloat(planet.pl_bmasse).toFixed(2)} M⊕</p>
  <p>Equilibrium Temperature: ${parseFloat(planet.pl_eqt).toFixed(2)} K</p>
  <p>Distance from Earth: ${parseFloat(planet.sy_dist).toFixed(2)} pc</p>
`;

    container.appendChild(card);
  }
}

function applyFilters() {
  const query = document.getElementById("search-input").value.toLowerCase();
  const minDist = parseFloat(document.getElementById("dist-min").value);
  const maxDist = parseFloat(document.getElementById("dist-max").value);
  const habitability = document.getElementById("habitable-filter").value;

  const filtered = allPlanets.filter(planet => {
    const matchesName = planet.pl_name.toLowerCase().includes(query);
    const matchesDist = !planet.sy_dist || (planet.sy_dist >= minDist && planet.sy_dist <= maxDist);

    let matchesHabitability = true;
    if (habitability === "habitableC") {
      matchesHabitability = habitableC.some(p => p.pl_name === planet.pl_name);
    } else if (habitability === "habitableO") {
      matchesHabitability = habitableO.some(p => p.pl_name === planet.pl_name);
    } else if (habitability === "not-habitable") {
      matchesHabitability = !habitableC.some(p => p.pl_name === planet.pl_name) &&
                            !habitableO.some(p => p.pl_name === planet.pl_name);
    }

    return matchesName && matchesDist && matchesHabitability;
  });

  renderPlanets(filtered);
}

getPlanets();

const searchInput = document.getElementById("search-input");
const habitableFilter = document.getElementById("habitable-filter");
if (searchInput) searchInput.addEventListener("input", applyFilters);
if (habitableFilter) habitableFilter.addEventListener("change", applyFilters);
