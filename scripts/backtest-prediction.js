import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as ss from 'simple-statistics'

const __filename = fileURLToPath(import.meta.url)
const rootDir = path.resolve(path.dirname(__filename), '..')

const args = process.argv.slice(2)
const getArg = (name, fallback = null) => {
    const prefix = `--${name}=`
    const direct = args.find((arg) => arg.startsWith(prefix))
    if (direct) return direct.slice(prefix.length)
    const idx = args.indexOf(`--${name}`)
    if (idx >= 0 && args[idx + 1]) return args[idx + 1]
    return fallback
}

if (args.includes('--help')) {
    console.log(`
Usage: node scripts/backtest-prediction.js [options]

Options:
  --notices <path>      Path to bid notices JSON (default: public/data/seed_bid_notices.json)
  --opening <path>      Path to opening results JSON (default: public/data/seed_opening_results.json)
  --limit <n>           Max number of bids to evaluate (default: all)
  --min-samples <n>     Minimum rate samples for prediction (default: 3)
  --target-hit <rate>   Target hit rate (default: 0.7)
  --max-width <rate>    Max range width in % (default: 0.5)
`)
    process.exit(0)
}

const noticesPath = getArg('notices', path.join(rootDir, 'public/data/seed_bid_notices.json'))
const openingPath = getArg('opening', path.join(rootDir, 'public/data/seed_opening_results.json'))
const limit = Number(getArg('limit', '0'))
const minSamples = Number(getArg('min-samples', '3'))
const targetHitRate = Number(getArg('target-hit', '0.7'))
const maxRangeWidth = Number(getArg('max-width', '0.5'))

const readJson = (filePath) => {
    const resolved = path.isAbsolute(filePath) ? filePath : path.join(rootDir, filePath)
    if (!fs.existsSync(resolved)) {
        throw new Error(`File not found: ${resolved}`)
    }
    const raw = fs.readFileSync(resolved, 'utf8')
    return JSON.parse(raw)
}

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
    const direct = parseNumber(item?.bidprcRate ?? item?.bidprcrt ?? item?.bidprcRt ?? item?.bidprcRate)
    if (direct !== null) return direct
    const parsed = parseOpengCorpInfo(item?.opengCorpInfo)
    return parsed?.bidprcRate ?? null
}

