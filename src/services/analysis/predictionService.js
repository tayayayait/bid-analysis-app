import {
    getAllBidNotices,
    getBidNoticeByBidNo,
    getOpeningResultsByBidNo,
    getBidResultByBidNo,
    saveBidNotices,
    saveOpeningResults,
} from '../db'
import {
    getBidPblancListInfoCnstwk,
    getBidPblancListInfoThng,
    getBidPblancListInfoServc,
    getBidPblancListInfoFrgcpt,
} from '../bidPublicInfoService'
import { getOpengResultListInfoOpengCompt, resolveOpeningParams } from '../scsbidInfoService'
import { buildTrainingSet } from './trainingData'
import { analyzeInstitutionTrends, performRegression } from './regressionService'

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

const getBaseAmount = (notice, fallback) => {
    return (
        parseNumber(fallback) ??
        parseNumber(notice?.baseAmount) ??
        parseNumber(notice?.presmptPrce) ??
        parseNumber(notice?.presmptPrceAmt) ??
        parseNumber(notice?.asignBdgtAmt) ??
        parseNumber(notice?.bsisProfltAmt) ??
        parseNumber(notice?.bdgtAmt) ??
        parseNumber(notice?.budgetAmount) ??
        parseNumber(notice?.estmtPrce) ??
        parseNumber(notice?.estmtPrceAmt) ??
        null
    )
}

const tokenize = (text) => {
    if (!text) return []
    return String(text)
        .toLowerCase()
        .split(/\s+/)
        .filter((token) => token.length >= 2)
}

const isBlank = (value) => value === null || value === undefined || String(value).trim() === ''

const similarityScore = (notice, target) => {
    if (!notice || !target) return -999
    let score = 0
    const noticeAmount = getBaseAmount(notice)

    // 0. Business Type (Hard-ish match)
    if (target.businessType && notice?.businessType && notice.businessType !== target.businessType) {
        return -999
    }

    // 1. Price Similarity (Weighted Heavy)
    if (target.baseAmount && noticeAmount) {
        const ratio = Math.abs(noticeAmount - target.baseAmount) / target.baseAmount
        if (ratio <= 0.1) score += 5       // Very close (+-10%)
        else if (ratio <= 0.3) score += 3  // Close (+-30%)
        else if (ratio <= 0.5) score += 1  // Moderate
        else score -= 2                    // Too different (Penalize)
    }

    // 2. Name Similarity (Token Matching)
    if (target.tokens.length && notice?.bidNtceNm) {
        const noticeName = String(notice.bidNtceNm).toLowerCase()
        const hits = target.tokens.filter((token) => noticeName.includes(token)).length
        score += hits * 0.5
    }

    // 2.5 Region restriction (Optional)
    if (!isBlank(target.prtcptLmtRgnNm) && !isBlank(notice?.prtcptLmtRgnNm)) {
        if (String(notice.prtcptLmtRgnNm).includes(String(target.prtcptLmtRgnNm))) score += 1
        else score -= 0.5
    }

    // 3. Institution Matching
    if (target.dminsttNm && notice?.dminsttNm === target.dminsttNm) score += 2
    if (target.ntceInsttNm && notice?.ntceInsttNm === target.ntceInsttNm) score += 1

    // 4. Time Decay (Recency)
    // Give boost to bids within last 6 months
    if (notice?.bidNtceDt) {
        const date = new Date(notice.bidNtceDt)
        const now = new Date()
        const monthsDiff = (now - date) / (1000 * 60 * 60 * 24 * 30)
        if (monthsDiff <= 3) score += 2
        else if (monthsDiff <= 6) score += 1
        else if (monthsDiff >= 24) score -= 1 // Too old
    }

    return score
}

const buildDistribution = (rates) => {
    if (!rates.length) return []
    const binSize = 0.2
    const buckets = new Map()
    rates.forEach((rate) => {
        const bucketIndex = Math.floor(rate * (1 / binSize) + 1e-9)
        const bucketStart = bucketIndex * binSize
        const bucketEnd = bucketStart + binSize
        const key = `${bucketStart.toFixed(1)}-${bucketEnd.toFixed(1)}%`
        buckets.set(key, (buckets.get(key) || 0) + 1)
    })
    const entries = Array.from(buckets.entries()).map(([range, count]) => ({ range, count }))
    const maxCount = Math.max(...entries.map((item) => item.count))
    return entries
        .map((item) => ({ ...item, isOptimal: item.count === maxCount }))
        .sort((a, b) => Number(a.range.split('-')[0]) - Number(b.range.split('-')[0]))
}

