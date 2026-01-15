/**
 * Market Pattern Analysis Service
 * MVP: Analyzes bidding patterns based on market distribution rather than individual competitors.
 */

import { getAllBidNotices, getOpeningResultsByBidNo } from './db'

/**
 * Calculates statistical metrics for an array of numbers.
 * @param {number[]} values 
 */
function calculateStats(values) {
    if (!values || values.length === 0) return null

    const n = values.length
    const copy = [...values].sort((a, b) => a - b)

    // Mean
    const sum = copy.reduce((acc, val) => acc + val, 0)
    const mean = sum / n

    // Median
    const mid = Math.floor(n / 2)
    const median = n % 2 !== 0 ? copy[mid] : (copy[mid - 1] + copy[mid]) / 2

    // Mode (using bins of 0.1% for bid rates to find "dense" areas)
    // We treat values as rounded to 3 decimal places usually, but for mode we might want broader bins.
    const modeMap = {}
    let maxFreq = 0
    let mode = null

    copy.forEach(val => {
        const key = val.toFixed(3) // Exact match on 3 decimal places
        modeMap[key] = (modeMap[key] || 0) + 1
        if (modeMap[key] > maxFreq) {
            maxFreq = modeMap[key]
            mode = Number(key)
        }
    })

    // Standard Deviation
    const variance = copy.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n
    const stdDev = Math.sqrt(variance)

    // Quartiles
    const q1 = copy[Math.floor(n * 0.25)]
    const q3 = copy[Math.floor(n * 0.75)]

    return {
        count: n,
        mean,
        median,
        mode,
        stdDev,
        min: copy[0],
        max: copy[n - 1],
        q1,
        q3
    }
}

/**
 * Generates histogram data from values.
 * @param {number[]} values 
 * @param {number} binSize 
 */
function generateHistogram(values, binSize = 0.2) {
    if (!values.length) return []

    const min = Math.floor(Math.min(...values))
    const max = Math.ceil(Math.max(...values))
    const items = []

    // Ensure we cover a reasonable range (e.g., 80% to 95% for bid rates usually)
    // But here we rely on data. 
    // Bid rates usually range from 80 to 90 for 'thng' or 87.745 for others.

    // Create bins
    const bins = {}
    values.forEach(v => {
        const binKey = (Math.floor(v / binSize) * binSize).toFixed(1)
        bins[binKey] = (bins[binKey] || 0) + 1
    })

    return Object.entries(bins).map(([range, count]) => ({
        range: `${Number(range).toFixed(1)}% ~ ${(Number(range) + binSize).toFixed(1)}%`,
        rangeStart: Number(range),
        count
    })).sort((a, b) => a.rangeStart - b.rangeStart)
}

/**
 * Analyzes market patterns for a specific criteria.
 * @param {Object} criteria 
 * @param {string} criteria.type - 'cnstwk', 'thng', 'servc'
 * @param {string} criteria.region - Reginal code or name part (optional)
 * @param {number} criteria.minPrice - Base price min
 * @param {number} criteria.maxPrice - Base price max
 * @param {number} criteria.limit - Limit number of notices (default 500)
 */
export async function analyzeMarketPatterns(criteria) {
    // 1. Fetch similar notices
    // This requires a DB query that joins notices with results/openings
    // For Dexie/IndexedDB, we might need to fetch notices first then filter.

    const toNumber = (value) => {
        if (value === null || value === undefined || value === '') return null
        const cleaned = String(value).replace(/,/g, '').trim()
        const num = Number(cleaned)
        return Number.isFinite(num) ? num : null
    }

    const getNoticePrice = (notice) =>
        toNumber(
            notice?.bssamt ??
            notice?.bssAmt ??
            notice?.bsisAmt ??
            notice?.bsisAmount ??
            notice?.presmptPrce ??
            notice?.presmptPrceAmt ??
            notice?.bdgtAmt ??
            notice?.estmtPrce ??
            0
        )

    const getNoticeDate = (notice) => {
        const candidate = notice?.bidNtceDt || notice?.opentDt || notice?.opengDt || notice?.rgstDt
        if (!candidate) return 0
        const parsed = Date.parse(candidate)
        return Number.isNaN(parsed) ? 0 : parsed
    }

    const allNotices = await getAllBidNotices()
    const filtered = allNotices.filter((n) => {
        // Basic Type Filter (if stored)
        if (criteria.type && n.businessType && n.businessType !== criteria.type) return false

        // Region Filter
        if (criteria.region && n.dminsttNm && !n.dminsttNm.includes(criteria.region)) return false

        // Price Filter
        const price = getNoticePrice(n)
        if (criteria.minPrice && price !== null && price < criteria.minPrice) return false
        if (criteria.maxPrice && price !== null && price > criteria.maxPrice) return false

        return true
    })

    const limit = criteria.limit || 300
    const notices = filtered
        .sort((a, b) => getNoticeDate(b) - getNoticeDate(a))
        .slice(0, limit)

    if (notices.length === 0) {
        return {
            stats: null,
            histogram: [],
            notices: []
        }
    }

    // 2. Fetch Bid Rates (Opening Results) for these notices
    // We need 'sucsfbidRate' (Final Success Rate) from 'bid_results' OR average bid rate from 'opening_results'
    // The user wants "Where competitors flock" -> "Bid Rates" distributions

    // We'll collect all individual bid rates from `opening_results` for these filtered notices
    // OR we can analyze the 'Successful Bid Rate' from `bid_results`.
    // "Market Distribution" usually means where people BID (Toochal-ryul).

    // Let's get 'opening_results' for these notices.
    // Optimization: filtering opening_results by bidNtceNo in notices
    const noticeNos = new Set(notices.map(n => n.bidNtceNo))

    // Fetch opening results efficiently
    // If opening_results are huge, this might be slow in browser.
    // Limitation of MVP in-browser DB.
    // Try to rely on `bid_results` (Winning Rate) first as it's 1:1 with notices?
    // No, user wants "Bidding Pattern" (Pattern of competitors). 
    // We NEED the individual bids to see "Crowding".

    // Strategy: Fetch opening results for top N recent similar notices only (e.g. 50 notices)
    // to keep it fast.
    const sampleNotices = notices.slice(0, 50)
    const sampleNoticeNos = sampleNotices.map(n => n.bidNtceNo)

    const openingsByNotice = await Promise.all(
        sampleNoticeNos.map((bidNtceNo) => getOpeningResultsByBidNo(bidNtceNo))
    )
    const openings = openingsByNotice.flat()

    // Extract valid bid rates
    // bidprcRate is usually e.g., 87.123 
    const bidRates = openings
        .map(o => {
            const r = Number(o.bidprcRate || o.bidprcrt || 0)
            return (r > 0 && r < 150) ? r : null // Basic sanity check
        })
        .filter(r => r !== null)

    const stats = calculateStats(bidRates)
    const histogram = generateHistogram(bidRates)

    // Find "Crowded" zones (Modes) - Top 3 ranges from histogram
    const topRanges = [...histogram].sort((a, b) => b.count - a.count).slice(0, 3)

    return {
        criteria,
        analyzedNoticeCount: sampleNotices.length,
        totalBidsAnalyzed: bidRates.length,
        stats,
        histogram,
        topRanges,
        recentNotices: sampleNotices
    }
}
