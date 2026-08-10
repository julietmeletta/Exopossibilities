let allPlanets = [];
let habitableC = [];
let habitableO = [];
let medalists = [];

function showSkeletons(container, count = 32) {
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const card = document.createElement("div");
    card.className = "skeleton-card";
    card.innerHTML = `
      <div class="skeleton-image"></div>
      <div class="skeleton-line title"></div>
      <div class="skeleton-line short"></div>
      <div class="skeleton-line short"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
    `;
    container.appendChild(card);
  }
}

const planetList = document.getElementById("planet_list");
if (planetList) showSkeletons(planetList);

const params = new URLSearchParams(window.location.search);
if (params.get("medalists") === "true") {
  const toggle = document.getElementById("medalist-filter");
  if (toggle) toggle.checked = true;
}

async function getPlanets() {
  const [planetsRes, habitableCRes, habitableORes] = await Promise.all([
    fetch("jsonFiles/planets.json"),
    fetch("jsonFiles/habitableC.json"),
    fetch("jsonFiles/habitableO.json")
  ]);

  allPlanets = await planetsRes.json();
  habitableC = await habitableCRes.json();
  habitableO = await habitableORes.json();

  medalists = [4456,3876,5704,3898,2890,623,4145,1746,2612,4766,1613,574,2139].filter(i => allPlanets[i]).map(i => allPlanets[i]);

  applyFilters(); 
  renderPlanetOfTheDay(allPlanets);
}

