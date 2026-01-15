import { getBidPblancList } from './bidPublicInfoService'
import { getScsbidListSttus, getOpengResultListInfoOpengCompt, getOpengResultListInfoCnstwkPreparPcDetail, resolveOpeningParams } from './scsbidInfoService'
import {
    getCntrctInfoListThng,
    getCntrctInfoListThngDetail,
    getCntrctInfoListCnstwk,
    getCntrctInfoListCnstwkServcInfo,
    getCntrctInfoListServc,
    getCntrctInfoListGnrlServcServcInfo,
    getCntrctInfoListTechServcServcInfo,
    getCntrctInfoListFrgcpt,
    getCntrctInfoListFrgcptDetail,
} from './cntrctInfoService'
import {
    getPrcrmntCorpBasicInfo02,
    getPrcrmntCorpIndstrytyInfo02,
    getPrcrmntCorpSplyPrdctInfo02,
    getUnptRsttCorpInfo02,
    getDminsttInfo02,
} from './usrInfoService'
import {
    saveBidNotices,
    saveBidResults,
    saveOpeningResults,
    savePreparPrices,
    saveContracts,
    saveContractDetails,
    saveCompanies,
    saveCompanyIndustries,
    saveCompanyProducts,
    saveCompanyPenalties,
    saveDemandInstitutions,
    saveSyncState,
    getSyncState,
} from './db'

const BUSINESS_TYPES = ['cnstwk', 'thng', 'servc', 'frgcpt']
const DEFAULT_COMPETITOR_LOOKBACK_YEARS = 3

const toArray = (items) => {
    if (!items) return []
    return Array.isArray(items) ? items : [items]
}

const attachBusinessType = (items, businessType) =>
    toArray(items).map((item) => ({
        ...item,
        businessType: item?.businessType ?? businessType,
    }))

const isBlank = (value) => value === null || value === undefined || String(value).trim() === ''

const parseNumber = (value) => {
    if (value === null || value === undefined) return null
    if (typeof value === 'number') return Number.isFinite(value) ? value : null
    const cleaned = String(value).replace(/,/g, '').replace('%', '').trim()
    const num = Number(cleaned)
    return Number.isFinite(num) ? num : null
}

const getBidRate = (item) => parseNumber(item?.bidprcRate ?? item?.bidprcrt)

const summarizeOpeningItems = (items) => {
    const stats = {
        total: items.length,
        missingRate: 0,
        zeroRate: 0,
        missingBizno: 0,
        missingName: 0,
        emptyBids: 0,
    }

    if (!items.length) return stats

    items.forEach((item) => {
        const rate = getBidRate(item)
        if (rate === null) stats.missingRate += 1
        else if (rate === 0) stats.zeroRate += 1

        if (isBlank(item?.bizno)) stats.missingBizno += 1
        if (isBlank(item?.prcrmntCorpNm)) stats.missingName += 1
    })

    return stats
}

const logOpeningValidation = (stats, context, updateProgress) => {
    if (!stats?.total) {
        const emptyBids = Number.isFinite(stats?.emptyBids) ? stats.emptyBids : 0
        if (emptyBids > 0) {
            const label = context?.bidNtceNo ? ` bidNtceNo=${context.bidNtceNo}` : ''
            const message = `opening_results_validation${label}: emptyBids ${emptyBids} (no opening items)`
            console.warn('[Sync]', message)
            if (updateProgress) updateProgress(0, { step: message, type: context?.type })
        }
        return
    }
    const missingPct = Math.round((stats.missingRate / stats.total) * 100)
    const zeroPct = Math.round((stats.zeroRate / stats.total) * 100)
    const emptyBids = Number.isFinite(stats.emptyBids) ? stats.emptyBids : 0
    const label = context?.bidNtceNo ? ` bidNtceNo=${context.bidNtceNo}` : ''
    const message = `opening_results_validation${label}: missingRate ${stats.missingRate}/${stats.total} (${missingPct}%), zeroRate ${stats.zeroRate}/${stats.total} (${zeroPct}%), missingBizno ${stats.missingBizno}/${stats.total}, emptyBids ${emptyBids}`

    console.warn('[Sync]', message)
    if (updateProgress) updateProgress(0, { step: message, type: context?.type })
}

const normalizeBusinessTypes = (types) => {
    if (!types || types.length === 0) return BUSINESS_TYPES
    return Array.isArray(types) ? types : [types]
}

