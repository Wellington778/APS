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

async function standardizeFireItem({ acq_date, latitude, longitude, frp, instrument }) {

    const data = acq_date.split('-').reverse().join('/')
    const local = await getLocal(latitude, longitude)
    const obj = { data, uf: local.state_code, cidade: local.town || local.village || local.city, frp, instrument }

    return obj
}

async function setStatus() {
    const rawData = await fetch('https://smin.wellington777.repl.co/')
    const { message } = await rawData.json()

    statusHeader.innerHTML = message
}

// get localizations
async function getLocal(lat, lon) {

    // const rawLocation = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=d7510e76a5fe423980b3734e6b3860ed`)
    // const location = await rawLocation.json()

    // return location.results[0].components

    return { state_code: "temp", town: "temp town" }

}


// insert info in HTML
async function insertTableItem({ cidade, data, frp, instrument, uf }) {

    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td>${data} </td>
    <td>${uf}</td>
    <td>${cidade} </td>
    <td>${frp} </td>
    <td>${instrument}</td>`

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

    const filteredArray = normalizedFireArray.filter(({ cidade }) => String(cidade).includes(input))
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