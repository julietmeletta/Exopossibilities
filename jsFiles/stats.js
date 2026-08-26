
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

function getESI(planet) {
  return 1-Math.sqrt((Math.pow((planet.pl_insol-1)/(planet.pl_insol+1),2)+Math.pow((planet.pl_rade-1)/(planet.pl_rade+1),2))/2);
}

function typeCounts (allPlanets) {
    const typeCounts = {"Mini-Neptune": 0, "Hot Jupiter": 0, "Terrestrial": 0, "Gas Giant": 0, "Neptune-Like": 0, "Super Earth": 0 };
    for (const planet of allPlanets) {
        typeCounts[classifyPlanet(planet)]++;
    }   
    return typeCounts; 
}

function yearCounts (allPlanets) {
    const yearCounts = { "1995": 0, "1996": 0, "1997": 0, "1998": 0, "1999": 0, "2000": 0, "2001": 0, "2002": 0, "2003": 0, "2004": 0, "2005": 0, "2006": 0, "2007": 0, "2008": 0, "2009": 0, "2010": 0, "2011": 0, "2012": 0, "2013": 0, "2014": 0, "2015": 0, "2016": 0, "2017": 0, "2018": 0, "2019": 0, "2020": 0, "2021": 0, "2022": 0, "2023": 0, "2024": 0, "2025": 0, "2026": 0};
    for (const planet of allPlanets) {
        yearCounts[planet.disc_year]++;
    }   
    return yearCounts; 
}

function radiusCounts(allPlanets) {
    const radiusBins = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; 
    for (const planet of allPlanets) {
    const r = parseFloat(planet.pl_rade);
    if (isNaN(r)) continue; 
    if (r < 2) radiusBins[0]++;
    else if (r < 4) radiusBins[1]++;
    else if (r < 6) radiusBins[2]++;
    else if (r < 8) radiusBins[3]++;
    else if (r < 10) radiusBins[4]++;
    else if (r < 12) radiusBins[5]++;
    else if (r < 14) radiusBins[6]++;
    else if (r < 16) radiusBins[7]++;
    else if (r < 18) radiusBins[8]++;
    else if (r < 20) radiusBins[9]++;
    else radiusBins[10]++;
    }
    return radiusBins;
}

function massCounts(allPlanets) {
    const massBins = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; 
    for (const planet of allPlanets) {
    const m = parseFloat(planet.pl_bmasse);
    if (isNaN(m)) continue; 
    if (m < 200) massBins[0]++;
    else if (m < 400) massBins[1]++;
    else if (m < 600) massBins[2]++;
    else if (m < 800) massBins[3]++;
    else if (m < 1000) massBins[4]++;
    else if (m < 1200) massBins[5]++;
    else if (m < 1400) massBins[6]++;
    else if (m < 1600) massBins[7]++;
    else if (m < 1800) massBins[8]++;
    else if (m < 2000) massBins[9]++;
    else massBins[10]++;
    }
    return massBins;
}

function tempCounts(allPlanets) {
    const tempBins = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; 
    for (const planet of allPlanets) {
    const t = parseFloat(planet.pl_eqt);
    if (isNaN(t)) continue; 
    if (t < 200) tempBins[0]++;
    else if (t < 400) tempBins[1]++;
    else if (t < 600) tempBins[2]++;
    else if (t < 800) tempBins[3]++;
    else if (t < 1000) tempBins[4]++;
    else if (t < 1200) tempBins[5]++;
    else if (t < 1400) tempBins[6]++;
    else if (t < 1600) tempBins[7]++;
    else if (t < 1800) tempBins[8]++;
    else if (t < 2000) tempBins[9]++;
    else tempBins[10]++;
    }
    return tempBins;
}

function esiByType(allPlanets) {
    const sums = {"Mini-Neptune": 0, "Hot Jupiter": 0, "Terrestrial": 0, "Gas Giant": 0, "Neptune-Like": 0, "Super Earth": 0};
    const counts = {"Mini-Neptune": 0, "Hot Jupiter": 0, "Terrestrial": 0, "Gas Giant": 0, "Neptune-Like": 0, "Super Earth": 0};
    for (const planet of allPlanets) {
        const insol = parseFloat(planet.pl_insol);
        const rade = parseFloat(planet.pl_rade);
        if (isNaN(insol) || insol <= 0 || isNaN(rade)) continue;
        const e = getESI(planet);
        const t = classifyPlanet(planet);
        if (isNaN(e)) continue;
        sums[t] += e;
        counts[t]++;
    }
    const averages = {};
    for (const type in sums) {
        averages[type] = sums[type] / counts[type];
    }
    return averages;
}

