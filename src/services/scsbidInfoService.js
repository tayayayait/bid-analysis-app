/**
 * 낙찰정보서비스 API
 * 낙찰 결과 및 개찰 상세 조회
 */
import { callApi } from './api'

const SERVICE_PATH = '/as/ScsbidInfoService'
const DEFAULT_CALL_OPTIONS = { retry: 2, retryDelay: 800, throttleMs: 200 }

const isBlank = (value) => value === null || value === undefined || String(value).trim() === ''

const parseOpengCorpInfo = (value) => {
    if (!value || typeof value !== 'string') return null
    const parts = value.split('^').map((part) => part.trim())
    if (parts.length < 2) return null

    const [prcrmntCorpNm, bizno, ceoNm, bidprcAmt, bidprcRate] = parts
    return {
        prcrmntCorpNm: prcrmntCorpNm || undefined,
        bizno: bizno || undefined,
        ceoNm: ceoNm || undefined,
        bidprcAmt: bidprcAmt || undefined,
        bidprcRate: bidprcRate || undefined,
    }
}

const normalizeOpeningItems = (items) => {
    const list = Array.isArray(items)
        ? items
        : Array.isArray(items?.item)
            ? items.item
            : items?.item
                ? [items.item]
                : items
                    ? [items]
                    : []

    return list.map((item) => {
        if (!item) return item
        const parsed = parseOpengCorpInfo(item.opengCorpInfo)

        const normalized = {
            ...item,
            bidprcRate: isBlank(item.bidprcRate) && !isBlank(item.bidprcrt) ? item.bidprcrt : item.bidprcRate,
            bizno: isBlank(item.bizno) && !isBlank(item.prcbdrBizno) ? item.prcbdrBizno : item.bizno,
            prcrmntCorpNm: isBlank(item.prcrmntCorpNm) && !isBlank(item.prcbdrNm) ? item.prcbdrNm : item.prcrmntCorpNm,
            bidderCeoNm: isBlank(item.bidderCeoNm) && !isBlank(item.prcbdrCeoNm) ? item.prcbdrCeoNm : item.bidderCeoNm,
        }

        if (isBlank(normalized.bidprcRate) && !isBlank(item.bidprcRt)) {
            normalized.bidprcRate = item.bidprcRt
        }

        if (!parsed) return normalized

        return {
            ...normalized,
            prcrmntCorpNm: isBlank(normalized.prcrmntCorpNm) ? parsed.prcrmntCorpNm : normalized.prcrmntCorpNm,
            bizno: isBlank(normalized.bizno) ? parsed.bizno : normalized.bizno,
            bidprcAmt: normalized.bidprcAmt ?? parsed.bidprcAmt,
            bidprcRate: normalized.bidprcRate ?? parsed.bidprcRate,
            bidderCeoNm: isBlank(normalized.bidderCeoNm) ? parsed.ceoNm : normalized.bidderCeoNm,
        }
    })
}

/**
 * 날짜 포맷 변환 (YYYY-MM-DD → YYYYMMDDHHMM)
 */
function formatDateParam(date, isEnd = false) {
    if (!date) return undefined
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const time = isEnd ? '2359' : '0000'
    return `${year}${month}${day}${time}`
}

/**
 * 공사 낙찰 목록 조회
 */
export async function getScsbidListSttusCnstwk(params = {}) {
    const { startDate, endDate, bidNtceNo, pageNo = 1, numOfRows = 10 } = params

    const queryParams = {
        pageNo,
        numOfRows,
    }

    if (bidNtceNo) {
        queryParams.inqryDiv = '2'
        queryParams.bidNtceNo = bidNtceNo
    } else {
        queryParams.inqryDiv = '1'
        queryParams.inqryBgnDt = formatDateParam(startDate)
        queryParams.inqryEndDt = formatDateParam(endDate, true)
    }

    return callApi(`${SERVICE_PATH}/getScsbidListSttusCnstwk`, queryParams, DEFAULT_CALL_OPTIONS)
}

/**
 * 물품 낙찰 목록 조회
 */
