const cron = require('node-cron');
const jobs = require('../jobs');
const { dbURL } = require('../src/config')
require('mongodb-plugin').connect({
    dbURL 
})
cron.schedule("0 5 * * *", async () => {
    console.log('Running automatic aging of Application every 5:00 AM')
    console.log(new Date().toISOString())
    await jobs.applicationAging()
    await jobs.recommendAging()
    await jobs.releaseAging()
    console.log('Automation done')
})