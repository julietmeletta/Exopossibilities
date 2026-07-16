const PLANET_IMAGES = {
  "Terrestrial": "images/terrestrialImg.jpeg",
  "Super earth": "images/superEarthImg.jpeg",
  "Mini-neptune": "images/miniNeptuneImg.jpg",
  "Neptune-like": "images/neptuneLikeImg.jpeg",
  "Gas giant": "images/gasGiantImg.jpeg",
  "Hot jupiter": "images/hotJupiterImg.jpg"
};

function classifyPlanet(planet) {
  const radius = parseFloat(planet.pl_rade);
  const mass = parseFloat(planet.pl_bmasse);
  const temp = parseFloat(planet.pl_eqt);

  if (!isNaN(radius)) {
    if (radius < 1.0) return "Terrestrial";
    if (radius < 2) return "Super earth";
    if (radius < 4) return "Mini-neptune";
    if (radius < 6) return "Neptune-like";
    if (!isNaN(temp) && temp > 1000) return "Hot jupiter";
    return "Gas giant";
  }

  if (!isNaN(mass)) {
    if (mass < 2) return "Terrestrial";
    if (mass < 10) return "Super earth";
    if (mass < 17) return "Mini-neptune";
    if (mass < 50) return "Neptune-like";
    if (!isNaN(temp) && temp > 1000) return "hot jupiter";
    return "Gas giant";
  }

  return "Terrestrial";
}

function getPlanetImageUrl(planet) {
  return PLANET_IMAGES[classifyPlanet(planet)];
}