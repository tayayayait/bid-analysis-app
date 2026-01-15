import axios from 'axios'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

// Setup paths
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// Load .env
dotenv.config({ path: path.join(rootDir, '.env') })

const API_KEY = process.env.VITE_PUBLIC_DATA_KEY
const BASE_URL = 'https://apis.data.go.kr/1230000'

// Hardcoded dates (Dec 2024 to early Jan 2025) to ensure valid data range
const startStr = '202412010000'
const endStr = '202501142359'

async function fetchNotices() {
    console.log('Fetching seed notices...')
    const decodedKey = decodeURIComponent(API_KEY)

    // Correct URL from docs: /ad/BidPublicInfoService (no 02 suffix)
    // Operation: getBidPblancListInfoCnstwk
    const url = `${BASE_URL}/ad/BidPublicInfoService/getBidPblancListInfoCnstwk?ServiceKey=${decodedKey}&type=json&numOfRows=100&pageNo=1&inqryDiv=1&inqryBgnDt=${startStr}&inqryEndDt=${endStr}`

    console.log(`Fetching from: ${url}`)

    try {
        const res = await axios.get(url)
        const items = res.data?.response?.body?.items || []
        console.log(`Fetched ${items.length} notices.`)
        return items
    } catch (e) {
        console.error('Error fetching notices:', e.message)
        if (e.response) {
            console.error('Status:', e.response.status)
            // console.error('Data:', JSON.stringify(e.response.data).slice(0, 200))
        }
        return []
    }
}

async function fetchResults() {
    console.log('Fetching seed results...')
    const decodedKey = decodeURIComponent(API_KEY)

    // Assuming ScsbidInfoService attempts:
    // Try /ad/ScsbidInfoService (matching BidPublicInfo) or /ScsbidInfoService
    // Common pattern: /ad/ScsbidInfoService/getOpengResultListInfoCnstwk
    const url = `${BASE_URL}/ad/ScsbidInfoService/getOpengResultListInfoCnstwk?ServiceKey=${decodedKey}&type=json&numOfRows=100&pageNo=1&inqryDiv=1&inqryBgnDt=${startStr}&inqryEndDt=${endStr}`

    console.log(`Fetching from: ${url}`)

    try {
        const res = await axios.get(url)
        const items = res.data?.response?.body?.items || []
        console.log(`Fetched ${items.length} results.`)
        return items
    } catch (e) {
        console.error('Error fetching results:', e.message)
        if (e.response && e.response.status === 404) {
            // Fallback: maybe it IS ScsbidInfoService without /ad/ prefix? or Different path?
            // But let's try this first.
        }
        return []
    }
}

async function run() {
    const notices = await fetchNotices()
    const results = await fetchResults()

    if (notices.length > 0) {
        fs.writeFileSync(path.join(rootDir, 'public/data/seed_bid_notices.json'), JSON.stringify(notices, null, 2))
        console.log(`[SUCCESS] Saved ${notices.length} notices to seed_bid_notices.json`)
    } else {
        console.log('[WARN] No notices fetched.')
    }

    if (results.length > 0) {
        // We also need "bid_results" (Toochal) but ScsbidInfoService usually gives opening results. 
        // We will save this as "seed_opening_results.json" actually?
        // Wait, app uses seed_bid_results.json for "Participant" info? 
        // Actually, ScsbidInfoService/getOpengResultListInfoCnstwk returns list of *bids that opened*.
        // Detailed participant list comes from `getBidPblancListInfoCnstwk`? No.
        // `getOpengResultListInfoCnstwk` IS the opening result list.
        fs.writeFileSync(path.join(rootDir, 'public/data/seed_opening_results.json'), JSON.stringify(results, null, 2))
        console.log(`[SUCCESS] Saved ${results.length} opening results to seed_opening_results.json`)

        // We might also need "seed_bid_results.json" which usually implies "Detail participants".
        // But for now, getting Opening Results acts as the base.
        // We can just copy it to seed_bid_results.json to be safe if the schema is compatible or just empty.
        fs.writeFileSync(path.join(rootDir, 'public/data/seed_bid_results.json'), JSON.stringify(results, null, 2))
    } else {
        console.log('[WARN] No results fetched.')
    }
}

run()
