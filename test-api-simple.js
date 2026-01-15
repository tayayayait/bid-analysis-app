import { getBidPblancListInfoCnstwk } from './src/services/bidPublicInfoService.js'

async function testApi() {
    console.log('Testing API fetch...')
    try {
        // Use a known recent bid number or just a date range query
        const res = await getBidPblancListInfoCnstwk({
            startDate: '20240101',
            endDate: '20240105',
            numOfRows: 1
        })
        console.log('API Result:', JSON.stringify(res, null, 2))
    } catch (error) {
        console.error('API Error:', error)
    }
}

testApi()
