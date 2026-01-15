import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const encodedKey = process.env.VITE_PUBLIC_DATA_KEY
const corpNm = encodeURIComponent('삼성')

async function test(opName) {
    const url = `https://apis.data.go.kr/1230000/ao/UsrInfoService02/${opName}?ServiceKey=${encodedKey}&type=json&numOfRows=1&pageNo=1&corpNm=${corpNm}`
    try {
        console.log(`Testing: ${opName}`)
        const response = await axios.get(url, { validateStatus: false })
        console.log(`Status: ${response.status}`)
        if (response.status === 200) {
            console.log('!!! SUCCESS !!!')
            return true
        }
    } catch (e) {
        console.log(`Error: ${e.message}`)
    }
    return false
}

async function run() {
    const ops = [
        'getPrcrmntCorpBasicInfo02', // Current
        'getPrcrmntCorpBasicInfo01',
        'getPrcrmntCorpBasicInfo',
        'getUsrInfoList',
        'getOpBizInfo',
        'getCorpInfo',
        'getEntrpsInfo', // Enterprise
    ]

    for (const op of ops) {
        if (await test(op)) break
    }
}

run()