const toDateOnly = (value) => {
    if (!value) return null
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return null
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
}

const formatDateParam = (date, isEnd = false) => {
    if (!date) return undefined
    const d = new Date(date)
    if (Number.isNaN(d.getTime())) return undefined
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const time = isEnd ? '2359' : '0000'
    return `${year}${month}${day}${time}`
}

const buildContractRangeParams = (startDate, endDate) => ({
    inqryDiv: '1',
    inqryBgnDt: formatDateParam(startDate),
    inqryEndDt: formatDateParam(endDate, true),
})

const maxDate = (a, b) => {
    if (!a) return b
    if (!b) return a
    return new Date(a) > new Date(b) ? a : b
}

const getIncrementalRange = async (startDate, endDate, key) => {
    const state = await getSyncState(key)
    if (!state?.value?.lastSyncedAt) return { startDate, endDate }
    const lastSynced = toDateOnly(state.value.lastSyncedAt)
    if (!lastSynced) return { startDate, endDate }
    const normalizedStart = maxDate(startDate, lastSynced)
    return { startDate: normalizedStart, endDate }
}

const markSynced = async (key, extra = {}) => {
    await saveSyncState(key, {
        lastSyncedAt: new Date().toISOString(),
        ...extra,
    })
}

const makeId = (parts) => parts.filter(Boolean).join('|')

const addIds = (items, getId) => {
    return items.map((item) => ({
        ...item,
        id: item.id ?? getId(item),
    }))
}

const resolveCompetitorRange = (startDate, endDate) => {
    if (startDate && endDate) {
        return {
            startDate: toDateOnly(startDate),
            endDate: toDateOnly(endDate),
        }
    }
    const end = new Date()
    const start = new Date(end)
    start.setFullYear(end.getFullYear() - DEFAULT_COMPETITOR_LOOKBACK_YEARS)
    return {
        startDate: toDateOnly(start),
        endDate: toDateOnly(end),
    }
}

const getMonthlyChunks = (startDate, endDate) => {
    if (!startDate || !endDate) return []
    const start = new Date(`${startDate}T00:00:00`)
    const end = new Date(`${endDate}T00:00:00`)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [{ startDate, endDate }]
    if (start > end) return []

    const chunks = []
    let currentStart = new Date(start)
    while (currentStart <= end) {
        const year = currentStart.getFullYear()
        const month = currentStart.getMonth()
        const monthEnd = new Date(year, month + 1, 0)
        const effectiveEnd = monthEnd > end ? end : monthEnd
        chunks.push({
            startDate: toDateOnly(currentStart),
            endDate: toDateOnly(effectiveEnd),
        })
        currentStart = new Date(year, month + 1, 1)
    }

    return chunks
}

const fetchAllPages = async (fetchPage, params, onPage) => {
    const first = await fetchPage({ ...params, pageNo: 1 })
    const totalCount = first?.totalCount || 0
    const firstItems = toArray(first?.items)
    if (onPage) await onPage(firstItems, 1, totalCount)

    const numOfRows = params.numOfRows || 100
    const totalPages = Math.ceil(totalCount / numOfRows)
    for (let pageNo = 2; pageNo <= totalPages; pageNo += 1) {
        const page = await fetchPage({ ...params, pageNo })
        const items = toArray(page?.items)
        if (onPage) await onPage(items, pageNo, totalCount)
    }
}

const contractFetchers = {
    cnstwk: {
        list: getCntrctInfoListCnstwk,
        detail: getCntrctInfoListCnstwkServcInfo,
    },
    thng: {
        list: getCntrctInfoListThng,
        detail: getCntrctInfoListThngDetail,
    },
    servc: {
        list: getCntrctInfoListServc,
        detail: [getCntrctInfoListGnrlServcServcInfo, getCntrctInfoListTechServcServcInfo],
    },
    frgcpt: {
        list: getCntrctInfoListFrgcpt,
        detail: getCntrctInfoListFrgcptDetail,
    },
}

/**
 * Full sync pipeline
 * @param {Object} options
 * @param {string} options.startDate YYYY-MM-DD
 * @param {string} options.endDate YYYY-MM-DD
 * @param {Array<string>} options.businessTypes
 * @param {boolean} options.incremental
 * @param {function} options.onProgress (current, total, meta) => void
 * @param {function} options.onError (error, meta) => void
 */
