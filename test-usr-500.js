import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const encodedKey = process.env.VITE_PUBLIC_DATA_KEY
const corpNm = encodeURIComponent('삼성')

async function test(prefix) {
    const baseUrl = 'https://apis.data.go.kr/1230000'
    const path = prefix ? `/${prefix}/UsrInfoService/getPrcrmntCorpBasicInfo02` : `/UsrInfoService/getPrcrmntCorpBasicInfo02`
    const url = `${baseUrl}${path}?ServiceKey=${encodedKey}&type=json&numOfRows=1&pageNo=1&corpNm=${corpNm}`.replace('//', '/')

    try {
        console.log(`\nTesting: ${url}`)
        const response = await axios.get(url, { validateStatus: false })
        console.log(`Status: ${response.status}`)
        const body = typeof response.data === 'object' ? JSON.stringify(response.data) : response.data
        console.log(`Body: ${String(body).substring(0, 400)}`)
    } catch (e) {
        console.log(`Error: ${e.message}`)
    }
}

async function run() {
    await test('') // root
    await test('bs')
}

run()
