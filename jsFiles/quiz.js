let allPlanets = [];
let habitableC = [];
let habitableO = [];

Promise.all([
  fetch("jsonFiles/planets.json").then(r => r.json()),
  fetch("jsonFiles/habitableC.json").then(r => r.json()),
  fetch("jsonFiles/habitableO.json").then(r => r.json())
]).then(([planets, hc, ho]) => {
  allPlanets = planets;
  habitableC = hc;
  habitableO = ho;
});

// same tidal-lock logic as planet.js
function isTidallyLocked(planet) {
  if (planet.st_teff == null || planet.pl_orbper == null) return false;
  if (planet.st_teff <= 3900) return planet.pl_orbper < 15;
  if (planet.st_teff <= 5300) return planet.pl_orbper < 30;
  return planet.pl_orbper < 5;
}

// same gravity formula as planet.js (% of Earth gravity)
function getGravity(planet) {
  if (!planet.pl_bmasse || !planet.pl_rade) return null;
  return (planet.pl_bmasse / (planet.pl_rade * planet.pl_rade)) * 100;
}

const answers = {};

document.querySelectorAll(".question-card").forEach(card => {
  const key = card.dataset.key;
  const options = card.querySelectorAll("h3");

  options.forEach(option => {
    option.addEventListener("click", () => {
      options.forEach(o => o.classList.remove("selected"));
      option.classList.add("selected");
      answers[key] = option.dataset.value;
    });
  });
});

document.getElementById("submit-quiz").addEventListener("click", () => {
  const tempTargets = [150, 230, 288, 350, 600];  // Freezing..Hot, K
  const distTargets = [5000, 500, 1500];           // Far, Close, Middle, pc
  const yearTargets = [5, 55, 550, 2000];          // day ranges, in Earth days
  const gravTargets = [150, 50, 100];              // More, Less, Similar to Earth (%)

  const scored = allPlanets.map(planet => {
    let total = 0, count = 0;

    if (answers.temperature && planet.pl_eqt) {
      total += Math.abs(planet.pl_eqt - tempTargets[answers.temperature]) / tempTargets[answers.temperature];
      count++;
    }
    if (answers.distance && planet.sy_dist) {
      total += Math.abs(planet.sy_dist - distTargets[answers.distance]) / distTargets[answers.distance];
      count++;
    }
    if (answers.year && planet.pl_orbper) {
      total += Math.abs(planet.pl_orbper - yearTargets[answers.year]) / yearTargets[answers.year];
      count++;
    }
    if (answers.gravity) {
      const g = getGravity(planet);
      if (g) {
        total += Math.abs(g - gravTargets[answers.gravity]) / gravTargets[answers.gravity];
        count++;
      }
    }
    if (answers.daynight) {
      // "0" or "1" = wants tidal locking, "2" = wants regular day/night
      const wantsLocked = answers.daynight === "0" || answers.daynight === "1";
      total += (isTidallyLocked(planet) === wantsLocked) ? 0 : 1;
      count++;
    }

    return { planet, score: count ? total / count : Infinity };
  });

  scored.sort((a, b) => a.score - b.score);
  renderResults(scored.slice(0, 20).map(s => s.planet));
});

function renderResults(planets) {
  const container = document.getElementById("quiz-results");
  container.innerHTML = "";

  for (const planet of planets) {
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