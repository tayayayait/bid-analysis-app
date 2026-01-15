import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const encodedKey = process.env.VITE_PUBLIC_DATA_KEY
const corpNm = encodeURIComponent('삼성')

async function test(label, params) {
    const baseUrl = 'https://apis.data.go.kr/1230000/ao/UsrInfoService02/getPrcrmntCorpBasicInfo02'
    const queryString = Object.entries(params)
        .map(([k, v]) => `${k}=${v}`)
        .join('&')

    const url = `${baseUrl}?ServiceKey=${encodedKey}&type=json&numOfRows=10&pageNo=1&${queryString}`.replace('//', '/')

    try {
        console.log(`\nTesting [${label}]`)
        console.log(`URL: ${url}`)
        const response = await axios.get(url, { validateStatus: false })
        console.log(`Status: ${response.status}`)

        const body = typeof response.data === 'object' ? JSON.stringify(response.data).substring(0, 200) : response.data.substring(0, 200)
        console.log(`Body: ${body}`)
    } catch (e) {
        console.log(`Error: ${e.message}`)
    }
}

async function run() {
    // Case 1: Search by Date (inqryDiv=1) + corpNm
    await test('Date + Name', {
        inqryDiv: '1',
        inqryBgnDt: '202401010000',
        inqryEndDt: '202601142359',
        corpNm: corpNm
    })

    // Case 2: Search by BizNo (inqryDiv=3) - Random valid format bizno? 
    // Just try name search first as that's what we need.
}

run()
