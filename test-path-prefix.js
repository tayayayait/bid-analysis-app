import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const serviceKey = process.env.VITE_PUBLIC_DATA_KEY
const encodedKey = encodeURIComponent(serviceKey) // Key in .env is already encoded, but let's check behavior. Wait, previous finding was .env key is ALREADY encoded.

// Logic from api.js: The key in .env is URL encoded. 
// So we should NOT encode it again if it is already encoded.
// Let's use the exact key string as found in .env
const KEY = serviceKey

async function testPath(prefix, serviceName, operation) {
    const url = `https://apis.data.go.kr/1230000/${prefix}/${serviceName}/${operation}?ServiceKey=${KEY}&type=json&numOfRows=1&pageNo=1`
    console.log(`Testing: ${url}`)
    try {
        const response = await axios.get(url)
        console.log(`[SUCCESS] ${prefix} - Status: ${response.status}`)
        if (response.data.response?.header?.resultCode === '00') {
            console.log('Result Code: 00 (Normal)')
        } else {
            console.log('Result:', response.data)
        }
    } catch (error) {
        console.log(`[FAILED] ${prefix} - Status: ${error.response?.status || error.message}`)
    }
}

async function run() {
    console.log('--- Testing BidPublicInfoService (Known Good: /ad/) ---')
    await testPath('ad', 'BidPublicInfoService', 'getBidPblancListInfoCnstwk')

    console.log('\n--- Testing ScsbidInfoService (Suspected: /as/) ---')
    await testPath('ad', 'ScsbidInfoService', 'getScsbidListSttusCnstwk') // Current config (failing)
    await testPath('as', 'ScsbidInfoService', 'getScsbidListSttusCnstwk') // Hypothesized config
}

run()
