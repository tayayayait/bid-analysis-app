import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const encodedKey = process.env.VITE_PUBLIC_DATA_KEY
const decodedKey = decodeURIComponent(encodedKey)
const corpNm = encodeURIComponent('삼성')

async function test(url, label) {
    try {
        console.log(`\nTesting [${label}]: ${url}`)
        const response = await axios.get(url, { validateStatus: false })
        console.log(`Status: ${response.status}`)
        // Print body regardless of status to see error details
        const body = typeof response.data === 'object' ? JSON.stringify(response.data) : response.data
        console.log(`Body: ${body.substring(0, 500)}`)

        return response.status
    } catch (e) {
        console.log(`Error: ${e.message}`)
        return 0
    }
}

async function run() {
    const baseUrl = 'https://apis.data.go.kr/1230000'
    const service = 'UsrInfoService'
    const operation = 'getPrcrmntCorpBasicInfo02'

    // Test /ad/ with Encoded Key (Likely scenario based on 500)
    await test(`${baseUrl}/ad/${service}/${operation}?ServiceKey=${encodedKey}&type=json&numOfRows=1&pageNo=1&corpNm=${corpNm}`, 'AD + Encoded')

    // Test /ad/ with Decoded Key
    await test(`${baseUrl}/ad/${service}/${operation}?ServiceKey=${decodedKey}&type=json&numOfRows=1&pageNo=1&corpNm=${corpNm}`, 'AD + Decoded')

    // Test /as/ just in case
    await test(`${baseUrl}/as/${service}/${operation}?ServiceKey=${encodedKey}&type=json&numOfRows=1&pageNo=1&corpNm=${corpNm}`, 'AS + Encoded')
}

run()
