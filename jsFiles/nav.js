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

function navPlanetOfTheDay() {
  if (!allPlanets.length) {
    alert("Planets are still loading — try again in a second.");
    return;
  }
  const planet = getPlanetOfTheDay(allPlanets);
  window.location.href = `planet.html?name=${encodeURIComponent(planet.pl_name)}`;
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