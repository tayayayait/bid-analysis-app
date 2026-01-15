import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const encodedKey = process.env.VITE_PUBLIC_DATA_KEY
const decodedKey = decodeURIComponent(encodedKey)

async function test(url, keyType) {
    try {
        console.log(`Testing (${keyType}): ${url}`)
        const response = await axios.get(url, { validateStatus: false })
        console.log(`Status: ${response.status}`)
        if (response.status !== 404) {
            console.log('Body:', typeof response.data === 'object' ? JSON.stringify(response.data).substring(0, 200) : response.data.substring(0, 200))
        }
        return response.status
    } catch (e) {
        console.log(`Error: ${e.message}`)
        return 0
    }
}

async function run() {
    const baseUrl = 'https://apis.data.go.kr/1230000'
    const service = 'ScsbidInfoService'
    const operation = 'getScsbidListSttusCnstwk'

    // Variations to try
    const prefixes = ['ad', 'as', 'bs', 'ds', '']
    const contextPaths = ['', '1230000'] // Sometimes 1230000 is repeated? No, likely not.

    // Test Encoded Key (Standard)
    console.log('--- Testing with ENCODED Key ---')
    for (const prefix of prefixes) {
        // Construct path correctly avoids double slashes
        const path = prefix ? `/${prefix}/${service}/${operation}` : `/${service}/${operation}`
        const url = `${baseUrl}${path}?ServiceKey=${encodedKey}&type=json&numOfRows=1&pageNo=1`
        await test(url, 'Encoded')
    }

    // Test Decoded Key (Just in case)
    console.log('\n--- Testing with DECODED Key ---')
    const prefix = 'as' // Focus on the most likely candidate from docs
    const path = `/${prefix}/${service}/${operation}`
    const url = `${baseUrl}${path}?ServiceKey=${decodedKey}&type=json&numOfRows=1&pageNo=1`
    await test(url, 'Decoded')

    // Test 'BidPublicInfoService' (Control Group)
    console.log('\n--- Control Group: BidPublicInfoService ---')
    const controlUrl = `${baseUrl}/ad/BidPublicInfoService/getBidPblancListInfoCnstwk?ServiceKey=${encodedKey}&type=json&numOfRows=1&pageNo=1`
    await test(controlUrl, 'Control')
}

run()
