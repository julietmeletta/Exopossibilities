const PLANET_IMAGES = {
  "Terrestrial": "images/terrestrialImg.jpeg",
  "Super Earth": "images/superEarthImg.jpeg",
  "Mini-Neptune": "images/miniNeptuneImg.jpg",
  "Neptune-Like": "images/neptuneLikeImg.jpeg",
  "Gas Giant": "images/gasGiantImg.jpeg",
  "Hot Jupiter": "images/hotJupiterImg.jpg"
};

function classifyPlanet(planet) {
  const radius = parseFloat(planet.pl_rade);
  const mass = parseFloat(planet.pl_bmasse);
  const temp = parseFloat(planet.pl_eqt);

  if (!isNaN(radius)) {
    if (radius < 1.0) return "Terrestrial";
    if (radius < 2) return "Super Earth";
    if (radius < 4) return "Mini-Neptune";
    if (radius < 6) return "Neptune-Like";
    if (!isNaN(temp) && temp > 1000) return "Hot Jupiter";
    return "Gas Giant";
  }

  if (!isNaN(mass)) {
    if (mass < 2) return "Terrestrial";
    if (mass < 10) return "Super Earth";
    if (mass < 17) return "Mini-Neptune";
    if (mass < 50) return "Neptune-Like";
    if (!isNaN(temp) && temp > 1000) return "Hot Jupiter";
    return "Gas Giant";
  }

  return "Terrestrial";
}

function getPlanetImageUrl(planet) {
  return PLANET_IMAGES[classifyPlanet(planet)];
}