export async function syncAllData(options = {}) {
    const {
        startDate,
        endDate,
        businessTypes,
        incremental = false,
        onProgress,
        onError,
        targets = {},
    } = options

    const targetFlags = {
        notices: true,
        results: true,
        opening: true,
        contracts: false,
        companies: false, // MVP: 상세 업체 정보 수집 중단 (경쟁사 분석 제외)
        ...targets,
    }

    const types = normalizeBusinessTypes(businessTypes)
    let current = 0
    let total = 0
    const openingAuditByType = new Map()

    const updateProgress = (delta, meta) => {
        current += delta
        if (onProgress) onProgress(current, total, meta)
    }

    for (const type of types) {
        const syncKey = `sync:${type}:all`
        const range = incremental ? await getIncrementalRange(startDate, endDate, syncKey) : { startDate, endDate }

        const resultRefs = []
        const biznoSet = new Set()
        const dminsttSet = new Set()
        openingAuditByType.set(type, {
            total: 0,
            missingRate: 0,
            zeroRate: 0,
            missingBizno: 0,
            missingName: 0,
            emptyBids: 0,
        })

        // 1) bid notices
        if (targetFlags.notices) {
            try {
                await fetchAllPages(
                    (params) => getBidPblancList(type, params),
                    { startDate: range.startDate, endDate: range.endDate, numOfRows: 100 },
                    async (items, _pageNo, pageTotal) => {
                        if (pageTotal > total) total = pageTotal
                        if (items.length > 0) {
                            await saveBidNotices(attachBusinessType(items, type))
                            updateProgress(items.length, { step: 'bid_notices', type })
                        }
                    }
                )
            } catch (error) {
                if (error.message && error.message.includes('FATAL_SYNC_ERROR')) throw error
                if (onError) onError(error, { step: 'bid_notices', type })
            }
        }

        // 2) bid results (also used for opening/company enrichment)
        if (targetFlags.results || targetFlags.opening || targetFlags.companies) {
            try {
                await fetchAllPages(
                    (params) => getScsbidListSttus(type, params),
                    { startDate: range.startDate, endDate: range.endDate, numOfRows: 100 },
                    async (items, _pageNo, pageTotal) => {
                        if (pageTotal > total) total = Math.max(total, current + pageTotal)
                        if (items.length > 0) {
                            if (targetFlags.results) {
                                await saveBidResults(items)
                                updateProgress(items.length, { step: 'bid_results', type })
                            }
                            items.forEach((item) => {
                                if (item?.bidNtceNo) {
                                    resultRefs.push({
                                        bidNtceNo: item.bidNtceNo,
                                        bidNtceOrd: item.bidNtceOrd,
                                        bidClsfcNo: item.bidClsfcNo,
                                        rbidNo: item.rbidNo,
                                    })
                                }
                                if (item?.bidwinnrBizno) biznoSet.add(item.bidwinnrBizno)
                                if (item?.bizno) biznoSet.add(item.bizno)
                                if (item?.dminsttCd) dminsttSet.add(item.dminsttCd)
                            })
                        }
                    }
                )
            } catch (error) {
                if (error.message && error.message.includes('FATAL_SYNC_ERROR')) throw error
                if (onError) onError(error, { step: 'bid_results', type })
            }
        }

        // 3) opening results (per bid)
        if (targetFlags.opening) {
            try {
                for (const result of resultRefs) {
                    if (!result?.bidNtceNo) continue
                    const bidNtceOrd = result.bidNtceOrd || '000'
                    let opening = await getOpengResultListInfoOpengCompt({
                        bidNtceNo: result.bidNtceNo,
                        bidNtceOrd,
                        bidClsfcNo: result.bidClsfcNo,
                        rbidNo: result.rbidNo,
                        pageNo: 1,
                        numOfRows: 100,
                    })
                    if (!opening?.items?.length) {
                        const resolved = await resolveOpeningParams(type, result.bidNtceNo)
                        if (resolved) {
                            opening = await getOpengResultListInfoOpengCompt({
                                bidNtceNo: resolved.bidNtceNo,
                                bidNtceOrd: resolved.bidNtceOrd,
                                bidClsfcNo: resolved.bidClsfcNo,
                                rbidNo: resolved.rbidNo,
                                pageNo: 1,
                                numOfRows: 100,
                            })
                        }
                    }
                    const openingItems = addIds(toArray(opening?.items), (item) =>
                        makeId([item.bidNtceNo, item.bidNtceOrd, item.opengRank, item.bizno || item.prcrmntCorpNm])
                    )
                    if (openingItems.length > 0) {
                        const stats = summarizeOpeningItems(openingItems)
                        const audit = openingAuditByType.get(type)
                        if (audit) {
                            audit.total += stats.total
                            audit.missingRate += stats.missingRate
                            audit.zeroRate += stats.zeroRate
                            audit.missingBizno += stats.missingBizno
                            audit.missingName += stats.missingName
                        }

                        if (stats.missingRate === stats.total || stats.missingRate / stats.total >= 0.5) {
                            logOpeningValidation(stats, { type, bidNtceNo: result.bidNtceNo }, updateProgress)
                        }

                        await saveOpeningResults(openingItems)
                        updateProgress(openingItems.length, { step: 'opening_results', type })
                    } else {
                        const audit = openingAuditByType.get(type)
                        if (audit) audit.emptyBids += 1
                    }

                    if (type === 'cnstwk') {
                        const prepar = await getOpengResultListInfoCnstwkPreparPcDetail({
                            bidNtceNo: result.bidNtceNo,
                            bidNtceOrd,
                            pageNo: 1,
                            numOfRows: 15,
                        })
                        const preparItems = addIds(toArray(prepar?.items), (item) =>
                            makeId([item.bidNtceNo, item.bidNtceOrd, item.preparPcNo])
                        )
                        if (preparItems.length > 0) {
                            await savePreparPrices(preparItems)
                            updateProgress(preparItems.length, { step: 'prepar_prices', type })
                        }
                    }
                }
            } catch (error) {
                if (error.message && error.message.includes('FATAL_SYNC_ERROR')) throw error
                if (onError) onError(error, { step: 'opening_results', type })
            }
        }

        const openingAudit = openingAuditByType.get(type)
        if ((openingAudit?.total && (openingAudit.missingRate > 0 || openingAudit.zeroRate > 0 || openingAudit.missingBizno > 0)) || openingAudit?.emptyBids > 0) {
            logOpeningValidation(openingAudit, { type }, updateProgress)
        }

        // 4) contract info by date range
        if (targetFlags.contracts) {
            try {
                const contractFetcher = contractFetchers[type]
                if (contractFetcher?.list) {
                    await fetchAllPages(
                        (params) => contractFetcher.list(params),
                        { ...buildContractRangeParams(range.startDate, range.endDate), numOfRows: 100 },
                        async (items, _pageNo, pageTotal) => {
                            if (pageTotal > total) total = Math.max(total, current + pageTotal)
                            if (items.length > 0) {
                                const normalized = addIds(items, (item) =>
                                    makeId([item.cntrctNo, item.untyCntrctNo, item.cntrctRefNo, item.bidNtceNo])
                                ).map((item) => ({
                                    ...item,
                                    cntrctType: type,
                                }))
                                await saveContracts(normalized)
                                updateProgress(items.length, { step: 'contracts', type })
                            }
                        }
                    )
                }
            } catch (error) {
                if (error.message && error.message.includes('FATAL_SYNC_ERROR')) throw error
                if (onError) onError(error, { step: 'contracts', type })
            }
        }

        // 5) contract details (best-effort)
        if (targetFlags.contracts) {
            try {
                const contractFetcher = contractFetchers[type]
                if (contractFetcher?.detail) {
                    const detailFns = Array.isArray(contractFetcher.detail) ? contractFetcher.detail : [contractFetcher.detail]
                    const contractList = await contractFetcher.list({
                        ...buildContractRangeParams(range.startDate, range.endDate),
                        pageNo: 1,
                        numOfRows: 100,
                    })
                    const contracts = toArray(contractList?.items)
                    for (const contract of contracts) {
                        const cntrctNo = contract.untyCntrctNo || contract.cntrctNo || contract.cntrctRefNo
                        if (!cntrctNo) continue
                        for (const detailFn of detailFns) {
                            const detail = await detailFn({ untyCntrctNo: cntrctNo, cntrctNo })
                            const detailItems = addIds(toArray(detail?.items), (item) =>
                                makeId([item.untyCntrctNo, item.cntrctNo, item.bidNtceNo, item.prdctNo, item.indstrytyCd])
                            )
                            if (detailItems.length > 0) {
                                await saveContractDetails(detailItems)
                                updateProgress(detailItems.length, { step: 'contract_details', type })
                            }
                        }
                    }
                }
            } catch (error) {
                if (error.message && error.message.includes('FATAL_SYNC_ERROR')) throw error
                if (onError) onError(error, { step: 'contract_details', type })
            }
        }

        // 6) company info enrichment (best-effort)
        // 6) company info enrichment (best-effort) - MVP 범위 제외 (UsrInfoService 500 에러 방지 및 필요성 낮음)
        /*
        if (targetFlags.companies) {
            try {
                for (const bizno of biznoSet) {
                    const company = await getPrcrmntCorpBasicInfo02({ bizno, pageNo: 1, numOfRows: 10 })
                    const companyItems = toArray(company?.items)
                    if (companyItems.length > 0) {
                        await saveCompanies(companyItems)
                        updateProgress(companyItems.length, { step: 'companies', type })
                    }

                    const industries = await getPrcrmntCorpIndstrytyInfo02({ bizno, pageNo: 1, numOfRows: 50 })
                    const industryItems = addIds(toArray(industries?.items), (item) =>
                        makeId([item.bizno, item.indstrytyCd, item.rgstDt])
                    )
                    if (industryItems.length > 0) {
                        await saveCompanyIndustries(industryItems)
                        updateProgress(industryItems.length, { step: 'company_industries', type })
                    }

                    const products = await getPrcrmntCorpSplyPrdctInfo02({ bizno, pageNo: 1, numOfRows: 50 })
                    const productItems = addIds(toArray(products?.items), (item) =>
                        makeId([item.bizno, item.prdctNo, item.rgstDt])
                    )
                    if (productItems.length > 0) {
                        await saveCompanyProducts(productItems)
                        updateProgress(productItems.length, { step: 'company_products', type })
                    }

                    const penalties = await getUnptRsttCorpInfo02({ bizno, pageNo: 1, numOfRows: 50 })
                    const penaltyItems = addIds(toArray(penalties?.items), (item) =>
                        makeId([item.bizno, item.rsttBgnDt, item.rsttEndDt])
                    )
                    if (penaltyItems.length > 0) {
                        await saveCompanyPenalties(penaltyItems)
                        updateProgress(penaltyItems.length, { step: 'company_penalties', type })
                    }
                }

                for (const dminsttCd of dminsttSet) {
                    const dminstt = await getDminsttInfo02({ dminsttCd, pageNo: 1, numOfRows: 10 })
                    const dminsttItems = toArray(dminstt?.items)
                    if (dminsttItems.length > 0) {
                        await saveDemandInstitutions(dminsttItems)
                        updateProgress(dminsttItems.length, { step: 'demand_institutions', type })
                    }
                }
            } catch (error) {
                if (error.message && error.message.includes('FATAL_SYNC_ERROR')) throw error
                if (onError) onError(error, { step: 'company_enrichment', type })
            }
        }
        */

        await markSynced(syncKey, { startDate: range.startDate, endDate: range.endDate })
    }
}

