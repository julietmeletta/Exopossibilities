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
  medalists = [4456,3876,5704,3898,2890,623,4145,1746,2612,4766,1613,574,2139].filter(i => allPlanets[i]).map(i => allPlanets[i]);
});

function isTidallyLocked(planet) {
  if (planet.st_teff == null || planet.pl_orbper == null) return false;
  if (planet.st_teff <= 3900) return planet.pl_orbper < 15;
  if (planet.st_teff <= 5300) return planet.pl_orbper < 30;
  return planet.pl_orbper < 5;
}

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
  const tempRanges = [
    [0, 190],
    [190, 259],
    [259, 319],
    [319, 475],
    [475, Infinity]
  ];
  const distRanges = [
    [0, 19.16],
    [19.16, 103.48],
    [103.48, 338.15],
    [338.15, Infinity]
  ];
  const yearRanges = [
    [0, 10],
    [10, 100],
    [100, 1000],
    [1000, Infinity]
  ];
  const gravRanges = [
    [125, Infinity],
    [0, 75],
    [75, 125]
  ];

  const scored = allPlanets.map(planet => {
    let total = 0, count = 0;

    if (answers.temperature && planet.pl_eqt) {
      const [lo, hi] = tempRanges[answers.temperature];
      total += (planet.pl_eqt >= lo && planet.pl_eqt < hi) ? 0 : 1;
      count++;
    }
    if (answers.distance && planet.sy_dist) {
      const [lo, hi] = distRanges[answers.distance];
      total += (planet.sy_dist >= lo && planet.sy_dist < hi) ? 0 : 1;
      count++;
    }
    if (answers.year && planet.pl_orbper) {
      const [lo, hi] = yearRanges[answers.year];
      total += (planet.pl_orbper >= lo && planet.pl_orbper < hi) ? 0 : 1;
      count++;
    }
    if (answers.gravity) {
      const g = getGravity(planet);
      if (g) {
        const [lo, hi] = gravRanges[answers.gravity];
        total += (g >= lo && g < hi) ? 0 : 1;
        count++;
      }
    }
    if (answers.daynight) {
      const wantsLocked = answers.daynight === "0" || answers.daynight === "1";
      total += (isTidallyLocked(planet) === wantsLocked) ? 0 : 1;
      count++;
    }

    return { planet, score: count ? total / count : Infinity };
  });

  const container = document.getElementById("quiz-results");
  container.innerHTML = "";
    const perfect = document.createElement("div");
    perfect.classList.add("perfect");
    perfect.innerHTML = "Perfect Matches:";
    container.appendChild(perfect);

  const perfectMatches = scored.filter(s => s.score < 0.02).map(s => s.planet);
  renderResults(perfectMatches);
  if (perfectMatches.length == 0) {
    const none = document.createElement("div");
    none.classList.add("none");
    none.innerHTML = "No known planets match this criteria. Please select new preferences.";
    container.appendChild(none);
  }

  const close = document.createElement("div");
    close.classList.add("close");
    close.innerHTML = "Close Matches:";
    container.appendChild(close);

  const closeMatches = scored.filter(s => s.score < 0.4).map(s => s.planet);
  renderResults(closeMatches);
  if (closeMatches.length == 0) {
    const none = document.createElement("div");
    none.classList.add("none");
    none.innerHTML = "No known planets match this criteria. Please select new preferences.";
    container.appendChild(none);
  }
});

function renderResults(planets) {
  const container = document.getElementById("quiz-results");

  for (const planet of planets) {
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

function navPlanetOfTheDay() {
  if (!allPlanets.length) {
    alert("Planets are still loading — try again in a second.");
    return;
  }
  const planet = getPlanetOfTheDay(allPlanets);
  window.location.href = `planet.html?name=${encodeURIComponent(planet.pl_name)}`;
}