export async function getScsbidListSttusThng(params = {}) {
    const { startDate, endDate, bidNtceNo, pageNo = 1, numOfRows = 10 } = params

    const queryParams = {
        pageNo,
        numOfRows,
    }

    if (bidNtceNo) {
        queryParams.inqryDiv = '2'
        queryParams.bidNtceNo = bidNtceNo
    } else {
        queryParams.inqryDiv = '1'
        queryParams.inqryBgnDt = formatDateParam(startDate)
        queryParams.inqryEndDt = formatDateParam(endDate, true)
    }

    return callApi(`${SERVICE_PATH}/getScsbidListSttusThng`, queryParams, DEFAULT_CALL_OPTIONS)
}

/**
 * 용역 낙찰 목록 조회
 */
export async function getScsbidListSttusServc(params = {}) {
    const { startDate, endDate, bidNtceNo, pageNo = 1, numOfRows = 10 } = params

    const queryParams = {
        pageNo,
        numOfRows,
    }

    if (bidNtceNo) {
        queryParams.inqryDiv = '2'
        queryParams.bidNtceNo = bidNtceNo
    } else {
        queryParams.inqryDiv = '1'
        queryParams.inqryBgnDt = formatDateParam(startDate)
        queryParams.inqryEndDt = formatDateParam(endDate, true)
    }

    return callApi(`${SERVICE_PATH}/getScsbidListSttusServc`, queryParams, DEFAULT_CALL_OPTIONS)
}

/**
 * 외자 낙찰 목록 조회
 */
export async function getScsbidListSttusFrgcpt(params = {}) {
    const { startDate, endDate, bidNtceNo, pageNo = 1, numOfRows = 10 } = params

    const queryParams = {
        pageNo,
        numOfRows,
    }

    if (bidNtceNo) {
        queryParams.inqryDiv = '2'
        queryParams.bidNtceNo = bidNtceNo
    } else {
        queryParams.inqryDiv = '1'
        queryParams.inqryBgnDt = formatDateParam(startDate)
        queryParams.inqryEndDt = formatDateParam(endDate, true)
    }

    return callApi(`${SERVICE_PATH}/getScsbidListSttusFrgcpt`, queryParams, DEFAULT_CALL_OPTIONS)
}

/**
 * 개찰결과 상세 조회 (순위별 투찰 정보)
 */
export async function getOpengResultListInfoOpengCompt(params = {}) {
    const {
        bidNtceNo,
        bidNtceOrd = '000',
        bidClsfcNo,
        rbidNo,
        pageNo = 1,
        numOfRows = 50,
    } = params

    const queryParams = {
        bidNtceNo,
        bidNtceOrd,
        pageNo,
        numOfRows,
    }

    if (bidClsfcNo) queryParams.bidClsfcNo = bidClsfcNo
    if (rbidNo) queryParams.rbidNo = rbidNo

    const response = await callApi(
        `${SERVICE_PATH}/getOpengResultListInfoOpengCompt`,
        queryParams,
        DEFAULT_CALL_OPTIONS
    )

    return {
        ...response,
        items: normalizeOpeningItems(response.items),
    }
}

/**
 * 개찰결과 목록 조회 (업무유형별)
 * @param {'cnstwk'|'thng'|'servc'|'frgcpt'} businessType
 * @param {Object} params
 */
export async function getOpengResultListInfo(businessType, params = {}) {
    switch (businessType) {
        case 'cnstwk':
            return getOpengResultListInfoCnstwk(params)
        case 'thng':
            return getOpengResultListInfoThng(params)
        case 'servc':
            return getOpengResultListInfoServc(params)
        case 'frgcpt':
            return getOpengResultListInfoFrgcpt(params)
        default:
            throw new Error(`Unknown business type: ${businessType}`)
    }
}

/**
 * 개찰결과 공사 목록 조회
 */
export async function getOpengResultListInfoCnstwk(params = {}) {
    const { inqryDiv = '4', bidNtceNo, pageNo = 1, numOfRows = 10 } = params
    return callApi(
        `${SERVICE_PATH}/getOpengResultListInfoCnstwk`,
        {
            inqryDiv,
            bidNtceNo,
            pageNo,
            numOfRows,
        },
        DEFAULT_CALL_OPTIONS
    )
}

