import { getOpeningResultsByBizno, getBidNoticesByIds, getCompanyHistoryByBizno, getCompaniesByName } from '../db'
import { calculateCompetitorProfile } from './competitorProfiling'

const parseNumber = (value) => {
    if (value === null || value === undefined) return null
    if (typeof value === 'number') return Number.isFinite(value) ? value : null
    const cleaned = String(value).replace(/,/g, '').replace('%', '').trim()
    const num = Number(cleaned)
    return Number.isFinite(num) ? num : null
}

const parseOpengCorpInfo = (value) => {
    if (!value || typeof value !== 'string') return null
    const cleaned = value.replace(/\r?\n/g, ' ').trim()
    const parts = cleaned.split('^').map((part) => part.trim())
    if (parts.length < 2) return null
    const [prcrmntCorpNm, bizno, ceoNm, bidprcAmt, bidprcRate] = parts
    return {
        prcrmntCorpNm: prcrmntCorpNm || null,
        bizno: bizno || null,
        ceoNm: ceoNm || null,
        bidprcAmt: parseNumber(bidprcAmt),
        bidprcRate: parseNumber(bidprcRate),
    }
}

const getBidRate = (item) => {
    const direct = parseNumber(item?.bidprcRate ?? item?.bidprcrt ?? item?.bidprcRt)
    if (direct !== null) return direct
    const parsed = parseOpengCorpInfo(item?.opengCorpInfo)
    return parsed?.bidprcRate ?? null
}

const parseDate = (value) => {
    if (!value) return null
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value
    if (typeof value === 'string') {
        if (/^\d{12}$/.test(value)) {
            const yyyy = value.slice(0, 4)
            const mm = value.slice(4, 6)
            const dd = value.slice(6, 8)
            const hh = value.slice(8, 10)
            const min = value.slice(10, 12)
            return new Date(`${yyyy}-${mm}-${dd}T${hh}:${min}:00`)
        }
        if (/^\d{8}$/.test(value)) {
            const yyyy = value.slice(0, 4)
            const mm = value.slice(4, 6)
            const dd = value.slice(6, 8)
            return new Date(`${yyyy}-${mm}-${dd}T00:00:00`)
        }
        const parsed = new Date(value.replace(' ', 'T'))
        return Number.isNaN(parsed.getTime()) ? null : parsed
    }
    return null
}

const getDateValue = (item) => {
    return (
        parseDate(item?.opengDt) ||
        parseDate(item?.rlOpengDt) ||
        parseDate(item?.bidClseDt) ||
        parseDate(item?.bidNtceDt) ||
        null
    )
}

const buildStats = (rates, totalBids, wonBids) => {
    if (!rates.length) {
        return {
            totalBids,
            wonBids,
            winRate: 0,
            avgBidRate: 0,
            stdDevBidRate: 0,
            minBidRate: 0,
            maxBidRate: 0,
        }
    }

    const sum = rates.reduce((acc, v) => acc + v, 0)
    const avg = sum / rates.length
    const variance = rates.reduce((acc, v) => acc + (v - avg) ** 2, 0) / rates.length
    const stdDev = Math.sqrt(variance)
    const min = Math.min(...rates)
    const max = Math.max(...rates)
    const winRate = totalBids > 0 ? (wonBids / totalBids) * 100 : 0

    return {
        totalBids,
        wonBids,
        winRate: Number(winRate.toFixed(2)),
        avgBidRate: Number(avg.toFixed(2)),
        stdDevBidRate: Number(stdDev.toFixed(2)),
        minBidRate: Number(min.toFixed(2)),
        maxBidRate: Number(max.toFixed(2)),
    }
}

const buildDistribution = (rates) => {
    if (!rates.length) return []
    const buckets = new Map()
    rates.forEach((rate) => {
        const bucket = Math.floor(rate)
        const key = `${bucket}-${bucket + 1}%`
        buckets.set(key, (buckets.get(key) || 0) + 1)
    })

    const entries = Array.from(buckets.entries()).map(([range, count]) => ({ range, count }))
    const maxCount = Math.max(...entries.map((item) => item.count))
    return entries
        .map((item) => ({ ...item, isOptimal: item.count === maxCount }))
        .sort((a, b) => {
            const aStart = Number(a.range.split('-')[0])
            const bStart = Number(b.range.split('-')[0])
            return aStart - bStart
        })
}