function renderPlanets(planetArray) {
  const container = document.getElementById("planet_list");
  if (!container) return;
  container.innerHTML = "";

  for (const planet of planetArray) {
    const card = document.createElement("div");
    card.classList.add("planet_card");
    if (medalists.some(p => p.pl_name === planet.pl_name)) {
      card.classList.add("medalist-card");
    }
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
      <p>Equilibrium Temperature: ${parseFloat(planet.pl_eqt).toFixed(0)} K</p>
      <p2>Distance from Earth: ${parseFloat(planet.sy_dist).toFixed(2)} pc</p2>
    `;
    if (medalists.some(p => p.pl_name === planet.pl_name)) {
      if (planet.pl_name === medalists[0].pl_name) {
        card.innerHTML += '<h4>Medal: Highest ESI</h4>';
      }
      if (planet.pl_name === medalists[1].pl_name) {
        card.innerHTML += '<h4>Medal: Closest to Earth</h4>';
      }
      if (planet.pl_name === medalists[2].pl_name) {
        card.innerHTML += '<h4>Medal: Farthest from Earth</h4>';
      }
      if (planet.pl_name === medalists[3].pl_name) {
        card.innerHTML += '<h4>Medal: Lowest ESI & Largest Radius</h4>';
      }
      if (planet.pl_name === medalists[4].pl_name) {
        card.innerHTML += '<h4>Medal: Smallest Radius</h4>';
      }
      if (planet.pl_name === medalists[5].pl_name) {
        card.innerHTML += '<h4>Medal: Smallest Mass</h4>';
      }
      if (planet.pl_name === medalists[6].pl_name) {
        card.innerHTML += '<h4>Medal: Largest Mass</h4>';
      }
      if (planet.pl_name === medalists[7].pl_name) {
        card.innerHTML += '<h4>Medal: Lowest Temperature</h4>';
      }
      if (planet.pl_name === medalists[8].pl_name) {
        card.innerHTML += '<h4>Medal: Highest Temperature</h4>';
      }
      if (planet.pl_name === medalists[9].pl_name) {
        card.innerHTML += '<h4>Medal: Smallest Orbital Period</h4>';
      }
      if (planet.pl_name === medalists[10].pl_name) {
        card.innerHTML += '<h4>Medal: Largest Orbital Period</h4>';
      }
      if (planet.pl_name === medalists[11].pl_name) {
        card.innerHTML += '<h4>Medal: Largest Gravity</h4>';
      }
      if (planet.pl_name === medalists[12].pl_name) {
        card.innerHTML += '<h4>Medal: Smallest Gravity</h4>';
      }

    } else {
      card.innerHTML += '<h4></h4>';
    }

    container.appendChild(card);
  }
}

function applyFilters() {
  const searchEl = document.getElementById("search-input");
  if (!searchEl) return []; 

  const query = searchEl.value.toLowerCase();
  const minDist = parseFloat(document.getElementById("dist-min").value) || 0;
  const maxDist = parseFloat(document.getElementById("dist-max").value) || Infinity;
  const minESI = parseFloat(document.getElementById("esi-min").value) || 0;
  const maxESI = parseFloat(document.getElementById("esi-max").value) || Infinity;
  const habitability = document.getElementById("habitable-filter").value;
  const showMedalistsOnly = document.getElementById("medalist-filter").checked;

  const filtered = allPlanets.filter(planet => {
    const matchesName = planet.pl_name.toLowerCase().includes(query);
    const matchesDist = !planet.sy_dist || (planet.sy_dist >= minDist && planet.sy_dist <= maxDist);
    const matchesESI = !getESI(planet) || (getESI(planet) >= minESI && getESI(planet) <= maxESI);

    let matchesHabitability = true;
    if (habitability === "habitableC") {
      matchesHabitability = habitableC.some(p => p.pl_name === planet.pl_name);
    } else if (habitability === "habitableO") {
      matchesHabitability = habitableO.some(p => p.pl_name === planet.pl_name);
    } else if (habitability === "not-habitable") {
      matchesHabitability = !habitableC.some(p => p.pl_name === planet.pl_name) &&
                            !habitableO.some(p => p.pl_name === planet.pl_name);
    }

    let matchesMedals = true;
    if (showMedalistsOnly) {
      matchesMedals = medalists.some(p => p.pl_name === planet.pl_name);
    }

    return matchesName && matchesDist && matchesESI && matchesHabitability && matchesMedals;
  });

  renderPlanets(filtered);
  return filtered;
}

getPlanets();

const randomPlanet = document.getElementById("Random");
const searchInput = document.getElementById("search-input");
const habitableFilter = document.getElementById("habitable-filter");
const medalistToggle = document.getElementById("medalist-filter");

if (randomPlanet) randomPlanet.addEventListener("click", () => { getRandomPlanet(); });
if (searchInput) searchInput.addEventListener("input", applyFilters);
if (habitableFilter) habitableFilter.addEventListener("change", applyFilters);
if (medalistToggle) {
  medalistToggle.addEventListener("change", () => {
    if (!medalistToggle.checked) {
      const url = new URL(window.location.href);
      url.searchParams.delete("medalists");
      window.history.replaceState({}, "", url);
    }
    applyFilters();
  });
}

async function getRandomPlanet() {
  const filtered = applyFilters();
  if (!filtered.length) {
    alert("No planets match the current filters.");
    return;
  }
  const randomItem = filtered[Math.floor(Math.random() * filtered.length)];
  window.location.href = `planet.html?name=${encodeURIComponent(randomItem.pl_name)}`;
  return randomItem;
}

function getPlanetOfTheDay(planets) {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  let seed = 0;
  for (let i = 0; i < dateString.length; i++) {
    seed = dateString.charCodeAt(i) + ((seed << 5) - seed);
  }
  const index = Math.abs(seed) % planets.length;
  return planets[index];
}

function renderPlanetOfTheDay(planets) {
  const container = document.getElementById("planet-of-the-day");
  if (!container) return;

  const planet = getPlanetOfTheDay(planets);
  const imgSrc = getPlanetImageUrl(planet);

  container.innerHTML = `
    <h3>Planet of the Day</h3>
    <div class="planet-type-wrapper">
      <img src="${imgSrc}" alt="${planet.pl_name} type" class="planet-type-img">
    </div>
    <h4>${planet.pl_name}</h4>
    <p>Radius: ${parseFloat(planet.pl_rade).toFixed(2)} R⊕</p>
    <p>Mass: ${parseFloat(planet.pl_bmasse).toFixed(2)} M⊕</p>
    <p>Equilibrium Temperature: ${parseFloat(planet.pl_eqt).toFixed(0)} K</p>
    <p>Distance from Earth: ${parseFloat(planet.sy_dist).toFixed(2)} pc</p>
  `;

  container.style.cursor = "pointer";
  container.addEventListener("click", () => {
    window.location.href = `planet.html?name=${encodeURIComponent(planet.pl_name)}`;
  });
}

function navPlanetOfTheDay(planets) {
  const pl_day = document.getElementById("t");

  const planet = getPlanetOfTheDay(planets);
  const imgSrc = getPlanetImageUrl(planet);

  pl_day.addEventListener("click", () => {
    window.location.href = `planet.html?name=${encodeURIComponent(planet.pl_name)}`;
  });
}

function renderMedalists() {
  const medalistsCard = document.getElementById("medalists");
  if (!medalistsCard) return;
  medalistsCard.addEventListener("click", () => {
    window.location.href = `discover.html?medalists=true`;
  });
}

renderMedalists();

const bg = document.getElementById('parallax');
let current = 0;
let target = 0;

window.addEventListener('scroll', () => {
  target = window.scrollY * -0.4;
}, { passive: true });

function animate() {
  current += (target - current) * 0.1;
  bg.style.transform = `translateY(${current}px)`;
  requestAnimationFrame(animate);
}

if (bg) animate();

const nav = document.getElementById("side-bar");
function displayNav() {
  const nav_button = document.getElementById("display-nav-button");
  if (nav_button.innerHTML === "☰") {
  nav.style.display = "flex";
  nav_button.innerHTML = "X";
  } else if (nav_button.innerHTML === "X") {
    nav.style.display = "none";
    nav_button.innerHTML = "☰";
  }
}