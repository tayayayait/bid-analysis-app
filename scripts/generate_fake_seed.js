import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const rootDir = path.resolve(path.dirname(__filename), '..')

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min, max) {
    return (Math.random() * (max - min) + min).toFixed(4)
}

function generateNotices(count = 100) {
    const notices = []
    const now = new Date()
    for (let i = 0; i < count; i++) {
        const date = new Date(now)
        date.setDate(date.getDate() - randomInt(1, 365))

        const bidNo = `2024${String(randomInt(1, 12)).padStart(2, '0')}${String(randomInt(10000, 99999))}-00`
        const baseAmt = randomInt(50000000, 500000000)

        notices.push({
            bidNtceNo: bidNo,
            bidNtceNm: `가상의 공사 공고 ${i + 1}호 [테스트 데이터]`,
            ntceInsttNm: '조달청',
            dminsttNm: `수요기관_${randomInt(1, 50)}`,
            bidNtceDt: date.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            presmptPrce: baseAmt, // Estimated Price
            bsisAmount: baseAmt * 0.98, // Base Amount
        })
    }
    return notices
}

function generateResults(notices) {
    const results = []

    notices.forEach(notice => {
        // 80% chance of being completed
        if (Math.random() > 0.2) {
            const participantCount = randomInt(5, 50)
            const winningRate = randomFloat(87.745, 87.755) // Winning rate roughly around 87.745%

            // Add "Open Results" (Winner info)
            results.push({
                bidNtceNo: notice.bidNtceNo,
                opengDt: notice.bidNtceDt,
                partcpntCnt: participantCount,
                succsbidRate: winningRate,
                succsbidAmt: Math.floor(notice.bsisAmount * (winningRate / 100)),
                bids: Array.from({ length: participantCount }).map((_, idx) => ({
                    bidRate: randomFloat(86.5, 88.5),
                    rank: idx + 1,
                    bizNm: `참여업체_${randomInt(100, 999)}`
                }))
            })
        }
    })
    return results
}

async function run() {
    console.log('Generating synthetic seed data...')

    const notices = generateNotices(200) // 200 past notices
    const results = generateResults(notices) // Generate results for them

    const noticesPath = path.join(rootDir, 'public/data/seed_bid_notices.json')
    const resultsPath = path.join(rootDir, 'public/data/seed_bid_results.json') // We put opening results here for simplicity of loader
    const openingPath = path.join(rootDir, 'public/data/seed_opening_results.json')

    fs.writeFileSync(noticesPath, JSON.stringify(notices, null, 2))
    console.log(`Saved ${notices.length} notices to seed_bid_notices.json`)

    // In this app, it seems seed_bid_results.json was intended for "My Bids" or detailed results?
    // But checkAndSeedData loads opening_results separately.
    // Let's populate opening_results mainly.
    fs.writeFileSync(openingPath, JSON.stringify(results, null, 2))
    console.log(`Saved ${results.length} opening results to seed_opening_results.json`)

    // Just fill bid_results with same for now, or empty if it means "My Results"
    fs.writeFileSync(resultsPath, JSON.stringify([], null, 2))
    console.log(`Saved 0 items to seed_bid_results.json (kept validation simple)`)
}

run()
