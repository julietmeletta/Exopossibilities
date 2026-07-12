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

  const imgEl = document.getElementById("planet-image");
  imgEl.src = getPlanetImageUrl(planet);
  imgEl.alt = `Artist's concept of ${planet.pl_name}`;

  if (!planet) {
    document.getElementById("planet-name").innerHTML = "Planet not found.";
    return;
  }

  const gravity =(planet.pl_bmasse / (planet.pl_rade * planet.pl_rade))*100;

  document.getElementById("planet-name").innerHTML = planet.pl_name;
  document.getElementById("planet-radius").innerHTML = planet.pl_rade ? parseFloat(planet.pl_rade).toFixed(2) : "Unknown";
  document.getElementById("planet-mass").innerHTML = planet.pl_bmasse ? parseFloat(planet.pl_bmasse).toFixed(2) : "Unknown";
  document.getElementById("planet-temp").innerHTML = planet.pl_eqt ? parseFloat(planet.pl_eqt).toFixed(2) : "Unknown";
  document.getElementById("planet-dist").innerHTML = planet.sy_dist ? parseFloat(planet.sy_dist).toFixed(2) : "Unknown";
  document.getElementById("planet-time").innerHTML = planet.sy_dist ? parseFloat(planet.sy_dist*3.26156).toFixed(2) : "Unknown";
  document.getElementById("planet-gravity").innerHTML = gravity ? parseFloat(gravity).toFixed(2) : "Unknown";
  document.getElementById("orbital-period").innerHTML = planet.pl_orbper ? parseFloat(planet.pl_orbper).toFixed(2) : "Unknown";

  const inC = habitableC.some(p => p.pl_name === name);
  const inO = habitableO.some(p => p.pl_name === name);

  if (inC) {
    document.getElementById("planet-habitable").innerHTML = "Yes, in conservative sample.";
  } else if (inO) {
    document.getElementById("planet-habitable").innerHTML = "Yes, in optimistic sample.";
  } else {
    document.getElementById("planet-habitable").innerHTML = "No";
  }

  if (gravity>130) {
    document.getElementById("gravity-result").innerHTML = "increased cardiovascular strain, harder mobility, risk of joint stress.";
  } else if (gravity<50) {
    document.getElementById("gravity-result").innerHTML = "significant bone density and muscle atrophy risk.";
  } else if ((gravity>=70)&&(gravity<=90)) {
    document.getElementById("gravity-result").innerHTML = "mild bone/muscle density loss over long stays.";
  } else {
    document.getElementById("gravity-result").innerHTML = "similar to Earth, negligible physiological effect.";
  }

  if(planet.st_teff<=3900) {
    document.getElementById("radiation").innerHTML = " Since planet orbits a red dwarf, assume high flare/radiation activity, increased cancer risk.";
    document.getElementById("shielding").innerHTML = "<br>&emsp;• Radiation shielding"
    if (planet.pl_orbper<15) {
      document.getElementById("tidal").innerHTML = " Is most likely tidally locked, disruption in circadian rhythm/sleep cycles and thermoregulation stress.";
      document.getElementById("habitat").innerHTML = "<br>&emsp;• Terminator-zone habitat(tidally locked)";
    }
  } else if(planet.st_teff<=5300) {
    if (planet.pl_orbper<30) {
      document.getElementById("tidal").innerHTML = " Is most likely tidally locked, disruption in circadian rhythm/sleep cycles and thermoregulation stress.";
      document.getElementById("habitat").innerHTML = "<br>&emsp;• Terminator-zone habitat(tidally locked)";
    }
  } else {
    if (planet.pl_orbper<5) {
      document.getElementById("tidal").innerHTML = " Is most likely tidally locked, disruption in circadian rhythm/sleep cycles and thermoregulation stress.";
      document.getElementById("habitat").innerHTML = "<br>&emsp;• Terminator-zone habitat(tidally locked)";
    }
  }

  if(planet.pl_eqt<230) {
    document.getElementById("hvac").innerHTML = "<br>&emsp;• Heating system";
  } else if (planet.pl_eqt<260) {
    document.getElementById("hvac").innerHTML = "<br>&emsp;• Heating system likely needed";
  } else if (planet.pl_eqt>330) {
    document.getElementById("hvac").innerHTML = "<br>&emsp;• Cooling system";
  } else if (planet.pl_eqt>300) {
    document.getElementById("hvac").innerHTML = "<br>&emsp;• Cooling system likely needed";
  }
}

loadPlanet();

const PLANET_IMAGE_POOL = {
  "terrestrial": [1, 2, 3],
  "super earth": [1, 2, 3, 4, 5, 6, 7],
  "neptune-like": [1, 2, 3, 4, 5, 6, 7],
  "gas giant": [1, 2, 3, 4, 5, 6, 7]
};

const IMAGE_BASE =
  "https://assets.science.nasa.gov/content/dam/science/astro/exo-explore/assets/content/planets";

// Classify using the same rough radius/mass cutoffs NASA uses
function classifyPlanet(planet) {
  const radius = parseFloat(planet.pl_rade);
  const mass = parseFloat(planet.pl_bmasse);

  if (!isNaN(radius)) {
    if (radius < 1.25) return "terrestrial";
    if (radius < 2) return "super earth";
    if (radius < 6) return "neptune-like";
    return "gas giant";
  }
  // fall back to mass if radius is missing
  if (!isNaN(mass)) {
    if (mass < 2) return "terrestrial";
    if (mass < 10) return "super earth";
    if (mass < 50) return "neptune-like";
    return "gas giant";
  }
  return "terrestrial"; // last-resort default
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function typeToSlug(type) {
  return type.replace(/[^a-z]/gi, "").toLowerCase();
}

function getPlanetImageUrl(planet) {
  const category = classifyPlanet(planet);
  const pool = PLANET_IMAGE_POOL[category];
  const number = pool[hashString(planet.pl_name) % pool.length];
  return `${IMAGE_BASE}/${typeToSlug(category)}-${number}.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg`;
}