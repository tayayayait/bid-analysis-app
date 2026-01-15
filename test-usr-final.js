import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const encodedKey = process.env.VITE_PUBLIC_DATA_KEY
// Encode corpNm manually to ensure safety
const corpNm = encodeURIComponent('삼성')

async function test(prefix) {
    const baseUrl = 'https://apis.data.go.kr/1230000'
    const path = prefix ? `/${prefix}/UsrInfoService/getPrcrmntCorpBasicInfo02` : `/UsrInfoService/getPrcrmntCorpBasicInfo02`
    // Ensure Key is passed exactly as in .env
    const url = `${baseUrl}${path}?ServiceKey=${encodedKey}&type=json&numOfRows=1&pageNo=1&corpNm=${corpNm}`.replace('//', '/')

    try {
        console.log(`\nTesting: ${path}`)
        const response = await axios.get(url, {
            validateStatus: false,
            responseType: 'text' // Force text to avoid parsing errors
        })
        console.log(`Status: ${response.status}`)
        console.log(`Body: ${response.data.substring(0, 500)}`)
    } catch (e) {
        console.log(`Error: ${e.message}`)
    }
}

async function run() {
    console.log('--- Debugging UsrInfoService ---')
    await test('')      // Root path (Previous 500 candidate)
    await test('bs')    // Suspected prefix
    await test('ad')    // Standard prefix (404?)
    await test('as')    // Scsbid prefix (404?)
}

run()
