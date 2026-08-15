function timeToGMST(date) {
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    const day = date.getUTCDate()
        + date.getUTCHours() / 24
        + date.getUTCMinutes() / 1440
        + date.getUTCSeconds() / 86400;
    if (month <= 2) {
        year -= 1;
        month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    const JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
    const T = (JD - 2451545.0) / 36525;
    let GMST = 280.46061837 + 360.98564736629 * (JD - 2451545.0) + 0.000387933 * Math.pow(T, 2) - Math.pow(T, 3) / 38710000;
    GMST = ((GMST % 360) + 360) % 360;
    return GMST;
}

function GMSTtoLST(GMST, longitude) {
    let LST = GMST + longitude;
    LST = ((LST % 360) + 360) % 360;
    return LST;
}

function LSTtoH(LST, RA) {
    let H = LST - RA;
    H = ((H % 360) + 360) % 360;
    return H;
}

function degToRad(deg) { return deg * (Math.PI / 180); }
function radToDeg(rad) { return rad * (180 / Math.PI); }

function calcAltitude(h, dec, latitude) {
    let H = degToRad(h);
    let Dec = degToRad(dec);
    let la = degToRad(latitude);
    let altitude = Math.sin(Dec) * Math.sin(la) + Math.cos(Dec) * Math.cos(la) * Math.cos(H);
    altitude = Math.max(-1, Math.min(1, altitude));
    altitude = Math.asin(altitude);
    altitude = radToDeg(altitude);
    return altitude;
}

function calcAzimuth(h, dec, latitude) {
    let H = degToRad(h);
    let Dec = degToRad(dec);
    let la = degToRad(latitude);
    let y = -Math.sin(H) * Math.cos(Dec);
    let x = Math.sin(Dec) * Math.cos(la) - Math.cos(Dec) * Math.cos(H) * Math.sin(la);
    let azimuth = Math.atan2(y, x);
    azimuth = radToDeg(azimuth);
    azimuth = ((azimuth % 360) + 360) % 360;
    return azimuth;
}

function calcPos(latitude, longitude, time, ra, dec) {
    let gmst = timeToGMST(time);
    let lst = GMSTtoLST(gmst, longitude);
    let h = LSTtoH(lst, ra);
    let altitude = calcAltitude(h, dec, latitude);
    let azimuth = calcAzimuth(h, dec, latitude);
    return { altitude, azimuth };
}

let planetsData = [];
let userLat = null;
let userLong = null;
let userTimestamp = new Date();

async function loadPlanets() {
    const res = await fetch("jsonFiles/planets.json");
    planetsData = await res.json();
    planetsData = planetsData.filter(p => p.ra != null && p.dec != null);
}

function getLocation() {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            userLat = position.coords.latitude;
            userLong = position.coords.longitude;
            document.getElementById("result").innerHTML = "<h1>Location set.</h1>";
        },
        function (error) {
            document.getElementById("result").innerHTML = "<h1>Geolocation failed. Please enable location access.</h1>";
        }
    );
}

async function searchLocation() {
    const address = document.getElementById('address-input').value.trim();
    const resultSpan = document.getElementById('result');
    if (!address) {
        resultSpan.innerHTML = "<h1>Please enter an address.</h1>";
        return;
    }
    resultSpan.innerHTML = "<h1>Searching...</h1>";
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.length === 0) {
            resultSpan.innerHTML = "<h1>Location not found. Try being more specific.</h1>";
            return;
        }
        userLat = parseFloat(data[0].lat);
        userLong = parseFloat(data[0].lon);
        resultSpan.innerHTML = `<h1>Location set (${data[0].display_name})</h1>`;
    } catch (error) {
        resultSpan.innerHTML = "<h1>Error finding location.</h1>";
        console.error(error);
    }
}

function initTimeControls() {
    const dateInput = document.getElementById('date-input');
    const timeInput = document.getElementById('time-input');
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    timeInput.value = `${hh}:${min}`;
    updateTimestamp();
    dateInput.addEventListener('change', updateTimestamp);
    timeInput.addEventListener('input', updateTimestamp);
}

function updateTimestamp() {
    const dateInput = document.getElementById('date-input');
    const timeInput = document.getElementById('time-input');
    const [year, month, day] = dateInput.value.split('-').map(Number);
    const [hours, minutes] = timeInput.value.split(':').map(Number);
    userTimestamp = new Date(year, month - 1, day, hours, minutes);
}

function getDirection(azimuth) {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    return directions[Math.round(azimuth / 45) % 8];
}

function submitted() {
    const result = document.getElementById("result");
    if (userLat === null || userLong === null) {
        result.innerHTML = "<h1>Please share your location first.</h1>";
        return;
    }
    const nameEntered = document.getElementById("text-box").value.trim().toLowerCase();
    const pl = planetsData.find(p => p.pl_name.toLowerCase() === nameEntered);
    if (!pl) {
        result.innerHTML = "<h1>Planet not found. Please enter the name of a planet from the Discover page.</h1>";
        return;
    }
    const pos = calcPos(userLat, userLong, userTimestamp, pl.ra, pl.dec);
    const direction = getDirection(pos.azimuth);
    if (pos.altitude < 0) {
        result.innerHTML = `<h1>${pl.pl_name} is below the horizon right now.</h1>`;
    } else {
        result.innerHTML = `<h1>${pl.pl_name} is about ${pos.altitude.toFixed(1)}° above the horizon towards the ${direction}.</h1>`;
    }
}

function setupAutocomplete() {
    const input = document.getElementById('text-box');
    const dropdown = document.getElementById('autocomplete-dropdown');

    input.addEventListener('input', function () {
        const typed = input.value.toLowerCase().trim();
        dropdown.innerHTML = '';
        if (!typed) {
            dropdown.style.display = 'none';
            return;
        }
        const matches = planetsData
            .filter(p => p.pl_name.toLowerCase().startsWith(typed))
            .slice(0, 8);
        if (matches.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        matches.forEach(function (planet) {
            const item = document.createElement('div');
            item.classList.add('autocomplete-item');
            item.textContent = planet.pl_name;
            item.addEventListener('mousedown', function () {
                input.value = planet.pl_name;
                dropdown.style.display = 'none';
                dropdown.innerHTML = '';
            });
            dropdown.appendChild(item);
        });
        dropdown.style.display = 'block';
    });

    input.addEventListener('blur', function () {
        setTimeout(function () {
            dropdown.style.display = 'none';
            dropdown.innerHTML = '';
        }, 150);
    });
}

loadPlanets();
initTimeControls();
setupAutocomplete();