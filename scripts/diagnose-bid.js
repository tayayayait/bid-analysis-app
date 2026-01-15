import axios from 'axios'
import fs from 'fs'
import path from 'path'

const cwd = process.cwd()

const loadEnvFile = () => {
    const envPath = path.join(cwd, '.env')
    if (!fs.existsSync(envPath)) return {}
    const content = fs.readFileSync(envPath, 'utf8')
    const lines = content.split(/\r?\n/)
    const env = {}
    for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const idx = trimmed.indexOf('=')
        if (idx === -1) continue
        const key = trimmed.slice(0, idx).trim()
        const value = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '')
        env[key] = value
    }
    return env
}

const envFromFile = loadEnvFile()
const serviceKey =
    process.env.VITE_PUBLIC_DATA_KEY ||
    process.env.PUBLIC_DATA_KEY ||
    process.env.SERVICE_KEY ||
    envFromFile.VITE_PUBLIC_DATA_KEY ||
    envFromFile.PUBLIC_DATA_KEY ||
    envFromFile.SERVICE_KEY ||
    ''

if (!serviceKey) {
    console.error('Missing ServiceKey. Set VITE_PUBLIC_DATA_KEY in .env or environment.')
    process.exit(1)
}

const bidNtceNo = process.argv[2] || 'R26BK01263520'
const encodedKey = serviceKey.includes('%') ? serviceKey : encodeURIComponent(serviceKey)

const pickItems = (data) => {
    const items = data?.response?.body?.items
    if (!items) return []
    if (Array.isArray(items)) return items
    if (Array.isArray(items?.item)) return items.item
    if (items?.item) return [items.item]
    return [items]
}

const toComparableNumber = (value) => {
    if (value === null || value === undefined) return -1
    const num = Number(String(value).replace(/[^\d]/g, ''))
    return Number.isFinite(num) ? num : -1
}

const toDateValue = (value) => {
    if (!value) return 0
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? 0 : value.getTime()
    if (typeof value === 'string') {
        const parsed = new Date(value.replace(' ', 'T'))
        return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime()
    }
    return 0
}

const chooseOpeningParams = (items) => {
    if (!items?.length) return null
    const sorted = [...items].sort((a, b) => {
        const dateDiff = toDateValue(b?.opengDt) - toDateValue(a?.opengDt)
        if (dateDiff !== 0) return dateDiff
        const ordDiff = toComparableNumber(b?.bidNtceOrd) - toComparableNumber(a?.bidNtceOrd)
        if (ordDiff !== 0) return ordDiff
        const clsDiff = toComparableNumber(b?.bidClsfcNo) - toComparableNumber(a?.bidClsfcNo)
        if (clsDiff !== 0) return clsDiff
        return toComparableNumber(b?.rbidNo) - toComparableNumber(a?.rbidNo)
    })
    const picked = sorted[0]
    return {
        bidNtceNo: picked?.bidNtceNo,
        bidNtceOrd: picked?.bidNtceOrd || '000',
        bidClsfcNo: picked?.bidClsfcNo ?? '0',
        rbidNo: picked?.rbidNo ?? '000',
        opengDt: picked?.opengDt,
        prtcptCnum: picked?.prtcptCnum,
    }
}

const callApi = async (pathName, params) => {
    const url = `https://apis.data.go.kr/1230000${pathName}?ServiceKey=${encodedKey}`
    const res = await axios.get(url, {
        params: { type: 'json', ...params },
        timeout: 30000,
        validateStatus: () => true,
    })
    return res.data
}

const logNotice = (type, data) => {
    const header = data?.response?.header
    const body = data?.response?.body
    const items = pickItems(data)
    const sample = items[0]
    console.log(`\n[Notice:${type}] result=${header?.resultCode || '?'} total=${body?.totalCount || 0}`)
    if (sample) {
        console.log(
            `  bidNtceNo=${sample.bidNtceNo} bidNtceNm=${sample.bidNtceNm || '-'} presmptPrce=${sample.presmptPrce || '-'} bdgtAmt=${sample.bdgtAmt || '-'} asignBdgtAmt=${sample.asignBdgtAmt || '-'}`
        )
    }
    return items
}

