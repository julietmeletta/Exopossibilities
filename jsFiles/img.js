const PLANET_IMAGES = {
  "terrestrial": "images/terrestrialImg.jpeg",
  "super earth": "images/superEarthImg.jpeg",
  "mini-neptune": "images/miniNeptuneImg.jpg",
  "neptune-like": "images/neptuneLikeImg.jpeg",
  "gas giant": "images/gasGiantImg.jpeg",
  "hot jupiter": "images/hotJupiterImg.jpg"
};

function classifyPlanet(planet) {
  const radius = parseFloat(planet.pl_rade);
  const mass = parseFloat(planet.pl_bmasse);
  const temp = parseFloat(planet.pl_eqt);

  if (!isNaN(radius)) {
    if (radius < 1.0) return "terrestrial";
    if (radius < 2) return "super earth";
    if (radius < 4) return "mini-neptune";
    if (radius < 6) return "neptune-like";
    if (!isNaN(temp) && temp > 1000) return "hot jupiter";
    return "gas giant";
  }

  if (!isNaN(mass)) {
    if (mass < 2) return "terrestrial";
    if (mass < 10) return "super earth";
    if (mass < 17) return "mini-neptune";
    if (mass < 50) return "neptune-like";
    if (!isNaN(temp) && temp > 1000) return "hot jupiter";
    return "gas giant";
  }

  return "terrestrial";
}

function getPlanetImageUrl(planet) {
  return PLANET_IMAGES[classifyPlanet(planet)];
}