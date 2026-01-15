import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const encodedKey = process.env.VITE_PUBLIC_DATA_KEY

async function test(url) {
    try {
        console.log(`Testing: ${url}`)
        const response = await axios.get(url, { validateStatus: false })
        console.log(`Status: ${response.status}`)
        if (response.status === 200) {
            console.log('Success! Result Code:', response.data.response?.header?.resultCode)
            return true
        } else {
            // If 404, it means endpoint not found.
            // If 500 or XML error, endpoint exists but something else is wrong.
            console.log('Failed body:', String(response.data).substring(0, 100))
        }
    } catch (e) {
        console.log(`Error: ${e.message}`)
    }
    return false
}

async function run() {
    // Try accessing Scsbid operation via BidPublicInfoService endpoint
    const url = `https://apis.data.go.kr/1230000/ad/BidPublicInfoService/getScsbidListSttusCnstwk?ServiceKey=${encodedKey}&type=json&numOfRows=1&pageNo=1`
    await test(url)
}

run()