const logOpeningList = (type, data) => {
    const header = data?.response?.header
    const body = data?.response?.body
    const items = pickItems(data)
    const sample = items[0]
    console.log(`\n[OpeningList:${type}] result=${header?.resultCode || '?'} total=${body?.totalCount || 0}`)
    if (sample) {
        console.log(
            `  bidNtceOrd=${sample.bidNtceOrd || '-'} bidClsfcNo=${sample.bidClsfcNo ?? '-'} rbidNo=${sample.rbidNo || '-'} opengDt=${sample.opengDt || '-'} prtcptCnum=${sample.prtcptCnum || '-'}`
        )
    }
    return items
}

const logOpengCompt = (label, data) => {
    const header = data?.response?.header
    const body = data?.response?.body
    const items = pickItems(data)
    console.log(`\n[OpengCompt:${label}] result=${header?.resultCode || '?'} total=${body?.totalCount || 0}`)
    items.slice(0, 3).forEach((item) => {
        console.log(
            `  rank=${item.opengRank || '-'} name=${item.prcbdrNm || item.prcrmntCorpNm || '-'} bizno=${item.prcbdrBizno || item.bizno || '-'} rate=${item.bidprcrt || item.bidprcRate || '-'}`
        )
    })
    return items
}

const run = async () => {
    console.log(`Diagnose bidNtceNo=${bidNtceNo}`)

    const noticeEndpoints = [
        { type: 'cnstwk', path: '/ad/BidPublicInfoService/getBidPblancListInfoCnstwk' },
        { type: 'thng', path: '/ad/BidPublicInfoService/getBidPblancListInfoThng' },
        { type: 'servc', path: '/ad/BidPublicInfoService/getBidPblancListInfoServc' },
        { type: 'frgcpt', path: '/ad/BidPublicInfoService/getBidPblancListInfoFrgcpt' },
    ]

    const openingEndpoints = [
        { type: 'cnstwk', path: '/as/ScsbidInfoService/getOpengResultListInfoCnstwk' },
        { type: 'thng', path: '/as/ScsbidInfoService/getOpengResultListInfoThng' },
        { type: 'servc', path: '/as/ScsbidInfoService/getOpengResultListInfoServc' },
        { type: 'frgcpt', path: '/as/ScsbidInfoService/getOpengResultListInfoFrgcpt' },
    ]

    const noticeResults = {}
    for (const { type, path: endpoint } of noticeEndpoints) {
        const data = await callApi(endpoint, { inqryDiv: '2', bidNtceNo, pageNo: 1, numOfRows: 1 })
        noticeResults[type] = logNotice(type, data)
    }

    const openingResults = {}
    for (const { type, path: endpoint } of openingEndpoints) {
        const data = await callApi(endpoint, { inqryDiv: '4', bidNtceNo, pageNo: 1, numOfRows: 10 })
        openingResults[type] = logOpeningList(type, data)
    }

    const bestType = Object.keys(openingResults).find((key) => openingResults[key]?.length) ||
        Object.keys(noticeResults).find((key) => noticeResults[key]?.length) ||
        null

    const resolved = bestType ? chooseOpeningParams(openingResults[bestType]) : null

    const defaultOpeng = await callApi('/as/ScsbidInfoService/getOpengResultListInfoOpengCompt', {
        bidNtceNo,
        bidNtceOrd: '000',
        bidClsfcNo: '0',
        rbidNo: '000',
        pageNo: 1,
        numOfRows: 10,
    })
    logOpengCompt('default', defaultOpeng)

    if (resolved) {
        const resolvedOpeng = await callApi('/as/ScsbidInfoService/getOpengResultListInfoOpengCompt', {
            bidNtceNo: resolved.bidNtceNo || bidNtceNo,
            bidNtceOrd: resolved.bidNtceOrd,
            bidClsfcNo: resolved.bidClsfcNo,
            rbidNo: resolved.rbidNo,
            pageNo: 1,
            numOfRows: 10,
        })
        logOpengCompt(`${bestType}:${resolved.bidNtceOrd}/${resolved.bidClsfcNo}/${resolved.rbidNo}`, resolvedOpeng)
    } else {
        console.log('\n[Diagnosis] No opening list results. The bid may not be opened yet.')
    }

    if (!bestType) {
        console.log('[Diagnosis] No notice/opening results found for any business type.')
    } else {
        console.log(`[Diagnosis] Suggested businessType=${bestType}`)
    }
}

run().catch((error) => {
    console.error('Diagnosis failed:', error?.message || error)
    process.exit(1)
})
