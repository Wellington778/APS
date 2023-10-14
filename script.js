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

// precisei tirar o codigo da api de geolocalização por causa do limite de requisições atingidos
// mas na atualização final, ele vai voltar

let local = {message: "serviço indisponivel"}
    
    tr.innerHTML = `
    <td>${acq_date} </td>
    <td>${local.message}</td>
    <td>${ local.message} </td>
    <td>${frp} </td>
    <td>${instrument}</td>`

    fireTable.appendChild(tr)
}

getEarthQuakeInfo()
getFireInfo()
