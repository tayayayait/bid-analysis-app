import { getAllBidNotices, getAllOpeningResults } from '../db'

const parseNumber = (value) => {
    if (value === null || value === undefined) return null
    if (typeof value === 'number') return Number.isFinite(value) ? value : null
    const cleaned = String(value).replace(/,/g, '').replace('%', '').trim()
    const num = Number(cleaned)
    return Number.isFinite(num) ? num : null
}

const getBaseAmount = (notice) => {
    return (
        parseNumber(notice?.baseAmount) ??
        parseNumber(notice?.presmptPrce) ??
        parseNumber(notice?.presmptPrceAmt) ??
        parseNumber(notice?.budgetAmount) ??
        0
    )
}

const stringHash = (str) => {
    let hash = 0
    if (!str || str.length === 0) return hash
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash |= 0 // Convert to 32bit integer
    }
    return hash
}

export async function buildTrainingSet() {
    const [notices, openingResults] = await Promise.all([
        getAllBidNotices(),
        getAllOpeningResults()
    ])

    const noticeMap = new Map(notices.map(n => [n.bidNtceNo, n]))
    const groupedResults = new Map()

    // Group opening results by bidNtceNo to find winner and count competitors
    for (const res of openingResults) {
        if (!groupedResults.has(res.bidNtceNo)) {
            groupedResults.set(res.bidNtceNo, [])
        }
        groupedResults.get(res.bidNtceNo).push(res)
    }

    const trainingData = []

    for (const [bidNtceNo, results] of groupedResults) {
        const notice = noticeMap.get(bidNtceNo)
        if (!notice) continue

        // Find winner (opengRank === '1' or 1)
        const winner = results.find(r => String(r.opengRank) === '1')
        if (!winner) continue

        const succRate = parseNumber(winner.bidprcRate ?? winner.bidprcrt)
        if (!succRate || succRate < 80 || succRate > 100) continue // Filter outliers

        const baseAmount = getBaseAmount(notice)
        const competitors = results.length

        // Feature: Institution Hash (Simple numeric representation)
        // In a real ML model, we'd use One-Hot Encoding or Embeddings
        const insttHash = stringHash(notice.dminsttNm || notice.ntceInsttNm || '')

        // Data point
        // y: succRate
        // x features: baseAmount, competitors, insttHash
        trainingData.push({
            bidNtceNo,
            y: succRate,
            x: {
                baseAmount,
                competitors,
                insttHash
            }, // Store as object for flexibility
            meta: {
                dminsttNm: notice.dminsttNm,
                ntceInsttNm: notice.ntceInsttNm,
                bedNtceNm: notice.bidNtceNm
            }
        })
    }

    return trainingData
}
