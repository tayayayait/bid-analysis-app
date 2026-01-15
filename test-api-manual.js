import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const encodedKey = process.env.VITE_PUBLIC_DATA_KEY
const bizno = '6128306057' // Example from docs

async function run() {
    // Test inqryDiv=3 (BizNo)
    // Docs say for div 3, bizno is required. Dates might default or be ignored.
    const url = `https://apis.data.go.kr/1230000/ao/UsrInfoService02/getPrcrmntCorpBasicInfo02?ServiceKey=${encodedKey}&type=json&numOfRows=1&pageNo=1&inqryDiv=3&bizno=${bizno}`
    console.log(`Testing: ${url}`)
    try {
        const response = await axios.get(url, { validateStatus: false })
        console.log(`Status: ${response.status}`)
        console.log(`Body: ${typeof response.data === 'object' ? JSON.stringify(response.data) : response.data}`)
    } catch (e) {
        console.error(e)
    }
}
run()