/**
 * Re-sync opening results for a given date range.
 * @param {Object} options
 * @param {string} options.startDate YYYY-MM-DD
 * @param {string} options.endDate YYYY-MM-DD
 * @param {Array<string>} options.businessTypes
 * @param {function} options.onProgress (current, total, meta) => void
 * @param {function} options.onError (error, meta) => void
 */
export async function resyncOpeningResults(options = {}) {
    const {
        startDate,
        endDate,
        businessTypes,
        onProgress,
        onError,
    } = options

    const types = normalizeBusinessTypes(businessTypes)
    let current = 0
    let total = 0

    const updateProgress = (delta, meta) => {
        current += delta
        if (onProgress) onProgress(current, total, meta)
    }

    for (const type of types) {
        const resultRefs = []

        try {
            await fetchAllPages(
                (params) => getScsbidListSttus(type, params),
                { startDate, endDate, numOfRows: 100 },
                async (items, _pageNo, pageTotal) => {
                    if (pageTotal > total) total = Math.max(total, current + pageTotal)
                    if (items.length > 0) {
                        items.forEach((item) => {
                            if (item?.bidNtceNo) {
                                resultRefs.push({
                                    bidNtceNo: item.bidNtceNo,
                                    bidNtceOrd: item.bidNtceOrd,
                                    bidClsfcNo: item.bidClsfcNo,
                                    rbidNo: item.rbidNo,
                                })
                            }
                        })
                    }
                }
            )
        } catch (error) {
            if (onError) onError(error, { step: 'bid_results', type })
        }

        for (const result of resultRefs) {
            try {
                if (!result?.bidNtceNo) continue
                const bidNtceOrd = result.bidNtceOrd || '000'

                let opening = await getOpengResultListInfoOpengCompt({
                    bidNtceNo: result.bidNtceNo,
                    bidNtceOrd,
                    bidClsfcNo: result.bidClsfcNo,
                    rbidNo: result.rbidNo,
                    pageNo: 1,
                    numOfRows: 100,
                })

                if (!opening?.items?.length) {
                    const resolved = await resolveOpeningParams(type, result.bidNtceNo)
                    if (resolved) {
                        opening = await getOpengResultListInfoOpengCompt({
                            bidNtceNo: resolved.bidNtceNo,
                            bidNtceOrd: resolved.bidNtceOrd,
                            bidClsfcNo: resolved.bidClsfcNo,
                            rbidNo: resolved.rbidNo,
                            pageNo: 1,
                            numOfRows: 100,
                        })
                    }
                }

                const openingItems = addIds(toArray(opening?.items), (item) =>
                    makeId([item.bidNtceNo, item.bidNtceOrd, item.opengRank, item.bizno || item.prcrmntCorpNm])
                )

                if (openingItems.length > 0) {
                    await saveOpeningResults(openingItems)
                    updateProgress(openingItems.length, { step: 'opening_results_resync', type })
                } else {
                    updateProgress(0, { step: 'opening_results_empty', type })
                }
            } catch (error) {
                if (onError) onError(error, { step: 'opening_results', type })
            }
        }
    }
}

