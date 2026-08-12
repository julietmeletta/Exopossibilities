const date = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));

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

const c = document.getElementById("calc");
c.innerHTML = GMST;