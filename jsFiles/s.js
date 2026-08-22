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
if (params.get("favorites") === "true") {
  const favToggle = document.getElementById("favorites-filter");
  if (favToggle) favToggle.checked = true;
}

function prefillFiltersFromUrl() {
  const searchEl = document.getElementById("search-input");
  if (!searchEl) return; // not on discover.html, nothing to prefill

  const search = params.get("search");
  const distMin = params.get("distMin");
  const distMax = params.get("distMax");
  const esiMin = params.get("esiMin");
  const esiMax = params.get("esiMax");
  const habitability = params.get("habitability");

  if (search) searchEl.value = search;
  if (distMin) document.getElementById("dist-min").value = distMin;
  if (distMax) document.getElementById("dist-max").value = distMax;
  if (esiMin) document.getElementById("esi-min").value = esiMin;
  if (esiMax) document.getElementById("esi-max").value = esiMax;
  if (habitability) document.getElementById("habitable-filter").value = habitability;
}
prefillFiltersFromUrl();

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

function getFavorites() {
  const raw = localStorage.getItem("favorites");
  return raw ? JSON.parse(raw) : [];
}

function isFavorite(name) {
  return getFavorites().includes(name);
}

function toggleFavorite(name) {
  let favs = getFavorites();
  if (favs.includes(name)) {
    favs = favs.filter(n => n !== name);
  } else {
    favs.push(name);
  }
  localStorage.setItem("favorites", JSON.stringify(favs));
  return favs.includes(name); 
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
    if (isFavorite(planet.pl_name)) {
  card.classList.add("favorited-card");
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
      <h5>${planet.pl_name}</h5>
      <p2>Radius: ${parseFloat(planet.pl_rade).toFixed(2)} R⊕<br></p2>
      <p2>Mass: ${parseFloat(planet.pl_bmasse).toFixed(2)} M⊕<br></p2>
      <p2>Equilibrium Temperature: ${parseFloat(planet.pl_eqt).toFixed(0)} K<br></p2>
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
  const showFavoritesOnly = document.getElementById("favorites-filter").checked;

  const filtered = allPlanets.filter(planet => {
    const matchesName = planet.pl_name.toLowerCase().includes(query);
    const dist = parseFloat(planet.sy_dist);
    const hasDistFilter = minDist > 0 || maxDist < Infinity;
    const matchesDist = !hasDistFilter || (!isNaN(dist) && dist >= minDist && dist <= maxDist);
    const esi = parseFloat(getESI(planet));
    const hasESIFilter = minESI > 0 || maxESI < Infinity;
    const matchesESI = !hasESIFilter || (!isNaN(esi) && esi >= minESI && esi <= maxESI);

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

    let matchesFavorites = true;
    if (showFavoritesOnly) {
      matchesFavorites = isFavorite(planet.pl_name);
    }

    return matchesName && matchesDist && matchesESI && matchesHabitability && matchesMedals && matchesFavorites;
});

  if (showFavoritesOnly && filtered.length === 0) {
      document.getElementById("planet_list").innerHTML = "<h5>No favorites yet. Heart a planet to see it here.</h5>";
     return filtered;
    }

  syncFiltersToUrl({ query, minDist, maxDist, minESI, maxESI, habitability, showMedalistsOnly, showFavoritesOnly});

  renderPlanets(filtered);
  return filtered;
}

function syncFiltersToUrl({ query, minDist, maxDist, minESI, maxESI, habitability, showMedalistsOnly, showFavoritesOnly }) {
  const url = new URL(window.location.href);

  setOrDeleteParam(url, "search", query, "");
  setOrDeleteParam(url, "distMin", minDist, 0);
  setOrDeleteParam(url, "distMax", maxDist, Infinity);
  setOrDeleteParam(url, "esiMin", minESI, 0);
  setOrDeleteParam(url, "esiMax", maxESI, Infinity);
  setOrDeleteParam(url, "habitability", habitability, "all");

  if (showMedalistsOnly) {
    url.searchParams.set("medalists", "true");
  } else {
    url.searchParams.delete("medalists");
  }

  if (showFavoritesOnly) {
    url.searchParams.set("favorites", "true");
  } else {
    url.searchParams.delete("favorites");
  }

  window.history.replaceState({}, "", url);
}

function setOrDeleteParam(url, key, value, defaultValue) {
  if (value === defaultValue || value === "" || value == null) {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
}

if (document.getElementById("planet_list")) {
  getPlanets();
}

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
const favoritesFilter = document.getElementById("favorites-filter");
if (favoritesFilter) favoritesFilter.addEventListener("change", applyFilters);

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