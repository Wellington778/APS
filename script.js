const fireTable = document.querySelector('.fire-table')
const latestFireBanner = document.querySelector('.latest-fire')


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
}

// get localizations
async function getLocal(lat, lon) {

    const rawLocation = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=45644761025242f8a8214fad9611eca8`)
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

getFireInfo()
getLatestFire()