const getBaseAmount = (notice) => (
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

const tokenize = (text) => {
    if (!text) return []
    return String(text)
        .toLowerCase()
        .split(/\s+/)
        .filter((token) => token.length >= 2)
}

const similarityScore = (notice, target) => {
    let score = 0
    const noticeAmount = getBaseAmount(notice)

    if (target.baseAmount && noticeAmount) {
        const ratio = Math.abs(noticeAmount - target.baseAmount) / target.baseAmount
        if (ratio <= 0.1) score += 5
        else if (ratio <= 0.3) score += 3
        else if (ratio <= 0.5) score += 1
        else score -= 2
    }

    if (target.tokens.length && notice?.bidNtceNm) {
        const noticeName = String(notice.bidNtceNm).toLowerCase()
        const hits = target.tokens.filter((token) => noticeName.includes(token)).length
        score += hits * 0.5
    }

    if (target.dminsttNm && notice?.dminsttNm === target.dminsttNm) score += 2
    if (target.ntceInsttNm && notice?.ntceInsttNm === target.ntceInsttNm) score += 1

    if (notice?.bidNtceDt) {
        const date = new Date(notice.bidNtceDt)
        const now = new Date()
        const monthsDiff = (now - date) / (1000 * 60 * 60 * 24 * 30)
        if (monthsDiff <= 3) score += 2
        else if (monthsDiff <= 6) score += 1
        else if (monthsDiff >= 24) score -= 1
    }

    return score
}

const computeRecommendation = (rawRates, options = {}) => {
    const target = Number.isFinite(options.targetHitRate) ? options.targetHitRate : 0.7
    const widthCap = Number.isFinite(options.maxRangeWidth) ? options.maxRangeWidth : 0.5

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

    const q1 = ss.quantile(rawRates, 0.25)
    const q3 = ss.quantile(rawRates, 0.75)
    const iqr = q3 - q1
    const lowerBound = q1 - (1.5 * iqr)
    const upperBound = q3 + (1.5 * iqr)

    const cleanRates = rawRates.filter((r) => r >= lowerBound && r <= upperBound)
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

    const k = Math.max(1, Math.ceil(n * target))
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

    if (finalWidth > widthCap) {
        let right = 0
        let maxCount = 0
        let capMin = sorted[0]
        let capMax = sorted[0]
        let capWidth = 0

        for (let left = 0; left < n; left += 1) {
            if (right < left) right = left
            while (right < n && sorted[right] - sorted[left] <= widthCap) {
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

    const inRange = sorted.filter((v) => v >= finalMin && v <= finalMax)
    const coverageInSample = n > 0 ? inRange.length / n : 0
    const expectedHitRate = coverageInSample
    const recommendedPoint = inRange.length ? ss.median(inRange) : ss.median(sorted)

    let confidenceScore = Math.round(coverageInSample * 100)
    if (n > 30) confidenceScore += 10
    if (n < 10) confidenceScore -= 20
    confidenceScore = Math.max(10, Math.min(95, confidenceScore))

    return {
        optimalRange: {
            min: Number(finalMin.toFixed(4)),
            max: Number(finalMax.toFixed(4)),
        },
        width: Number(finalWidth.toFixed(4)),
        coverageInSample: Number(coverageInSample.toFixed(4)),
        expectedHitRate: Number(expectedHitRate.toFixed(4)),
        recommendedPoint: Number(recommendedPoint.toFixed(4)),
        confidence: confidenceScore,
        reason: '',
    }
}

const normalizeOpeningItems = (raw) => {
    const items = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.items)
            ? raw.items
            : Array.isArray(raw?.response?.body?.items)
                ? raw.response.body.items
                : raw?.response?.body?.items?.item
                    ? raw.response.body.items.item
                    : []

    const normalized = []

    items.forEach((item) => {
        if (!item) return
        if (Array.isArray(item.bids) && item.bids.length) {
            item.bids.forEach((bid) => {
                normalized.push({
                    bidNtceNo: item.bidNtceNo,
                    bidNtceNm: item.bidNtceNm,
                    opengRank: bid.rank,
                    bidprcRate: bid.bidRate,
                    prcrmntCorpNm: bid.bizNm,
                })
            })
            return
        }
        normalized.push(item)
    })

    return normalized
}

const getWinningRate = (items) => {
    if (!items || items.length === 0) return null
    const ranked = items.find((item) => String(item?.opengRank) === '1')
    if (ranked) return getBidRate(ranked)
    const rates = items.map(getBidRate).filter((value) => value !== null)
    if (!rates.length) return null
    return Math.min(...rates)
}

const run = () => {
    const notices = readJson(noticesPath)
    const openingRaw = readJson(openingPath)
    const openingItems = normalizeOpeningItems(openingRaw)

    const noticeMap = new Map()
    notices.forEach((notice) => {
        if (notice?.bidNtceNo) noticeMap.set(notice.bidNtceNo, notice)
    })

    const openingByBid = new Map()
    openingItems.forEach((item) => {
        const bidNo = item?.bidNtceNo
        if (!bidNo) return
        if (!openingByBid.has(bidNo)) openingByBid.set(bidNo, [])
        openingByBid.get(bidNo).push(item)
    })

    const bidNos = Array.from(openingByBid.keys()).filter((bidNo) => noticeMap.has(bidNo))
    const targets = limit > 0 ? bidNos.slice(0, limit) : bidNos

    let evaluated = 0
    let hitCount = 0
    let maeSum = 0
    let widthSum = 0
    let expectedHitSum = 0
    let skippedNoActual = 0
    let skippedNoSamples = 0

    targets.forEach((bidNo) => {
        const notice = noticeMap.get(bidNo)
        const actualRate = getWinningRate(openingByBid.get(bidNo))
        if (actualRate === null || actualRate === undefined) {
            skippedNoActual += 1
            return
        }

        const target = {
            baseAmount: getBaseAmount(notice),
            tokens: tokenize(notice?.bidNtceNm || bidNo),
            dminsttNm: notice?.dminsttNm,
            ntceInsttNm: notice?.ntceInsttNm,
        }

        const candidates = notices
            .filter((item) => item?.bidNtceNo && item.bidNtceNo !== bidNo)
            .map((item) => ({
                notice: item,
                score: similarityScore(item, target),
            }))

        let similar = candidates.filter((item) => item.score > 0)
        if (!similar.length) similar = candidates
        similar.sort((a, b) => b.score - a.score)
        const similarNotices = similar.slice(0, 80).map((item) => item.notice)

        const rates = []
        similarNotices.forEach((sim) => {
            const items = openingByBid.get(sim.bidNtceNo)
            if (!items || !items.length) return
            items.forEach((entry) => {
                const rate = getBidRate(entry)
                if (rate !== null) rates.push(rate)
            })
        })

        if (rates.length < minSamples) {
            skippedNoSamples += 1
            return
        }

        const recommendation = computeRecommendation(rates, { targetHitRate, maxRangeWidth })
        const hit = actualRate >= recommendation.optimalRange.min && actualRate <= recommendation.optimalRange.max

        evaluated += 1
        hitCount += hit ? 1 : 0
        maeSum += Math.abs(recommendation.recommendedPoint - actualRate)
        widthSum += recommendation.width
        expectedHitSum += recommendation.expectedHitRate
    })

    const hitRate = evaluated ? (hitCount / evaluated) : 0
    const mae = evaluated ? (maeSum / evaluated) : 0
    const avgWidth = evaluated ? (widthSum / evaluated) : 0
    const avgExpectedHit = evaluated ? (expectedHitSum / evaluated) : 0

    console.log('Backtest Summary')
    console.log(`- Evaluated bids: ${evaluated}`)
    console.log(`- Hit rate (range): ${(hitRate * 100).toFixed(2)}%`)
    console.log(`- MAE (center): ${mae.toFixed(4)}%`)
    console.log(`- Avg range width: ${avgWidth.toFixed(4)}%`)
    console.log(`- Avg expected hit: ${(avgExpectedHit * 100).toFixed(2)}%`)
    console.log(`- Skipped (no actual winner rate): ${skippedNoActual}`)
    console.log(`- Skipped (insufficient samples): ${skippedNoSamples}`)
    console.log(`- Target hit: ${(targetHitRate * 100).toFixed(1)}%, Width cap: ${maxRangeWidth}%`)
}

run()
