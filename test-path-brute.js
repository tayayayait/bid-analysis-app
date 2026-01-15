import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

// The key in .env is already encoded.
const KEY = process.env.VITE_PUBLIC_DATA_KEY

async function checkPath(url) {
    try {
        console.log(`Checking: ${url}`)
        const response = await axios.get(url, { validateStatus: false })
        console.log(`Status: ${response.status}`)
        if (response.status === 200) {
            console.log('Result:', response.data.response?.header || response.data)
            return true
        }
    } catch (e) {
        console.log(`Error: ${e.message}`)
    }
    return false
}

async function run() {
    const prefixes = ['ad', 'as', 'bs', '', '1230000']
    // Sometimes paths are just /ScsbidInfoService without intermediate prefix if rewritten badly, 
    // but here we are calling apis.data.go.kr directly.

    // Standard G2B prefixes seem to be ad (BidPublic), as (Scsbid?), etc.
    const standardPrefixes = ['ad', 'as']
    const serviceNames = [
        'ScsbidInfoService',
        'ScsbidInfoService01',
        'ScsbidInfoService02',
        'ScsbidInfoService/v15', // Sometimes version is in path
    ]

    const operations = ['getScsbidListSttusCnstwk']

    console.log('--- Starting Brute Force Search for ScsbidInfoService ---')

    for (const prefix of standardPrefixes) {
        for (const name of serviceNames) {
            const url = `https://apis.data.go.kr/1230000/${prefix}/${name}/${operations[0]}?ServiceKey=${KEY}&type=json&numOfRows=1&pageNo=1`
            if (await checkPath(url)) {
                console.log(`!!! FOUND VALID PATH: ${url}`)
                return
            }
        }
    }
}

run()
