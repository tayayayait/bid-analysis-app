/**
 * 입찰공고정보서비스 API
 * 나라장터 입찰 공고 조회
 */
import { callApi } from './api'

const SERVICE_PATH = '/ad/BidPublicInfoService'
const DEFAULT_CALL_OPTIONS = { retry: 2, retryDelay: 800, throttleMs: 500 }

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
 * 공사 입찰공고 목록 조회
 * @param {Object} params
 * @param {string} params.startDate - 조회 시작일 (YYYY-MM-DD)
 * @param {string} params.endDate - 조회 종료일 (YYYY-MM-DD)
 * @param {string} params.bidNtceNo - 입찰공고번호 (직접 조회시)
 * @param {number} params.pageNo - 페이지 번호
 * @param {number} params.numOfRows - 페이지당 행 수
 */
export async function getBidPblancListInfoCnstwk(params = {}) {
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

    const response = await callApi(`${SERVICE_PATH}/getBidPblancListInfoCnstwk`, queryParams, DEFAULT_CALL_OPTIONS)

    // 데이터 정규화: 공사 공고는 presmptPrce(추정가격) 필드가 없거나 다른 이름일 수 있음
    if (response?.items) {
        response.items = response.items.map((item) => ({
            ...item,
            // 추정가격 필드 매핑 (우선순위: 추정가격 > 기초예비가격 > 예산액 > 추정금액)
            presmptPrce:
                item.presmptPrce || item.bsisProfltAmt || item.bdgtAmt || item.estmtPrce || '0',
        }))
    }

    return response
}

/**
 * 물품 입찰공고 목록 조회
 */
export async function getBidPblancListInfoThng(params = {}) {
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

    return callApi(`${SERVICE_PATH}/getBidPblancListInfoThng`, queryParams, DEFAULT_CALL_OPTIONS)
}

/**
 * 용역 입찰공고 목록 조회
 */
export async function getBidPblancListInfoServc(params = {}) {
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

    return callApi(`${SERVICE_PATH}/getBidPblancListInfoServc`, queryParams, DEFAULT_CALL_OPTIONS)
}

/**
 * 외자 입찰공고 목록 조회
 */
export async function getBidPblancListInfoFrgcpt(params = {}) {
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

    return callApi(`${SERVICE_PATH}/getBidPblancListInfoFrgcpt`, queryParams, DEFAULT_CALL_OPTIONS)
}

/**
 * 업무 구분에 따른 입찰공고 조회
 * @param {'cnstwk'|'thng'|'servc'|'frgcpt'} businessType - 업무구분
 */
export async function getBidPblancList(businessType, params = {}) {
    switch (businessType) {
        case 'cnstwk':
            return getBidPblancListInfoCnstwk(params)
        case 'thng':
            return getBidPblancListInfoThng(params)
        case 'servc':
            return getBidPblancListInfoServc(params)
        case 'frgcpt':
            return getBidPblancListInfoFrgcpt(params)
        default:
            throw new Error(`Unknown business type: ${businessType}`)
    }
}
