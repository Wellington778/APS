const data = document.querySelector('.earthquake-info')
const fireTable = document.querySelector('.fire-table')

// informações terremotos
async function getEarthQuakeInfo() {
    const earthquake = await fetch('https://data.weather.gov.hk/weatherAPI/opendata/earthquake.php?dataType=qem&lang=en')
    const { mag, region } = await earthquake.json()

    data.innerHTML = `<span class="subtitle is-6"><b>Terremotos | </b> ${mag}: ${region}</span>`
}

async function getFireInfo() {
    const rawData = await fetch('https://smin.wellington777.repl.co/incendios')
    const fireData = await rawData.json()

    console.log(fireData);
    fireData.forEach(insertTableItem)
}

async function insertTableItem({ acq_date, state_code, latitude, longitude, frp, instrument }) {

    const tr = document.createElement('tr')

    let local = {}

    try {
        // const rawLocation = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=d7510e76a5fe423980b3734e6b3860ed`)
        // const location = await rawLocation.json()
        local = location.results[0].components
    } catch (error) {
        local = { message: 'Voltamos ja' }
    }


    tr.innerHTML = `
    <td>${acq_date} </td>
    <td>${local.state_code || local.message}</td>
    <td>${local.town || local.village || local.city || local.message} </td>
    <td>${frp} </td>
    <td>${instrument}</td>`

    fireTable.appendChild(tr)
}

getEarthQuakeInfo()
getFireInfo()