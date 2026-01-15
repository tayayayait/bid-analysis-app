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
        console.log(`TRY: ${prefix || '(root)'}`)
        const res = await axios.get(url, { validateStatus: false })
        console.log(`GOT: ${res.status}`)
        if (res.status === 200) console.log('!!! SUCCESS !!!')
    } catch (e) {
        console.log(`ERR: ${e.message}`)
    }
}

async function run() {
    await test('ad')
    await test('as')
    await test('') // root path
    await test('bs')
}

run()
