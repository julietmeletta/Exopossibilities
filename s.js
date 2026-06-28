async function getPlanets() {
  const response = await fetch("https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,pl_rade,pl_bmasse,pl_eqt,sy_dist+from+pscomppars+where+pl_rade+is+not+null+and+pl_bmasse+is+not+null+and+pl_eqt+is+not+null&format=json");
  const data = await response.json();
  console.log(data);
}

getPlanets();