/**
 * Sync competitor-specific data on demand.
 * Fetches bid results by bizno, opening results by bid, related notices, and company details.
 * @param {Object} options
 * @param {string} options.bizno
 * @param {string} [options.startDate] YYYY-MM-DD
 * @param {string} [options.endDate] YYYY-MM-DD
 * @param {Array<string>} [options.businessTypes]
 * @param {function} [options.onProgress]
 * @param {function} [options.onError]
 */
export async function syncCompetitorData(options = {}) {
    const { bizno, startDate, endDate, businessTypes, onProgress, onError } = options
    if (!bizno) {
        throw new Error('사업자번호가 필요합니다.')
    }

    const types = normalizeBusinessTypes(businessTypes)
    const range = resolveCompetitorRange(startDate, endDate)
    const rangeChunks = getMonthlyChunks(range.startDate, range.endDate)
    const resultRefsByType = new Map()
    const bidNtceByType = new Map()
    const openedKeys = new Set()
    let current = 0
    const openingAuditByType = new Map()
    const errors = []

    const updateProgress = (delta, meta) => {
        current += delta
        if (onProgress) onProgress(current, meta)
    }

    // 1) Bid results by bizno (collect bid references)
    for (const type of types) {
        try {
            const resultRefs = []
            const bidNtceNos = new Set()
            for (const chunk of rangeChunks) {
                const chunkLabel = `${chunk.startDate} ~ ${chunk.endDate}`
                try {
                    await fetchAllPages(
                        (params) => getScsbidListSttus(type, params),
                        { startDate: chunk.startDate, endDate: chunk.endDate, numOfRows: 100, bizno },
                        async (items) => {
                            if (items.length > 0) {
                                await saveBidResults(items)
                                updateProgress(items.length, { step: 'bid_results', type, chunk: chunkLabel })
                                items.forEach((item) => {
                                    if (item?.bidNtceNo) {
                                        resultRefs.push({
                                            bidNtceNo: item.bidNtceNo,
                                            bidNtceOrd: item.bidNtceOrd,
                                            bidClsfcNo: item.bidClsfcNo,
                                            rbidNo: item.rbidNo,
                                        })
                                        bidNtceNos.add(item.bidNtceNo)
                                    }
                                })
                            }
                        }
                    )
                } catch (error) {
                    errors.push({ error, meta: { step: 'bid_results', type, chunk: chunkLabel } })
                    if (onError) onError(error, { step: 'bid_results', type, chunk: chunkLabel })
                }
            }
            if (resultRefs.length > 0) resultRefsByType.set(type, resultRefs)
            if (bidNtceNos.size > 0) bidNtceByType.set(type, bidNtceNos)
        } catch (error) {
            errors.push({ error, meta: { step: 'bid_results', type } })
            if (onError) onError(error, { step: 'bid_results', type })
        }
    }

    // 2) Opening results per bid
    for (const [type, resultRefs] of resultRefsByType.entries()) {
        try {
            if (!openingAuditByType.has(type)) {
                openingAuditByType.set(type, {
                    total: 0,
                    missingRate: 0,
                    zeroRate: 0,
                    missingBizno: 0,
                    missingName: 0,
                    emptyBids: 0,
                })
            }
            for (const result of resultRefs) {
                if (!result?.bidNtceNo) continue
                const bidNtceOrd = result.bidNtceOrd || '000'
                const key = `${result.bidNtceNo}|${bidNtceOrd}`
                if (openedKeys.has(key)) continue
                openedKeys.add(key)

                let opening = await getOpengResultListInfoOpengCompt({
                    bidNtceNo: result.bidNtceNo,
                    bidNtceOrd,
                    bidClsfcNo: result.bidClsfcNo,
                    rbidNo: result.rbidNo,
                    pageNo: 1,
                    numOfRows: 100,
                })
                if (!opening?.items?.length) {
                    const resolved = await resolveOpeningParams(type, result.bidNtceNo)
                    if (resolved) {
                        opening = await getOpengResultListInfoOpengCompt({
                            bidNtceNo: resolved.bidNtceNo,
                            bidNtceOrd: resolved.bidNtceOrd,
                            bidClsfcNo: resolved.bidClsfcNo,
                            rbidNo: resolved.rbidNo,
                            pageNo: 1,
                            numOfRows: 100,
                        })
                    }
                }
                const openingItems = addIds(toArray(opening?.items), (item) =>
                    makeId([item.bidNtceNo, item.bidNtceOrd, item.opengRank, item.bizno || item.prcrmntCorpNm])
                )
                if (openingItems.length > 0) {
                    const stats = summarizeOpeningItems(openingItems)
                    const audit = openingAuditByType.get(type)
                    if (audit) {
                        audit.total += stats.total
                        audit.missingRate += stats.missingRate
                        audit.zeroRate += stats.zeroRate
                        audit.missingBizno += stats.missingBizno
                        audit.missingName += stats.missingName
                    }

                    if (stats.missingRate === stats.total || stats.missingRate / stats.total >= 0.5) {
                        logOpeningValidation(stats, { type, bidNtceNo: result.bidNtceNo }, updateProgress)
                    }

                    await saveOpeningResults(openingItems)
                    updateProgress(openingItems.length, { step: 'opening_results', type })
                } else {
                    const audit = openingAuditByType.get(type)
                    if (audit) audit.emptyBids += 1
                }
            }
        } catch (error) {
            errors.push({ error, meta: { step: 'opening_results', type } })
            if (onError) onError(error, { step: 'opening_results', type })
        }
    }

    for (const [type, audit] of openingAuditByType.entries()) {
        if ((audit?.total && (audit.missingRate > 0 || audit.zeroRate > 0 || audit.missingBizno > 0)) || audit?.emptyBids > 0) {
            logOpeningValidation(audit, { type }, updateProgress)
        }
    }

    // 3) Bid notices for mapping bid names
    for (const [type, bidNtceNos] of bidNtceByType.entries()) {
        try {
            for (const bidNtceNo of bidNtceNos) {
                const notice = await getBidPblancList(type, { bidNtceNo, pageNo: 1, numOfRows: 1 })
                const noticeItems = toArray(notice?.items)
                if (noticeItems.length > 0) {
                    await saveBidNotices(attachBusinessType(noticeItems, type))
                    updateProgress(noticeItems.length, { step: 'bid_notices', type })
                }
            }
        } catch (error) {
            errors.push({ error, meta: { step: 'bid_notices', type } })
            if (onError) onError(error, { step: 'bid_notices', type })
        }
    }

    // 4) Company details (basic + industries/products/penalties)
    try {
        const company = await getPrcrmntCorpBasicInfo02({ bizno, pageNo: 1, numOfRows: 10 })
        const companyItems = toArray(company?.items)
        if (companyItems.length > 0) {
            await saveCompanies(companyItems)
            updateProgress(companyItems.length, { step: 'companies' })
        }

        const industries = await getPrcrmntCorpIndstrytyInfo02({ bizno, pageNo: 1, numOfRows: 50 })
        const industryItems = addIds(toArray(industries?.items), (item) =>
            makeId([item.bizno, item.indstrytyCd, item.rgstDt])
        )
        if (industryItems.length > 0) {
            await saveCompanyIndustries(industryItems)
            updateProgress(industryItems.length, { step: 'company_industries' })
        }

        const products = await getPrcrmntCorpSplyPrdctInfo02({ bizno, pageNo: 1, numOfRows: 50 })
        const productItems = addIds(toArray(products?.items), (item) =>
            makeId([item.bizno, item.prdctNo, item.rgstDt])
        )
        if (productItems.length > 0) {
            await saveCompanyProducts(productItems)
            updateProgress(productItems.length, { step: 'company_products' })
        }

        const penalties = await getUnptRsttCorpInfo02({ bizno, pageNo: 1, numOfRows: 50 })
        const penaltyItems = addIds(toArray(penalties?.items), (item) =>
            makeId([item.bizno, item.rsttBgnDt, item.rsttEndDt])
        )
        if (penaltyItems.length > 0) {
            await saveCompanyPenalties(penaltyItems)
            updateProgress(penaltyItems.length, { step: 'company_penalties' })
        }
    } catch (error) {
        errors.push({ error, meta: { step: 'company_enrichment' } })
        if (onError) onError(error, { step: 'company_enrichment' })
    }

    const criticalErrors = errors.filter(e => e.meta?.step !== 'company_enrichment')
    if (resultRefsByType.size === 0 && criticalErrors.length > 0) {
        const first = criticalErrors[0]
        const metaLabel = first?.meta?.chunk ? ` (${first.meta.chunk})` : ''
        throw new Error(`업체 데이터 동기화에 실패했습니다: ${first?.error?.message || 'unknown error'}${metaLabel}`)
    }
}

