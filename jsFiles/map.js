let date = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));

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
    const JD = Math.floor(365.25 * (year + 4716))+ Math.floor(30.6001 * (month + 1))+ day + B - 1524.5;

    const T = (JD - 2451545.0) / 36525;
    let GMST = 280.46061837 + 360.98564736629*(JD - 2451545.0) + 0.000387933*Math.pow(T,2) - Math.pow(T,3)/38710000;
    GMST = ((GMST % 360) + 360) % 360;
    return GMST;
}

let GMST = timeToGMST(date);

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

function degToRad(deg) {return deg * (Math.PI / 180);}
function radToDeg(rad) {return rad * (180 / Math.PI);}

function calcAltitude(h, dec, latitude) {
    let H = degToRad(h);
    let Dec = degToRad(dec);
    let la = degToRad(latitude);
    let altitude = Math.sin(Dec)*Math.sin(la)+Math.cos(Dec)*Math.cos(la)*Math.cos(H);
    altitude = Math.max(-1, Math.min(1, altitude));
    altitude = Math.asin(altitude);
    altitude = radToDeg(altitude);
    return altitude;
}

function calcAzimuth(h, dec, latitude) {
    let H = degToRad(h);
    let Dec = degToRad(dec);
    let la = degToRad(latitude);
    let y = -Math.sin(H)*Math.cos(Dec);
    let x = Math.sin(Dec)*Math.cos(la)-Math.cos(Dec)*Math.cos(H)*Math.sin(la);
    let azimuth = Math.atan2(y,x);
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
    const data = {altitude, azimuth};
    return data;
}

const c = document.getElementById("calc");
c.innerHTML = JSON.stringify(calcPos(42.365589, -71.010025, new Date(Date.UTC(2026, 7, 13, 3, 5, 0, 0)), 284.0592503, 44.5183733));