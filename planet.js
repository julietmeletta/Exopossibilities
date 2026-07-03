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
  document.getElementById("planet-radius").textContent = planet.pl_rade ? parseFloat(planet.pl_rade).toFixed(2) : "Unknown";
  document.getElementById("planet-mass").textContent = planet.pl_bmasse ? parseFloat(planet.pl_bmasse).toFixed(2) : "Unknown";
  document.getElementById("planet-temp").textContent = planet.pl_eqt ? parseFloat(planet.pl_eqt).toFixed(2) : "Unknown";
  document.getElementById("planet-dist").textContent = planet.sy_dist ? parseFloat(planet.sy_dist).toFixed(2) : "Unknown";
  document.getElementById("planet-time").textContent = planet.sy_dist ? parseFloat(planet.sy_dist*3.26156).toFixed(2) : "Unknown";

  if(planet.pl_eqt < 250) {
    document.getElementById("water").textContent = "No, too cold.";
  }
}

loadPlanet();