const buildZones = (distribution) => {
    if (!distribution.length) return []
    const maxCount = Math.max(...distribution.map((item) => item.count))
    return distribution.map((item) => {
        const [minStr, maxStr] = item.range.replace('%', '').split('-')
        const countRatio = item.count / maxCount
        let density = 'low'
        if (countRatio >= 0.8) density = 'optimal'
        else if (countRatio >= 0.5) density = 'high'
        else if (countRatio >= 0.2) density = 'normal'
        return {
            rangeStart: Number(minStr),
            rangeEnd: Number(maxStr),
            density,
            estimatedBidders: item.count,
            color: item.isOptimal ? 'var(--color-bid-optimal)' : undefined,
        }
    })
}

import * as ss from 'simple-statistics'

const TARGET_HIT_RATE = 0.7
const MAX_RANGE_WIDTH = 0.5

const computeRecommendation = (rawRates, insttStats, regressionPrediction) => {
    const targetHitRate = TARGET_HIT_RATE
    const maxRangeWidth = MAX_RANGE_WIDTH

    // 1. Basic Validation
    if (!rawRates || rawRates.length < 3) {
        return {
            optimalRange: { min: 0, max: 0 },
            width: 0,
            coverageInSample: 0,
            expectedHitRate: 0,
            recommendedPoint: 0,
            confidence: 0,
            reason: '분석 가능한 데이터가 부족합니다. (최소 3건 필요)',
        }
    }

    // 2. Outlier Removal (IQR Method)
    const q1 = ss.quantile(rawRates, 0.25)
    const q3 = ss.quantile(rawRates, 0.75)
    const iqr = q3 - q1
    const lowerBound = q1 - (1.5 * iqr)
    const upperBound = q3 + (1.5 * iqr)

    const cleanRates = rawRates.filter(r => r >= lowerBound && r <= upperBound)
    const effectiveRates = cleanRates.length >= 3 ? cleanRates : rawRates
    const sorted = [...effectiveRates].sort((a, b) => a - b)
    const n = sorted.length

    if (n === 0) {
        return {
            optimalRange: { min: 0, max: 0 },
            width: 0,
            coverageInSample: 0,
            expectedHitRate: 0,
            recommendedPoint: 0,
            confidence: 10,
            reason: '데이터 편차가 너무 심해 정확한 예측이 어렵습니다.',
        }
    }

    // 3. Find minimum-width range that covers targetHitRate of samples
    const k = Math.max(1, Math.ceil(n * targetHitRate))
    let bestMin = sorted[0]
    let bestMax = sorted[Math.min(n - 1, k - 1)]
    let bestWidth = bestMax - bestMin
    for (let i = 0; i <= n - k; i += 1) {
        const start = sorted[i]
        const end = sorted[i + k - 1]
        const width = end - start
        if (width < bestWidth) {
            bestWidth = width
            bestMin = start
            bestMax = end
        }
    }

    let finalMin = bestMin
    let finalMax = bestMax
    let finalWidth = bestWidth
    let capped = false

    // 4. If width cap is violated, find the best range within maxRangeWidth
    if (finalWidth > maxRangeWidth) {
        capped = true
        let right = 0
        let maxCount = 0
        let capMin = sorted[0]
        let capMax = sorted[0]
        let capWidth = 0

        for (let left = 0; left < n; left += 1) {
            if (right < left) right = left
            while (right < n && sorted[right] - sorted[left] <= maxRangeWidth) {
                right += 1
            }
            const count = right - left
            if (count <= 0) continue
            const width = sorted[right - 1] - sorted[left]
            if (
                count > maxCount ||
                (count === maxCount && width < capWidth) ||
                (count === maxCount && width === capWidth && sorted[left] < capMin)
            ) {
                maxCount = count
                capMin = sorted[left]
                capMax = sorted[right - 1]
                capWidth = width
            }
        }

        finalMin = capMin
        finalMax = capMax
        finalWidth = capWidth
    }

    const inRange = sorted.filter(v => v >= finalMin && v <= finalMax)
    const coverageInSample = n > 0 ? inRange.length / n : 0
    const expectedHitRate = coverageInSample
    const recommendedPoint = inRange.length ? ss.median(inRange) : ss.median(sorted)

    // 5. Confidence
    let confidenceScore = Math.round(coverageInSample * 100)
    if (n > 30) confidenceScore += 10
    if (n < 10) confidenceScore -= 20
    confidenceScore = Math.max(10, Math.min(95, confidenceScore))

    let reason = `목표 적중률 ${Math.round(targetHitRate * 100)}% 기준으로 ${inRange.length}건/${n}건 구간을 계산했습니다.`
    if (capped) {
        reason += ` 구간폭 상한 ${maxRangeWidth}% 적용으로 예상 적중률은 ${(coverageInSample * 100).toFixed(1)}%입니다.`
    } else {
        reason += ` 구간폭 ${finalWidth.toFixed(3)}%로 목표를 충족했습니다.`
    }

    if (insttStats && insttStats.count >= 5) {
        if (insttStats.mean >= finalMin && insttStats.mean <= finalMax) {
            confidenceScore = Math.min(99, confidenceScore + 10)
            reason += ` 발주기관(${insttStats.name})의 성향과도 일치합니다.`
        } else {
            reason += ` (참고: 기관 평균은 ${insttStats.mean.toFixed(3)}%)`
        }
    }

    return {
        optimalRange: {
            min: Number(finalMin.toFixed(4)),
            max: Number(finalMax.toFixed(4))
        },
        width: Number(finalWidth.toFixed(4)),
        coverageInSample: Number(coverageInSample.toFixed(4)),
        expectedHitRate: Number(expectedHitRate.toFixed(4)),
        recommendedPoint: Number(recommendedPoint.toFixed(4)),
        confidence: confidenceScore,
        reason,
    }
}