/**
 * 개찰결과 물품 목록 조회
 */
export async function getOpengResultListInfoThng(params = {}) {
    const { inqryDiv = '4', bidNtceNo, pageNo = 1, numOfRows = 10 } = params
    return callApi(
        `${SERVICE_PATH}/getOpengResultListInfoThng`,
        {
            inqryDiv,
            bidNtceNo,
            pageNo,
            numOfRows,
        },
        DEFAULT_CALL_OPTIONS
    )
}

/**
 * 개찰결과 용역 목록 조회
 */
export async function getOpengResultListInfoServc(params = {}) {
    const { inqryDiv = '4', bidNtceNo, pageNo = 1, numOfRows = 10 } = params
    return callApi(
        `${SERVICE_PATH}/getOpengResultListInfoServc`,
        {
            inqryDiv,
            bidNtceNo,
            pageNo,
            numOfRows,
        },
        DEFAULT_CALL_OPTIONS
    )
}

/**
 * 개찰결과 외자 목록 조회
 */
export async function getOpengResultListInfoFrgcpt(params = {}) {
    const { inqryDiv = '4', bidNtceNo, pageNo = 1, numOfRows = 10 } = params
    return callApi(
        `${SERVICE_PATH}/getOpengResultListInfoFrgcpt`,
        {
            inqryDiv,
            bidNtceNo,
            pageNo,
            numOfRows,
        },
        DEFAULT_CALL_OPTIONS
    )
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

/**
 * 입찰공고번호 기준 개찰 파라미터 해석
 * @param {'cnstwk'|'thng'|'servc'|'frgcpt'} businessType
 * @param {string} bidNtceNo
 */
export async function resolveOpeningParams(businessType, bidNtceNo) {
    if (!bidNtceNo) {
        throw new Error('bidNtceNo is required.')
    }

    const response = await getOpengResultListInfo(businessType, {
        inqryDiv: '4',
        bidNtceNo,
        pageNo: 1,
        numOfRows: 100,
    })

    const items = Array.isArray(response?.items) ? response.items : []
    if (items.length === 0) return null

    const targetItems = items.filter((item) => !item?.bidNtceNo || item.bidNtceNo === bidNtceNo)
    const candidates = targetItems.length > 0 ? targetItems : items

    const sorted = [...candidates].sort((a, b) => {
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
        bidNtceNo: picked?.bidNtceNo || bidNtceNo,
        bidNtceOrd: picked?.bidNtceOrd || '000',
        bidClsfcNo: picked?.bidClsfcNo ?? '0',
        rbidNo: picked?.rbidNo ?? '000',
        opengDt: picked?.opengDt,
        prtcptCnum: picked?.prtcptCnum,
    }
}

/**
 * 복수예비가격 상세 조회 (공사)
 */
export async function getOpengResultListInfoCnstwkPreparPcDetail(params = {}) {
    const { bidNtceNo, bidNtceOrd = '000', pageNo = 1, numOfRows = 15 } = params

    return callApi(
        `${SERVICE_PATH}/getOpengResultListInfoCnstwkPreparPcDetail`,
        {
            bidNtceNo,
            bidNtceOrd,
            pageNo,
            numOfRows,
        },
        DEFAULT_CALL_OPTIONS
    )
}

/**
 * 공사 낙찰 목록 조회 (검색조건 - 사업자번호 포함)
 */
export async function getScsbidListSttusCnstwkPPSSrch(params = {}) {
    const { startDate, endDate, bidNtceNo, bizno, pageNo = 1, numOfRows = 10 } = params

    const queryParams = {
        pageNo,
        numOfRows,
    }

    if (bizno) queryParams.bizno = bizno

    if (bidNtceNo) {
        queryParams.inqryDiv = '3'
        queryParams.bidNtceNo = bidNtceNo
    } else {
        queryParams.inqryDiv = '1' // 1. 공고게시일시
        queryParams.inqryBgnDt = formatDateParam(startDate)
        queryParams.inqryEndDt = formatDateParam(endDate, true)
    }

    return callApi(`${SERVICE_PATH}/getScsbidListSttusCnstwkPPSSrch`, queryParams, DEFAULT_CALL_OPTIONS)
}

/**
 * 물품 낙찰 목록 조회 (검색조건 - 사업자번호 포함)
 */
export async function getScsbidListSttusThngPPSSrch(params = {}) {
    const { startDate, endDate, bidNtceNo, bizno, pageNo = 1, numOfRows = 10 } = params

    const queryParams = {
        pageNo,
        numOfRows,
    }

    if (bizno) queryParams.bizno = bizno

    if (bidNtceNo) {
        queryParams.inqryDiv = '3'
        queryParams.bidNtceNo = bidNtceNo
    } else {
        queryParams.inqryDiv = '1' // 1. 공고게시일시
        queryParams.inqryBgnDt = formatDateParam(startDate)
        queryParams.inqryEndDt = formatDateParam(endDate, true)
    }

    return callApi(`${SERVICE_PATH}/getScsbidListSttusThngPPSSrch`, queryParams, DEFAULT_CALL_OPTIONS)
}

/**
 * 용역 낙찰 목록 조회 (검색조건 - 사업자번호 포함)
 */
export async function getScsbidListSttusServcPPSSrch(params = {}) {
    const { startDate, endDate, bidNtceNo, bizno, pageNo = 1, numOfRows = 10 } = params

    const queryParams = {
        pageNo,
        numOfRows,
    }

    if (bizno) queryParams.bizno = bizno

    if (bidNtceNo) {
        queryParams.inqryDiv = '3'
        queryParams.bidNtceNo = bidNtceNo
    } else {
        queryParams.inqryDiv = '1' // 1. 공고게시일시
        queryParams.inqryBgnDt = formatDateParam(startDate)
        queryParams.inqryEndDt = formatDateParam(endDate, true)
    }

    return callApi(`${SERVICE_PATH}/getScsbidListSttusServcPPSSrch`, queryParams, DEFAULT_CALL_OPTIONS)
}

/**
 * 외자 낙찰 목록 조회 (검색조건 - 사업자번호 포함)
 */
export async function getScsbidListSttusFrgcptPPSSrch(params = {}) {
    const { startDate, endDate, bidNtceNo, bizno, pageNo = 1, numOfRows = 10 } = params

    const queryParams = {
        pageNo,
        numOfRows,
    }

    if (bizno) queryParams.bizno = bizno

    if (bidNtceNo) {
        queryParams.inqryDiv = '3'
        queryParams.bidNtceNo = bidNtceNo
    } else {
        queryParams.inqryDiv = '1' // 1. 공고게시일시
        queryParams.inqryBgnDt = formatDateParam(startDate)
        queryParams.inqryEndDt = formatDateParam(endDate, true)
    }

    return callApi(`${SERVICE_PATH}/getScsbidListSttusFrgcptPPSSrch`, queryParams, DEFAULT_CALL_OPTIONS)
}

/**
 * 업무 구분에 따른 낙찰 목록 조회
 * bizno가 파라미터에 있으면 PPSSrch 검색을 수행합니다.
 */
export async function getScsbidListSttus(businessType, params = {}) {
    const usePPSSrch = !!params.bizno

    switch (businessType) {
        case 'cnstwk':
            return usePPSSrch ? getScsbidListSttusCnstwkPPSSrch(params) : getScsbidListSttusCnstwk(params)
        case 'thng':
            return usePPSSrch ? getScsbidListSttusThngPPSSrch(params) : getScsbidListSttusThng(params)
        case 'servc':
            return usePPSSrch ? getScsbidListSttusServcPPSSrch(params) : getScsbidListSttusServc(params)
        case 'frgcpt':
            return usePPSSrch ? getScsbidListSttusFrgcptPPSSrch(params) : getScsbidListSttusFrgcpt(params)
        default:
            throw new Error(`Unknown business type: ${businessType}`)
    }
}
