/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const locationModel = require('../../src/models/location')
const xlsxJ = require('xlsx-to-json-lc')
const { promisify } = require('util')
const db = require('mongodb-plugin')
const xlsxToJson = promisify(xlsxJ)
const { dbURL } = require('../../src/config')

const xlsxToJsonConfig = {
    input: `${__dirname}/utils/GeocodeData.xlsx`,
    output: null,
    lowerCaseHeaders: true
}

let currentRegion = ''
let currentProvince = ''
let currentTown = ''

// eslint-disable-next-line max-params
const createDocument = async (name, code, type, order) => {
    let newLocationModel = ''
    if(type === 'region') {
        newLocationModel = await locationModel.create({ 
            name,
            code,
            type,
            order
        })
    }
    else {
        newLocationModel = await locationModel.create({ 
            name,
            code,
            type
        })
    }
    return newLocationModel
}

const seed = async () => {
    console.log('Seeding locations.')
    const database = db.createConnection({
        uri: dbURL,
        name: 'AC Motors Database'
    })


    let geocodes = []

    try {
        geocodes = await xlsxToJson(xlsxToJsonConfig)
    } 
    catch(err) {
        throw new Error('Something went wrong on converting Excel spreadsheet to JSON: ', err) 
    }

    for (const v of geocodes) {
        if(v['geographic level'] === 'Reg') {

            const createdRegion = await createDocument(v.name, v.code, 'region', v.order)
            currentRegion = createdRegion._id
            
        } 
        else if(v['geographic level'] === 'Prov' || v['geographic level'] === 'Dist') {

            const createdProvince = await createDocument(v.name, v.code, 'province')
            currentProvince = createdProvince._id
            createdProvince.jurisdiction = currentRegion 
            await createdProvince.save();

        } 
        else if(v['geographic level'] === 'Mun' || v['geographic level'] === 'City') {
            
            const createdMunicipalityOrCity = await createDocument(v.name, v.code, 'town')
            currentTown = createdMunicipalityOrCity._id
            createdMunicipalityOrCity.jurisdiction = currentProvince 
            await createdMunicipalityOrCity.save();

        }
        else if(v['geographic level'] === 'Bgy') {

            const createdBarangay = await createDocument(v.name, v.code, 'barangay')
            createdBarangay.jurisdiction = currentTown
            await createdBarangay.save();

        } 
    }

    console.log('Seeding locations done.')
    console.log('Closing database.')
    await database.close();
    console.log('Database successfully closed.')
}

seed()