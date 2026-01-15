import { getAllBidNotices, getAllBidResults, getAllContracts, getAllOpeningResults } from './db'

const parseDate = (value) => {
    if (!value) return null
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value
    if (typeof value === 'string') {
        const cleaned = value.replace(/-/g, '').replace(/:/g, '').replace(' ', 'T')
        // 14 digits: YYYYMMDDHHMMSS
        if (/^\d{14}$/.test(cleaned)) {
            const yyyy = cleaned.slice(0, 4)
            const mm = cleaned.slice(4, 6)
            const dd = cleaned.slice(6, 8)
            const hh = cleaned.slice(8, 10)
            const min = cleaned.slice(10, 12)
            const ss = cleaned.slice(12, 14)
            return new Date(`${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`)
        }
        // 12 digits: YYYYMMDDHHMM
        if (/^\d{12}$/.test(cleaned)) {
            const yyyy = cleaned.slice(0, 4)
            const mm = cleaned.slice(4, 6)
            const dd = cleaned.slice(6, 8)
            const hh = cleaned.slice(8, 10)
            const min = cleaned.slice(10, 12)
            return new Date(`${yyyy}-${mm}-${dd}T${hh}:${min}:00`)
        }
        if (/^\d{8}$/.test(cleaned)) {
            const yyyy = cleaned.slice(0, 4)
            const mm = cleaned.slice(4, 6)
            const dd = cleaned.slice(6, 8)
            return new Date(`${yyyy}-${mm}-${dd}T00:00:00`)
        }
        const parsed = new Date(value)
        return Number.isNaN(parsed.getTime()) ? null : parsed
    }
    return null
}

const formatMonthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

/**
 * Get aggregated stats for the dashboard
 */
export async function getDashboardStats() {
    try {
        const [notices, results, contracts, openings] = await Promise.all([
            getAllBidNotices(),
            getAllBidResults(),
            getAllContracts(),
            getAllOpeningResults(),
        ])

        // 1. Basic Counts
        const stats = {
            counts: {
                notices: notices.length,
                results: results.length,
                contracts: contracts.length,
                recentNotices: 0 // Will be calculated based on date
            },
            monthlyResults: [],
            monthlyContracts: [],
            monthlyAvgRates: [],
            distribution: [],
        }

        const now = new Date()
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))

        // Recent Notices Count
        stats.counts.recentNotices = notices.filter(item => {
            const date = parseDate(item.bidNtceDt)
            return date && date >= thirtyDaysAgo
        }).length

        // 2. Monthly Trends (Results)
        const resultsMap = new Map()
        results.forEach(item => {
            const date = parseDate(item.rlOpengDt || item.opengDt)
            if (!date) return
            const key = formatMonthKey(date)
            resultsMap.set(key, (resultsMap.get(key) || 0) + 1)
        })
        stats.monthlyResults = Array.from(resultsMap.entries())
            .map(([month, count]) => ({ month, count }))
            .sort((a, b) => (a.month > b.month ? 1 : -1))

        // 3. Monthly Trends (Contracts)
        const contractsMap = new Map()
        contracts.forEach(item => {
            const date = parseDate(item.cntrctDt || item.cntrctCnclsDt)
            if (!date) return
            const key = formatMonthKey(date)
            contractsMap.set(key, (contractsMap.get(key) || 0) + 1)
        })
        stats.monthlyContracts = Array.from(contractsMap.entries())
            .map(([month, count]) => ({ month, count }))
            .sort((a, b) => (a.month > b.month ? 1 : -1))

        // 4. Monthly Avg Bid Rates
        const rateMap = new Map()
        openings.forEach(item => {
            const date = parseDate(item.opengDt || item.rlOpengDt)
            if (!date) return
            const rate = Number(String(item.bidprcRate ?? item.bidprcrt ?? '').replace('%', ''))
            if (!Number.isFinite(rate)) return

            const key = formatMonthKey(date)
            if (!rateMap.has(key)) rateMap.set(key, { total: 0, count: 0 })
            const entry = rateMap.get(key)
            entry.total += rate
            entry.count += 1
        })
        stats.monthlyAvgRates = Array.from(rateMap.entries())
            .map(([month, val]) => ({ month, rate: Number((val.total / val.count).toFixed(2)) }))
            .sort((a, b) => (a.month > b.month ? 1 : -1))

        // 5. Competition Distribution
        const buckets = new Map()
        openings.forEach(item => {
            const rate = Number(String(item.bidprcRate ?? item.bidprcrt ?? '').replace('%', ''))
            if (!Number.isFinite(rate)) return
            // Filter reasonable range to avoid outliers skwing the chart
            if (rate < 80 || rate > 100) return

            const bucket = Math.floor(rate)
            const key = `${bucket}-${bucket + 1}%`
            buckets.set(key, (buckets.get(key) || 0) + 1)
        })
        const entries = Array.from(buckets.entries()).map(([range, count]) => ({ range, count }))
        if (entries.length) {
            const maxCount = Math.max(...entries.map(i => i.count))
            stats.distribution = entries
                .map(item => ({ ...item, isOptimal: item.count === maxCount }))
                .sort((a, b) => Number(a.range.split('-')[0]) - Number(b.range.split('-')[0]))
        }

        return stats

    } catch (error) {
        console.error('Failed to get dashboard stats:', error)
        throw error
    }
}
