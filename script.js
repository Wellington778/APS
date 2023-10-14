const fireTable = document.querySelector('.fire-table')



async function getFireInfo() {
    const rawData = await fetch('https://smin.wellington777.repl.co/incendios')
    const fireData = await rawData.json()

    console.log(fireData);
    fireData.forEach(insertTableItem)
}

async function insertTableItem({ acq_date, state_code, latitude, longitude, frp, instrument }) {

    const tr = document.createElement('tr')

    const rawLocation = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=45644761025242f8a8214fad9611eca8`)
    const location = await rawLocation.json()
    local = location.results[0].components

    tr.innerHTML = `
    <td>${acq_date} </td>
    <td>${local.state_code}</td>
    <td>${local.town || local.village || local.city} </td>
    <td>${frp} </td>
    <td>${instrument}</td>`

    fireTable.appendChild(tr)
}

getFireInfo()