/**
 * Backward-compatible single-step sync for notices only.
 */
export async function syncBidNotices(startDate, endDate, onProgress, businessTypes = ['cnstwk']) {
    const types = normalizeBusinessTypes(businessTypes)
    let current = 0
    let total = 0
    const updateProgress = (delta, meta) => {
        current += delta
        if (onProgress) onProgress(current, total, meta)
    }

    for (const type of types) {
        await fetchAllPages(
            (params) => getBidPblancList(type, params),
            { startDate, endDate, numOfRows: 100 },
            async (items, _pageNo, pageTotal) => {
                if (pageTotal > total) total = Math.max(total, pageTotal)
                if (items.length > 0) {
                    await saveBidNotices(attachBusinessType(items, type))
                    updateProgress(items.length, { step: 'bid_notices', type })
                }
            }
        )
    }
}
/**
 * Syncs data over a large date range by splitting it into monthly chunks.
 * This prevents API timeouts and provides better progress feedback.
 */
export async function syncLargeRange(options) {
    const { startDate, endDate, onProgress, onError, ...rest } = options
    const start = new Date(startDate)
    const end = new Date(endDate)
    let currentStart = new Date(start)

    while (currentStart <= end) {
        // Calculate chunk end (end of month or global end date)
        const year = currentStart.getFullYear()
        const month = currentStart.getMonth()
        const chunkEnd = new Date(year, month + 1, 0) // Last day of current month
        const effectiveEnd = chunkEnd > end ? end : chunkEnd

        const chunkStartStr = toDateOnly(currentStart)
        const chunkEndStr = toDateOnly(effectiveEnd)

        // Call syncAllData for this chunk
        await syncAllData({
            ...rest,
            startDate: chunkStartStr,
            endDate: chunkEndStr,
            onProgress: (current, total, meta) => {
                if (onProgress) {
                    // Enrich meta with chunk info
                    onProgress(current, total, { ...meta, chunk: `${chunkStartStr} ~ ${chunkEndStr}` })
                }
            },
            onError: (err) => {
                if (onError) onError(err)
            },
        })

        // Move to next month
        currentStart = new Date(year, month + 1, 1)
    }
}
