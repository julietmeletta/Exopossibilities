async function getPlanets() {
  const response = await fetch("planets.json");
  const data = await response.json();
  console.log(data);
  const container = document.getElementById("planet-list");
  for (const planet of data.slice(0, 10)) {
    const card = document.createElement("div");
    card.textContent = planet.pl_name;
    container.appendChild(card);
  }
}

getPlanets();