const fireTable = document.querySelector('.fire-table')
const latestFireBanner = document.querySelector('.latest-fire')
const statusHeader = document.querySelector('.system-status')
const fireInput = document.querySelector('.fire-input')


let allFireData = []
let normalizedFireArray = []

// faz a requisição dos ultimos incendios
async function getLatestFire() {
    const rawData = await fetch('https://smin.wellington777.repl.co/ultimos_incendios')
    const latestFireData = await rawData.json()

    latestFireBanner.innerHTML = ''
    latestFireData.forEach(insertLatestFire)
}

// faz a requisição para a API para fornecimento dos incendios
async function getFireInfo() {
    const rawData = await fetch('https://smin.wellington777.repl.co/incendios')
    const fireData = await rawData.json()

    return fireData
}

function formatAcqTime(acqTime) {
    const hour = Math.floor(acqTime / 100);
    const minute = acqTime % 100;
    return `${hour}:${minute}`;
}

function kelvinToCelsius(kelvin) {
    const celsius = kelvin - 273.15;
    return celsius.toFixed(1);
}

async function standardizeFireItem({ acq_date, acq_time, latitude, bright_ti4, longitude, frp, instrument, daynight }) {

    let period = 'Dia'
    if (daynight === 'N' || daynight === 'n') period = "Noite"

    const hora = formatAcqTime(acq_time)

    const i4 = kelvinToCelsius(bright_ti4)

    console.log(hora);
    const data = acq_date.split('-').reverse().join('/')
    const local = await getLocal(latitude, longitude)
    const obj = { data, hora, period, uf: local.state_code, cidade: local.town || local.village || local.city, frp, instrument, i4 }

    return obj
}

async function setStatus() {
    const rawData = await fetch('https://smin.wellington777.repl.co/')
    const { message } = await rawData.json()

    statusHeader.innerHTML = message
}

// get localizations
async function getLocal(lat, lon) {

    const rawLocation = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=0f986f9f65174095a324af07565f6a91`)
    const location = await rawLocation.json()

    return location.results[0].components
}


// insert info in HTML
async function insertTableItem({ cidade, data, hora, frp, instrument, uf, period, i4 }) {

    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td>${data}</td>
    <td>${hora}</td>
    <td class="is-hidden-mobile">${period}</td>
    <td>${uf}</td>
    <td>${cidade} </td>
    <td>${frp} </td>
    <td class="is-hidden-mobile">${i4}</td>
    <td class="is-hidden-mobile">${instrument}</td>
    `

    fireTable.appendChild(tr)
}


// função para inserir dados no letreiro
async function insertLatestFire({ latitude, longitude, frp }) {
    const fireData = document.createElement('span') // cria o span

    const local = await getLocal(latitude, longitude) // faz a requisição a api do geocode

    fireData.innerHTML = ` ${local.state_code} <b>${local.town || local.village || local.city}</b> FRP: ${frp} |`

    latestFireBanner.appendChild(fireData)
}

// event handlers ---------------
fireInput.addEventListener('keyup', () => {
    fireTable.innerHTML = ''
    let input = String(fireInput.value).toLocaleLowerCase()

    const filteredArray = normalizedFireArray
        .filter(({ cidade }) => String(cidade).toLocaleLowerCase().includes(input))
    console.log(filteredArray);
    filteredArray.forEach(insertTableItem)
})

async function main() {
    setStatus()
    getLatestFire()
    allFireData = await getFireInfo()

    allFireData.forEach((item) => {
        normalizedFireArray.push(standardizeFireItem(item))
    })
    
    normalizedFireArray = await Promise.all(normalizedFireArray)
    normalizedFireArray.forEach(insertTableItem)
}

main()