const buildMonthlyPattern = (items) => {
    const counts = new Map()
    items.forEach((item) => {
        const date = getDateValue(item)
        if (!date) return
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        counts.set(key, (counts.get(key) || 0) + 1)
    })
    return Array.from(counts.entries())
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => (a.month > b.month ? 1 : -1))
}

const buildHourlyPattern = (items) => {
    const counts = new Map()
    items.forEach((item) => {
        const date = getDateValue(item)
        if (!date) return
        const key = String(date.getHours()).padStart(2, '0')
        counts.set(key, (counts.get(key) || 0) + 1)
    })
    return Array.from(counts.entries())
        .map(([hour, count]) => ({ hour, count }))
        .sort((a, b) => (a.hour > b.hour ? 1 : -1))
}

const buildRecentBids = (items, noticeMap, limit = 10) => {
    const withDate = items
        .map((item) => ({
            ...item,
            bidprcRate: getBidRate(item) ?? item.bidprcRate ?? item.bidprcrt,
            bidprcAmt: parseNumber(item.bidprcAmt) ?? item.bidprcAmt,
            opengRank: parseNumber(item.opengRank) ?? item.opengRank,
            opengDt: item.opengDt || item.rlOpengDt || item.bidClseDt || item.bidNtceDt,
        }))
        .sort((a, b) => {
            const aDate = getDateValue(a)
            const bDate = getDateValue(b)
            return (bDate?.getTime() || 0) - (aDate?.getTime() || 0)
        })
        .slice(0, limit)
        .map((item) => ({
            ...item,
            bidNtceNm: noticeMap.get(item.bidNtceNo)?.bidNtceNm || item.bidNtceNm,
            id: item.id || `${item.bidNtceNo || 'bid'}-${item.opengRank || '0'}-${item.bizno || ''}`,
        }))

    return withDate
}

const resolveCompany = async ({ bizno, corpNm }) => {
    if (bizno) {
        const { company } = await getCompanyHistoryByBizno(bizno)
        if (company) return { bizno, company }
    }
    if (corpNm) {
        const matches = await getCompaniesByName(corpNm)
        if (matches?.length) {
            return { bizno: matches[0].bizno, company: matches[0] }
        }
    }
    return { bizno, company: null }
}

/**
 * Analyze competitor bid patterns from local DB
 * @param {Object} params
 * @param {string} params.bizno
 * @param {string} params.corpNm
 * @param {number} params.recentLimit
 */
export async function analyzeCompanyBidPattern(params = {}) {
    const { bizno: inputBizno, corpNm, recentLimit = 10 } = params
    const { bizno, company } = await resolveCompany({ bizno: inputBizno, corpNm })
    if (!bizno) {
        throw new Error('사업자번호 또는 업체명을 확인할 수 없습니다.')
    }

    const openingResults = await getOpeningResultsByBizno(bizno)
    const bidNtceNos = openingResults.map((item) => item.bidNtceNo).filter(Boolean)
    const bidNotices = await getBidNoticesByIds(bidNtceNos)
    const noticeMap = new Map(bidNotices.map((notice) => [notice.bidNtceNo, notice]))

    const rates = openingResults
        .map((item) => getBidRate(item))
        .filter((value) => value !== null)

    const totalBids = openingResults.length
    const wonBids = openingResults.filter((item) => Number(item.opengRank) === 1).length
    const stats = buildStats(rates, totalBids, wonBids)
    const bidRateDistribution = buildDistribution(rates)
    const monthlyPattern = buildMonthlyPattern(openingResults)
    const hourlyPattern = buildHourlyPattern(openingResults)
    const recentBids = buildRecentBids(openingResults, noticeMap, recentLimit)

    const details = await getCompanyHistoryByBizno(bizno)
    const profile = calculateCompetitorProfile(openingResults)

    const fallbackCorp = parseOpengCorpInfo(openingResults[0]?.opengCorpInfo)?.prcrmntCorpNm

    return {
        corpNm: company?.corpNm || corpNm || openingResults[0]?.prcrmntCorpNm || fallbackCorp || '미상',
        bizno,
        stats,
        bidRateDistribution,
        monthlyPattern,
        hourlyPattern,
        recentBids,
        details,
        profile,
    }
}

export default analyzeCompanyBidPattern