async function init() {
    const planetsRes = await fetch("jsonFiles/planets.json");
    const allPlanets = await planetsRes.json();
    const types = typeCounts(allPlanets);
    const total = allPlanets.length;
    const typePercents = {};
    for (const type in types) {
       typePercents[type] = ((types[type] / total) * 100).toFixed(1);
    }
    Chart.register(ChartDataLabels);
    new Chart(document.getElementById('typeChart'), {
    type: 'doughnut',
    data: {
        labels: ["Mini-Neptune", "Hot Jupiter", "Terrestrial", "Gas Giant", "Neptune-Like", "Super Earth"],
        datasets: [{
            data: Object.values(types),
            backgroundColor: ['rgba(255, 115, 204, 1)', 'rgba(221, 98, 41, 1)', 'rgba(194, 142, 0, 1)', 'rgba(225, 213, 163, 1)', 'rgba(89, 230, 255, 1)', 'rgba(1, 101, 215, 1)']
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
        legend: { labels: { color: 'white' } },
        datalabels: {
        color: '#111',
        font: { size: 13, weight: 'bold' },
        anchor: 'center',
        align: 'center',
        formatter: (value, context) => {
            return typePercents[context.chart.data.labels[context.dataIndex]] + '%';
        }
        }
        }
        }
    });
    const years = yearCounts(allPlanets);
    new Chart(document.getElementById('yearChart'), {
    type: 'line',
    data: {
        labels: Object.keys(years),
        datasets: [{
            label: 'Planets Discovered',
            data: Object.values(years),
            borderColor: 'rgba(89, 230, 255, 1)',
            borderWidth: 2,
            fill: true,
            backgroundColor: 'rgba(89, 230, 255, 0.4)'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: 'white' } }, datalabels: { display: false } },
        scales: {
            x: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.15)'}
            },
            y: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.15)'}
            }

        }
    }
    });
    const radii = radiusCounts(allPlanets);
    new Chart(document.getElementById('radiusChart'), {
    type: 'bar',
    data: {
       labels: ['0–2', '2–4', '4–6', '6–8', '8–10', '10–12', '12–14', '14–16', '16–18', '18–20', '20+'],
        datasets: [{
            data: radii,
            backgroundColor: 'rgba(89, 230, 255, 1)'
        }]
    },
    options: {
        plugins: {
            legend: { display: false },
            datalabels: { display: false }
        },
        scales: {
        x: {
            title: {
                display: true,
                text: 'Radius Size in R⊕',
                color: 'white'
            },
            ticks: { color: 'white' },
            grid: { color: 'rgba(255, 255, 255, 0.15)'}
        },
        y: {
            title: {
                display: true,
                text: 'Number of Planets',
                color: 'white'
            },
            ticks: { color: 'white' },
            grid: { color: 'rgba(255, 255, 255, 0.15)'}
        }
        },
        responsive: true,
        maintainAspectRatio: false
    }
    });
    const masses = massCounts(allPlanets);
    new Chart(document.getElementById('massChart'), {
    type: 'bar',
    data: {
        labels: ['0–200', '200–400', '400–600', '600–800', '800–1000', '1000–1200', '1200–1400', '1400–1600', '1600–1800', '1800–2000', '2000+'],
        datasets: [{
            data: masses,
            backgroundColor: 'rgba(1, 101, 215, 1)'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: { display: false }
        },
        scales: {
        x: {
            title: {
                display: true,
                text: 'Mass Size in M⊕',
                color: 'white'
            },
            ticks: { color: 'white' },
            grid: { color: 'rgba(255, 255, 255, 0.15)'}
        },
        y: {
            title: {
                display: true,
                text: 'Number of Planets',
                color: 'white'
            },
            ticks: { color: 'white' },
            grid: { color: 'rgba(255, 255, 255, 0.15)'}
        }
        }
    }
    });
    const temps = tempCounts(allPlanets);
    new Chart(document.getElementById('tempChart'), {
    type: 'polarArea',
    data: {
        labels: ['0–200', '200–400', '400–600', '600–800', '800–1000', '1000–1200', '1200–1400', '1400–1600', '1600–1800', '1800–2000', '2000+'],
        datasets: [{
            data: temps,
            borderColor: 'rgba(80, 0, 255, 0.8)',
            backgroundColor: 'rgba(80, 0, 255, 0.7)'
        }]
    },
    options: {
        plugins: {
            datalabels: { display: false },
            legend: {
             display: true,
              labels: {
                 color: 'white',
                    generateLabels: () => [{
                        text: 'Temperature in Kelvin',
                        fillStyle: 'rgba(80, 0, 255, 0.7)',
                        strokeStyle: 'rgba(80, 0, 255, 0.8)',
                        lineWidth: 1,
                        fontColor: 'white'
                     }]
                },
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            grid: { color: 'rgba(255, 255, 255, 0.15)' },
            ticks: { color: 'white', backdropColor: 'transparent' }
          }
}
    }
    });
    const esis = esiByType(allPlanets);
    new Chart(document.getElementById('esiChart'), {
    type: 'radar',
    data: {
        labels: Object.keys(esis),
        datasets: [{
            label: 'Average ESI',
            data: Object.values(esis),
            backgroundColor: 'rgba(129, 51, 255, 0.6)',
            borderColor: 'rgba(129, 51, 255, 1)',
        }]
    },
    options: {
  scales: {
    r: {
      min: 0,
      max: 1,
      grid: { color: 'rgba(255, 255, 255, 0.15)' },
      angleLines: { color: 'rgba(255, 255, 255, 0.15)' },
      ticks: { color: 'white', backdropColor: 'transparent', callback: (value, index) => { return index % 2 === 0 ? value : ''; } },
      pointLabels: { color: 'white' }
    } }, 
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    datalabels: { display: false },
    legend: { display: true, labels: { color: 'white' } }
  }
}
});
}

init();