async function loadPlanet() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");

  const [planetsRes, habitableCRes, habitableORes] = await Promise.all([
    fetch("jsonFiles/planets.json"),
    fetch("jsonFiles/habitableC.json"),
    fetch("jsonFiles/habitableO.json")
  ]);

  const allPlanets = await planetsRes.json();
  const habitableC = await habitableCRes.json();
  const habitableO = await habitableORes.json();
  
  const planet = allPlanets.find(p => p.pl_name === name);
  if (!planet) {
    document.getElementById("planet-name").innerHTML = "Planet not found.";
    return;
  }
  const imgEl = document.getElementById("planet-image");
  imgEl.src = getPlanetImageUrl(planet);
  imgEl.alt = `Artist's concept of ${planet.pl_name}`;



  const gravity =(planet.pl_bmasse / (planet.pl_rade * planet.pl_rade))*100;

  document.getElementById("planet-name").innerHTML = planet.pl_name;
  document.getElementById("planet-radius").innerHTML = planet.pl_rade ? parseFloat(planet.pl_rade).toFixed(2) : "Unknown";
  document.getElementById("planet-mass").innerHTML = planet.pl_bmasse ? parseFloat(planet.pl_bmasse).toFixed(2) : "Unknown";
  document.getElementById("planet-temp").innerHTML = planet.pl_eqt ? parseFloat(planet.pl_eqt).toFixed(0) : "Unknown";
  document.getElementById("planet-dist").innerHTML = planet.sy_dist ? parseFloat(planet.sy_dist).toFixed(2) : "Unknown";
  document.getElementById("planet-time").innerHTML = planet.sy_dist ? parseFloat(planet.sy_dist*3.26156).toFixed(2) : "unknown";
  document.getElementById("planet-gravity").innerHTML = gravity ? parseFloat(gravity).toFixed(2) : "Unknown";
  document.getElementById("orbital-period").innerHTML = planet.pl_orbper ? parseFloat(planet.pl_orbper).toFixed(2) : "Unknown";
  document.getElementById("planet-type").innerHTML = classifyPlanet(planet);
  document.getElementById("esi").innerHTML = getESI(planet) ? parseFloat(getESI(planet)).toFixed(2) : "Unknown";

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

const medal_wrapper = document.getElementById("medal-wrapper");
const medal = document.getElementById("medal");

if (medalists.some(p => p.pl_name === planet.pl_name)) {
  medal_wrapper.style.display = "block";

  if (planet.pl_name === medalists[0].pl_name) {
    medal.innerHTML = '<h4>Highest ESI</h4>';
  } else if (planet.pl_name === medalists[1].pl_name) {
    medal.innerHTML = '<h4>Closest to Earth</h4>';
  } else if (planet.pl_name === medalists[2].pl_name) {
    medal.innerHTML = '<h4>Farthest from Earth</h4>';
  } else if (planet.pl_name === medalists[3].pl_name) {
    medal.innerHTML = '<h4>Largest Radius & <br>Lowest ESI</h4>';
  } else if (planet.pl_name === medalists[4].pl_name) {
    medal.innerHTML = '<h4>Smallest Radius</h4>';
  } else if (planet.pl_name === medalists[5].pl_name) {
    medal.innerHTML = '<h4>Smallest Mass</h4>';
  } else if (planet.pl_name === medalists[6].pl_name) {
    medal.innerHTML = '<h4>Largest Mass</h4>';
  } else if (planet.pl_name === medalists[7].pl_name) {
    medal.innerHTML = '<h4>Lowest Temperature</h4>';
  } else if (planet.pl_name === medalists[8].pl_name) {
    medal.innerHTML = '<h4>Highest Temperature</h4>';
  } else if (planet.pl_name === medalists[9].pl_name) {
    medal.innerHTML = '<h4>Smallest Orbital Period</h4>';
  } else if (planet.pl_name === medalists[10].pl_name) {
    medal.innerHTML = '<h4>Largest Orbital Period</h4>';
  } else if (planet.pl_name === medalists[11].pl_name) {
    medal.innerHTML = '<h4>Largest Gravity</h4>';
  } else if (planet.pl_name === medalists[12].pl_name) {
    medal.innerHTML = '<h4>Smallest Gravity</h4>';
  }
  medal.innerHTML += '<h2>Medal Recipient<br></h2>';

} else {
  medal_wrapper.style.display = "none";
}
}

function getESI(planet) {
  return 1-Math.sqrt((Math.pow((planet.pl_insol-1)/(planet.pl_insol+1),2)+Math.pow((planet.pl_rade-1)/(planet.pl_rade+1),2))/2);
}

if (document.getElementById("planet-name")) {
  loadPlanet();
}

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