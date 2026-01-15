import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const encodedKey = process.env.VITE_PUBLIC_DATA_KEY
const corpNm = encodeURIComponent('삼성') // Test with a common name

async function test(url) {
    try {
        console.log(`Testing: ${url}`)
        const response = await axios.get(url, { validateStatus: false })
        console.log(`Status: ${response.status}`)
        if (response.status === 200) {
            console.log('Success!')
            return true
        }
    } catch (e) {
        console.log(`Error: ${e.message}`)
    }
    return false
}

async function run() {
    const baseUrl = 'https://apis.data.go.kr/1230000'
    const service = 'UsrInfoService'
    const operation = 'getPrcrmntCorpBasicInfo02'

    // Check known/suspected prefixes
    const prefixes = ['ad', 'as', 'bs', 'ds', '']

    for (const prefix of prefixes) {
        const url = `${baseUrl}/${prefix}/${service}/${operation}?ServiceKey=${encodedKey}&type=json&numOfRows=1&pageNo=1&corpNm=${corpNm}`.replace('//', '/') // Avoid double slash if prefix is empty
        await test(url)
    }
}

run()
