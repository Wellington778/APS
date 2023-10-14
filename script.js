const fireTable = document.querySelector('.fire-table')
const latestFireBanner = document.querySelector('.latest-fire')

fireHotlink = "https://cdn-icons-png.flaticon.com/512/1759/1759484.png"
const planeIcon = L.icon({
    iconUrl: fireHotlink,
    iconSize: [32, 32],
});

// get information from server
async function getLatestFire() {
    const rawData = await fetch('https://smin.wellington777.repl.co/ultimos_incendios')
    const latestFireData = await rawData.json()

    latestFireBanner.innerHTML = ''
    latestFireData.forEach(insertLatestFire)
}

async function getFireInfo() {
    const rawData = await fetch('https://smin.wellington777.repl.co/incendios')
    const fireData = await rawData.json()

    console.log(fireData);
    fireData.forEach(insertTableItem)
		fireData.forEach(markFireInMap)
}

// get localizations
async function getLocal(lat, lon) {

    // const rawLocation = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=45644761025242f8a8214fad9611eca8`)
		const rawLocation = await 
				fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=c6b6da0f80f24b299e08ee1075f81aa5&`) 

    const location = await rawLocation.json()

    return location.results[0].components
}


// insert info in HTML
async function insertTableItem({ acq_date, state_code, latitude, longitude, frp, instrument }) {

    const tr = document.createElement('tr')
    const local = await getLocal(latitude, longitude)

    tr.innerHTML = `
    <td>${acq_date.split('-').reverse().join('/')} </td>
    <td>${local.state_code}</td>
    <td>${local.town || local.village || local.city} </td>
    <td>${frp} </td>
    <td>${instrument}</td>`

    fireTable.appendChild(tr)
}

async function insertLatestFire({ latitude, longitude, frp }) {
    const fireData = document.createElement('span')

    const local = await getLocal(latitude, longitude)

    fireData.innerHTML = ` ${local.state_code} <b>${local.town || local.village || local.city}</b> FRP: ${frp} |`

    latestFireBanner.appendChild(fireData)
}

function setUpLeafletMap(){
		const MAX_ZOOM = 19;

		window.map = L.map('map').setView([-15.799077280776096, -47.860738116246424], 4);

		/* Visit https://github.com/gpxstudio/gpxstudio.github.io/blob/5a16268db9da76aba7fe2bcdb17d4c04253ec409/js/layers.js for more layers */
		L.tileLayer('https://maps.refuges.info/hiking/{z}/{x}/{y}.png', {
        maxNativeZoom: 18,
        maxZoom: MAX_ZOOM,
        attribution: '&copy; <a href="https://wiki.openstreetmap.org/wiki/Hiking/mri" target="_blank">sly</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
    }).addTo(window.map);
 
}

async function markFireInMap( fireJSON ) {

		var fire_circle = L.marker([fireJSON.latitude, fireJSON.longitude], {icon: planeIcon}).addTo(window.map);
		
		info = { country_id: fireJSON.country_id, acq_date: fireJSON.acq_date, acq_time: fireJSON.acq_time, latitude: fireJSON.latitude, longitude: fireJSON.longitude }
		fire_circle.bindPopup(JSON.stringify(info).replace(",", ",\n"))
}

getFireInfo()
getLatestFire()
setUpLeafletMap()
