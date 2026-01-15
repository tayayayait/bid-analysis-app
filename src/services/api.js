/**
 * 나라장터 API 기본 설정
 */
import axios from 'axios'

// 공공데이터포털 API 베이스 URL (Vite 프록시 사용)
const resolveBaseUrl = () => {
    const isElectron = typeof window !== 'undefined' && window.electron?.isElectron
    const electronBase = window?.electron?.apiBase
    if (!import.meta.env.DEV && isElectron && electronBase) return electronBase
    return import.meta.env.VITE_API_BASE_URL || '/api'
}

const BASE_URL = resolveBaseUrl()

// Axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
})

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
let lastCallAt = 0

const normalizeItems = (items) => {
    if (!items) return []
    if (Array.isArray(items)) return items
    if (Array.isArray(items?.item)) return items.item
    if (items?.item) return [items.item]
    return [items]
}

// 응답 인터셉터 - XML을 JSON으로 파싱 (필요시)
apiClient.interceptors.response.use(
    (response) => {
        // 정상 응답 처리
        const data = response.data

        const responseError = data?.['nkoneps.com.response.ResponseError']?.header
        if (responseError?.resultCode && responseError.resultCode !== '00') {
            const errorMsg = responseError?.resultMsg || 'API 호출 실패'
            return Promise.reject(new Error(errorMsg))
        }

        // 공공데이터 API 에러 체크
        if (data?.response?.header?.resultCode !== '00') {
            const errorMsg = data?.response?.header?.resultMsg || 'API 호출 실패'
            return Promise.reject(new Error(errorMsg))
        }

        return data.response.body
    },
    (error) => {
        // 네트워크 에러 등 처리
        console.error('API Error:', error)
        return Promise.reject(error)
    }
)

/**
 * API 키 관리
 * 로컬 스토리지에서 API 키를 가져옴
 */
export function getServiceKey() {
    // .env에서 키를 우선 가져오고, 없으면 로컬 스토리지 확인
    return localStorage.getItem('naramarket_api_key') || import.meta.env.VITE_PUBLIC_DATA_KEY || ''
}

export function setServiceKey(key) {
    localStorage.setItem('naramarket_api_key', key)
}

/**
 * 공통 API 호출 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} params - 쿼리 파라미터
 */
export async function callApi(endpoint, params = {}, options = {}) {
    const serviceKey = getServiceKey()
    const { retry = 0, retryDelay = 500, throttleMs = 0 } = options

    if (!serviceKey) {
        throw new Error('API 키가 설정되지 않았습니다. 설정 페이지에서 API 키를 입력해주세요.')
    }

    // ServiceKey 처리를 위해 쿼리 스트링 직접 생성
    // 공공데이터포털에서 제공하는 Encoding 키를 .env에 저장하면 별도 인코딩 불필요
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
    const querySeparator = normalizedEndpoint.includes('?') ? '&' : '?'
    const urlWithKey = `${normalizedEndpoint}${querySeparator}ServiceKey=${serviceKey}`

    const safeUrl = urlWithKey.replace(/(ServiceKey=)([^&]+)/i, '$1<redacted>')
    if (import.meta.env?.DEV) console.log(`API calling: ${safeUrl}`)

    const request = async () => {
        if (throttleMs > 0) {
            const now = Date.now()
            const waitMs = Math.max(0, throttleMs - (now - lastCallAt))
            if (waitMs > 0) {
                await sleep(waitMs)
            }
            lastCallAt = Date.now()
        }

        return apiClient.get(urlWithKey, {
            params: {
                type: 'json',
                numOfRows: 10,
                pageNo: 1,
                ...params,
            },
        })
    }

    let attempt = 0
    let response
    while (true) {
        try {
            response = await request()
            break
        } catch (error) {
            // 429 에러(Too Many Requests)는 즉시 중단하고 상위로 전파
            if (error?.response?.status === 429) {
                console.error('API 429 Quota Exceeded. Stopping retries.')
                throw error
            }

            if (attempt >= retry) {
                throw error
            }
            const delay = retryDelay * Math.max(1, attempt + 1)
            await sleep(delay)
            attempt += 1
        }
    }

    return {
        items: normalizeItems(response.items),
        totalCount: response.totalCount || 0,
        pageNo: response.pageNo || 1,
        numOfRows: response.numOfRows || 10,
    }
}

export default apiClient
