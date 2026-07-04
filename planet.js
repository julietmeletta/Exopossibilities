async function loadPlanet() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");

  const [planetsRes, habitableRes] = await Promise.all([
    fetch("planets.json"),
    fetch("habitableC.json")
  ]);
  const allPlanets = await planetsRes.json();
  const habitable = await habitableRes.json();

  const planet = allPlanets.find(p => p.pl_name === name);
  const isHabitable = habitable.some(h => h.pl_name === name);

  if (!planet) {
    document.getElementById("planet-name").textContent = "Planet not found.";
    return;
  }

  document.getElementById("planet-name").textContent = planet.pl_name;
  document.getElementById("planet-radius").textContent = planet.pl_rade ? parseFloat(planet.pl_rade).toFixed(2) : "Unknown";
  document.getElementById("planet-mass").textContent = planet.pl_bmasse ? parseFloat(planet.pl_bmasse).toFixed(2) : "Unknown";
  document.getElementById("planet-temp").textContent = planet.pl_eqt ? parseFloat(planet.pl_eqt).toFixed(2) : "Unknown";
  document.getElementById("planet-dist").textContent = planet.sy_dist ? parseFloat(planet.sy_dist).toFixed(2) : "Unknown";
  document.getElementById("planet-time").textContent = planet.sy_dist ? parseFloat(planet.sy_dist*3.26156).toFixed(2) : "Unknown";
  document.getElementById("planet-habitable").textContent = isHabitable ? "Yes, in conservative sample." : "No";
}

loadPlanet();


async function loadPlanet() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");

  const [planetsRes, habitableCRes, habitableORes] = await Promise.all([
    fetch("planets.json"),
    fetch("habitableC.json"),
    fetch("habitableO.json")
  ]);

  const allPlanets = await planetsRes.json();
  const habitableC = await habitableCRes.json();
  const habitableO = await habitableORes.json();

  const planet = allPlanets.find(p => p.pl_name === name);

  if (!planet) {
    document.getElementById("planet-name").textContent = "Planet not found.";
    return;
  }

  document.getElementById("planet-name").textContent = planet.pl_name;
  document.getElementById("planet-radius").textContent = planet.pl_rade ? parseFloat(planet.pl_rade).toFixed(2) : "Unknown";
  document.getElementById("planet-mass").textContent = planet.pl_bmasse ? parseFloat(planet.pl_bmasse).toFixed(2) : "Unknown";
  document.getElementById("planet-temp").textContent = planet.pl_eqt ? parseFloat(planet.pl_eqt).toFixed(2) : "Unknown";
  document.getElementById("planet-dist").textContent = planet.sy_dist ? parseFloat(planet.sy_dist).toFixed(2) : "Unknown";
  document.getElementById("planet-time").textContent = planet.sy_dist ? parseFloat(planet.sy_dist*3.26156).toFixed(2) : "Unknown";

  const inC = habitableC.some(p => p.pl_name === name);
  const inO = habitableO.some(p => p.pl_name === name);

  if (inC) {
    document.getElementById("planet-habitable").textContent = "Yes, in conservative sample.";
  } else if (inO) {
    document.getElementById("planet-habitable").textContent = "Yes, in optimistic sample.";
  } else {
    document.getElementById("planet-habitable").textContent = "No";
  }
}

loadPlanet();