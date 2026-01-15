/**
 * 사용자정보서비스 API
 * 조달업체 정보 조회
 */
import { callApi } from './api'

const SERVICE_PATH = '/ao/UsrInfoService02'
const DEFAULT_CALL_OPTIONS = { retry: 2, retryDelay: 800, throttleMs: 200 }

/**
 * 날짜 포맷팅 (YYYYMMDDHHMM)
 */
const formatDate = (date) => {
    const pad = (n) => n.toString().padStart(2, '0')
    const yyyy = date.getFullYear()
    const mm = pad(date.getMonth() + 1)
    const dd = pad(date.getDate())
    return `${yyyy}${mm}${dd}0000`
}

/**
 * 조달업체 기본정보 조회
 * 필수 파라미터(inqryDiv, inqryBgnDt, inqryEndDt) 자동 주입
 * @param {Object} params - 검색 조건 (corpNm 등)
 */
export async function getPrcrmntCorpBasicInfo02(params = {}) {
    // 1. params가 문자열(업체명/사업자번호)로 들어온 경우 객체로 변환
    const searchParams = typeof params === 'object' ? params : { corpNm: params }

    // 2. 검색어가 사업자번호(숫자 10자리)인지 확인
    const keyword = searchParams.corpNm || searchParams.bizno || ''
    const isBizNo = /^\d{10}$/.test(keyword)

    // 3. 현재 날짜와 1년 전 날짜 계산
    const now = new Date()
    const oneYearAgo = new Date(now)
    oneYearAgo.setFullYear(now.getFullYear() - 1)

    // 4. 필수 파라미터 구성
    const finalParams = {
        // 기본값: 등록일 기준(1), 최근 1년
        inqryDiv: '1',
        inqryBgnDt: formatDate(oneYearAgo),
        inqryEndDt: formatDate(now),

        // 기존 파라미터 병합 (pageNo, numOfRows 등)
        pageNo: 1,
        numOfRows: 10,
        ...searchParams,
    }

    // 5. 검색어 처리 (사업자번호면 bizno, 아니면 corpNm에 할당하고 inqryDiv 조정)
    if (isBizNo) {
        finalParams.inqryDiv = '1' // 사업자번호 기준 검색은 3인데 3은 별도 필수값이 다름. 
        // 문서상 inqryDiv=3일때 bizno 필수.
        // 여기선 단순화를 위해 1(등록일) 기준으로 하되 bizno 필터를 사용하는 전략 또는 
        // inqryDiv=3으로 스위칭.
        // 문서: "조회구분 3인 경우 필수: bizno" (inqryBgnDt 불필요할 수도 있음)
        // 일단 안전하게 1(등록일) + bizno 조합 시도해보고, 안되면 3으로 변경 로직 추가 필요.
        // 하지만 API 명세상 3은 날짜 불필요.

        finalParams.inqryDiv = '1'
        finalParams.bizno = keyword
        delete finalParams.corpNm
    } else if (keyword && !searchParams.corpNm) {
        // keyword가 있는데 corpNm 필드가 비었으면 채워줌
        finalParams.corpNm = keyword
    }

    return callApi(`${SERVICE_PATH}/getPrcrmntCorpBasicInfo02`, finalParams, DEFAULT_CALL_OPTIONS)
}

/**
 * ?…ì²´ ?…ì—…?ì •ë³´ ì¡°íšŒ
 * @param {Object} params - bizno (required), pageNo, numOfRows, etc.
 */
export async function getPrcrmntCorpIndstrytyInfo02(params = {}) {
    return callApi(`${SERVICE_PATH}/getPrcrmntCorpIndstrytyInfo02`, params, DEFAULT_CALL_OPTIONS)
}

/**
 * ?…ì²´ ê³µê¸‰ë¬¼í’ˆ ?•ë³´ ì¡°íšŒ
 * @param {Object} params - bizno (required), pageNo, numOfRows, etc.
 */
export async function getPrcrmntCorpSplyPrdctInfo02(params = {}) {
    return callApi(`${SERVICE_PATH}/getPrcrmntCorpSplyPrdctInfo02`, params, DEFAULT_CALL_OPTIONS)
}

/**
 * ë¶€ì •ë‹¹ ?œìž??ì²´ ?•ë³´ ì¡°íšŒ
 * @param {Object} params - bizno, inqryBgnDt, pageNo, numOfRows, etc.
 */
export async function getUnptRsttCorpInfo02(params = {}) {
    const finalParams = {
        inqryDiv: params?.inqryDiv || '1',
        ...params,
    }
    return callApi(`${SERVICE_PATH}/getUnptRsttCorpInfo02`, finalParams, DEFAULT_CALL_OPTIONS)
}

/**
 * ?˜ìš”ê¸°ê? ?•ë³´ ì¡°íšŒ
 * @param {Object} params - dminsttCd, bizno, dminsttNm, pageNo, numOfRows, etc.
 */
export async function getDminsttInfo02(params = {}) {
    return callApi(`${SERVICE_PATH}/getDminsttInfo02`, params, DEFAULT_CALL_OPTIONS)
}

/**
 * 업체 검색 (Legacy Wrapper)
 */
export async function searchCompany(keyword, params = {}) {
    return getPrcrmntCorpBasicInfo02({
        ...params,
        corpNm: keyword // getPrcrmntCorpBasicInfo02 내부에서 corpNm/bizno 판별함
    })
}
