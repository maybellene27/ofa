/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const model = require('../../src/models')


const collection = [
    'user',
    'application',
    'bankApplication'
]

const db = require('mongodb-plugin')
const { dbURL, appData } = require('../../src/config')


const seed = async () => {
    console.log('Seeding master data.')
    const database = await db.createConnection({
        uri: dbURL,
        name: `${appData.title.toUpperCase()} Database`
    })
    for (const col of collection) {
        await model[`${col}`].deleteMany({
        })
    }
    console.log('Closing database.')
    await database.close();
    console.log('Database successfully closed.')
}

seed()