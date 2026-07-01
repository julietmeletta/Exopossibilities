async function loadPlanet() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");

  const response = await fetch("planets.json");
  const allPlanets = await response.json();
  const planet = allPlanets.find(p => p.pl_name === name);

  if (!planet) {
    document.getElementById("planet-info").innerHTML = "<p>Planet not found.</p>";
    return;
  }

  document.getElementById("planet-name").textContent = planet.pl_name;
  document.getElementById("planet-radius").textContent = planet.pl_rade ?? "Unknown";
  document.getElementById("planet-mass").textContent = planet.pl_bmasse ?? "Unknown";
  document.getElementById("planet-temp").textContent = planet.pl_eqt ?? "Unknown";
  document.getElementById("planet-dist").textContent = planet.sy_dist ?? "Unknown";
}

loadPlanet();