const buildCompetitors = (openingResults) => {
    const map = new Map()
    openingResults.forEach((item) => {
        const parsed = parseOpengCorpInfo(item.opengCorpInfo)
        const bizno = item.bizno || item.prcbdrBizno || parsed?.bizno || null
        const name = item.prcrmntCorpNm || item.prcbdrNm || parsed?.prcrmntCorpNm || bizno || null
        const key = bizno || name
        if (!key) return
        if (!map.has(key)) {
            map.set(key, {
                bizno,
                name: name || '-',
                count: 0,
                totalRate: 0,
            })
        }
        const entry = map.get(key)
        entry.count += 1
        const rate = getBidRate(item)
        if (rate !== null) entry.totalRate += rate
    })
    return Array.from(map.values())
        .map((entry) => ({
            id: entry.bizno || entry.name,
            bizno: entry.bizno,
            name: entry.name,
            count: entry.count,
            avgRate: entry.count ? Number((entry.totalRate / entry.count).toFixed(2)) : null,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
}

/**
 * Predict bid range based on local historical data.
 * @param {Object} params
 * @param {string} params.bidNtceNo
 * @param {string} params.bidNtceNm
 * @param {number|string} params.baseAmount
 * @param {string} params.ntceInsttNm
 * @param {string} params.dminsttNm
 */
const fetchNoticeFromApi = async (bidNo) => {
    // Try construction first (most common), then others
    const types = [
        { businessType: 'cnstwk', fetcher: getBidPblancListInfoCnstwk },
        { businessType: 'thng', fetcher: getBidPblancListInfoThng },
        { businessType: 'servc', fetcher: getBidPblancListInfoServc },
        { businessType: 'frgcpt', fetcher: getBidPblancListInfoFrgcpt },
    ]
    for (const { businessType, fetcher } of types) {
        try {
            const res = await fetcher({ bidNtceNo: bidNo, pageNo: 1, numOfRows: 1 })
            const items = Array.isArray(res?.items) ? res.items : []
            if (items.length > 0) {
                return { notice: { ...items[0], businessType }, businessType }
            }
        } catch (e) { /* ignore */ }
    }
    return { notice: null, businessType: null }
}

export async function fetchOpeningResultsForBid(bidNtceNo, businessType) {
    if (!bidNtceNo) return { items: [], fetched: false }

    try {
        const existing = await getOpeningResultsByBidNo(bidNtceNo)
        if (existing?.length) {
            return { items: existing, fetched: false }
        }

        let noticeType = businessType || null
        if (!noticeType) {
            const fetched = await fetchNoticeFromApi(bidNtceNo)
            if (fetched?.notice) {
                noticeType = fetched.businessType
                await saveBidNotices([{ ...fetched.notice, businessType: fetched.businessType }])
            }
        }

        if (!noticeType) {
            return { items: [], fetched: false }
        }

        const resolved = await resolveOpeningParams(noticeType, bidNtceNo)
        if (!resolved) {
            return { items: [], fetched: false }
        }

        const opening = await getOpengResultListInfoOpengCompt({
            bidNtceNo: resolved.bidNtceNo,
            bidNtceOrd: resolved.bidNtceOrd,
            bidClsfcNo: resolved.bidClsfcNo,
            rbidNo: resolved.rbidNo,
            pageNo: 1,
            numOfRows: 100,
        })

        const items = Array.isArray(opening?.items) ? opening.items : []
        if (items.length > 0) {
            await saveOpeningResults(items)
        }

        return { items, fetched: items.length > 0 }
    } catch (error) {
        console.warn('[Prediction] fetchOpeningResultsForBid failed:', error?.message || error)
        return { items: [], fetched: false }
    }
}

export async function ensureOpeningResultsForSimilarBids(similarNotices = [], limit = 5) {
    const notices = Array.isArray(similarNotices) ? similarNotices : []
    let fetchedBids = 0
    let fetchedOpening = 0

    for (const notice of notices) {
        if (fetchedBids >= limit) break
        const bidNo = notice?.bidNtceNo
        if (!bidNo) continue
        const existing = await getOpeningResultsByBidNo(bidNo)
        if (existing?.length) continue

        const result = await fetchOpeningResultsForBid(bidNo, notice?.businessType)
        if (result?.items?.length) {
            fetchedBids += 1
            fetchedOpening += result.items.length
        }
    }

    return { fetchedBids, fetchedOpening }
}

export async function predictBidRange(params = {}) {
    const { bidNtceNo, bidNtceNm, baseAmount, ntceInsttNm, dminsttNm } = params

    let notice = bidNtceNo ? await getBidNoticeByBidNo(bidNtceNo) : null
    let noticeType = notice?.businessType || null

    if (notice && bidNtceNo && !noticeType) {
        const fetched = await fetchNoticeFromApi(bidNtceNo)
        if (fetched.notice) {
            noticeType = fetched.businessType
            notice = { ...notice, ...fetched.notice, businessType: fetched.businessType }
            await saveBidNotices([notice])
        }
    }

    if (!notice && bidNtceNo) {
        const fetched = await fetchNoticeFromApi(bidNtceNo)
        notice = fetched.notice
        noticeType = fetched.businessType
        if (notice) {
            await saveBidNotices([{ ...notice, businessType: noticeType }])
        }
    }
    const targetName = notice?.bidNtceNm || bidNtceNm
    const targetBase = getBaseAmount(notice, baseAmount)
    const tokens = tokenize(targetName)
    const target = {
        businessType: noticeType,
        baseAmount: targetBase,
        tokens,
        dminsttNm: notice?.dminsttNm || dminsttNm,
        ntceInsttNm: notice?.ntceInsttNm || ntceInsttNm,
        prtcptLmtRgnNm: notice?.prtcptLmtRgnNm || null,
    }

    const allNotices = await getAllBidNotices()

    // Prefer same business type if we know it
    let scopedNotices = allNotices
    if (target.businessType) {
        const exactType = allNotices.filter((item) => item?.businessType === target.businessType)
        scopedNotices = exactType.length >= 30
            ? exactType
            : allNotices.filter((item) => !item?.businessType || item.businessType === target.businessType)
    }

    const candidates = scopedNotices.map((item) => ({
        notice: item,
        score: similarityScore(item, target),
    }))

    let similar = candidates.filter((item) => item.score > 0)
    if (!similar.length) {
        similar = candidates
    }
    similar.sort((a, b) => b.score - a.score)
    const similarNotices = similar.slice(0, 80).map((item) => item.notice)

    let openingResults = []
    for (const sim of similarNotices) {
        const results = await getOpeningResultsByBidNo(sim.bidNtceNo)
        if (results?.length) openingResults.push(...results)
    }

    let rates = openingResults
        .map((item) => getBidRate(item))
        .filter((value) => value !== null)

    let onDemand = null
    if (rates.length < 3) {
        onDemand = { performed: true, fetchedBids: 0, fetchedOpening: 0 }

        if (bidNtceNo) {
            const current = await fetchOpeningResultsForBid(bidNtceNo, noticeType)
            if (current?.items?.length) {
                onDemand.fetchedBids += 1
                onDemand.fetchedOpening += current.items.length
            }
        }

        const extra = await ensureOpeningResultsForSimilarBids(similarNotices, 5)
        if (extra?.fetchedBids) {
            onDemand.fetchedBids += extra.fetchedBids
            onDemand.fetchedOpening += extra.fetchedOpening || 0
        }

        // refresh opening results after on-demand fetch
        openingResults = []
        for (const sim of similarNotices) {
            const results = await getOpeningResultsByBidNo(sim.bidNtceNo)
            if (results?.length) openingResults.push(...results)
        }

        rates = openingResults
            .map((item) => getBidRate(item))
            .filter((value) => value !== null)

        if (rates.length < 3 && bidNtceNo) {
            const currentResults = await getOpeningResultsByBidNo(bidNtceNo)
            if (currentResults?.length) {
                openingResults.push(...currentResults)
                rates = openingResults
                    .map((item) => getBidRate(item))
                    .filter((value) => value !== null)
            }
        }
    }


    // --- Advanced Analysis Start ---
    // 1. Build Training Set
    const trainingData = await buildTrainingSet()

    // 2. Institution Trends
    const trends = analyzeInstitutionTrends(trainingData)
    const targetInsttName = target.dminsttNm || target.ntceInsttNm
    const insttStats = trends.find(t => t.name === targetInsttName)

    // 3. Regression (Optional - dependent on enough data)
    // const regression = performRegression(trainingData.filter(t => t.meta.dminsttNm === targetInsttName))
    // --- Advanced Analysis End ---

    const distribution = buildDistribution(rates)
    const competitionZones = buildZones(distribution)
    const recommendation = computeRecommendation(rates, insttStats, null)
    const competitors = buildCompetitors(openingResults)

    const totalBidCount = openingResults.length
    const uniqueBids = new Set(openingResults.map((item) => item.bidNtceNo)).size
    const avgParticipants = uniqueBids > 0 ? Math.round(totalBidCount / uniqueBids) : 0

    const minRate = rates.length ? Math.min(...rates) : 0
    const maxRate = rates.length ? Math.max(...rates) : 0
    const avgRate = rates.length ? rates.reduce((acc, v) => acc + v, 0) / rates.length : 0

    const resultData = {
        bidNtceNo: bidNtceNo || notice?.bidNtceNo || null,
        bidNtceNm: targetName || notice?.bidNtceNm || '미상',
        baseAmount: targetBase,
        estimatedParticipants: avgParticipants,
        competitionZones,
        recommendation,
        expectedCompetitors: competitors,
        similarBidsStats: {
            sampleCount: uniqueBids,
            totalSamples: totalBidCount,
            avgBidRate: Number(avgRate.toFixed(2)),
            minBidRate: Number(minRate.toFixed(2)),
            maxBidRate: Number(maxRate.toFixed(2)),
        },
        bidRateDistribution: distribution,
        onDemand,
        advancedStats: {
            institutionTrend: insttStats || null
        }
    }

    if (bidNtceNo) {
        const result = await getBidResultByBidNo(bidNtceNo)
        resultData.latestResult = result || null
    }

    return resultData
}

export default predictBidRange
