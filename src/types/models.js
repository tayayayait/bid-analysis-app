/**
 * 나라장터 API 데이터 모델 정의
 * XML예시.md 기반
 */

/**
 * 입찰 공고 데이터 모델
 * @typedef {Object} BidNotice
 * @property {string} bidNtceNo - 입찰공고번호 (PK)
 * @property {string} bidNtceOrd - 입찰공고차수
 * @property {string} bidNtceNm - 공고명
 * @property {string} ntceInsttCd - 공고기관코드
 * @property {string} ntceInsttNm - 공고기관명
 * @property {string} dminsttCd - 수요기관코드
 * @property {string} dminsttNm - 수요기관명
 * @property {string} bidMethdNm - 입찰방식명
 * @property {string} cntrctCnclsMthdNm - 계약체결방법명
 * @property {string} bidNtceDt - 입찰공고일시
 * @property {string} bidBeginDt - 입찰개시일시
 * @property {string} bidClseDt - 입찰마감일시
 * @property {string} opengDt - 개찰일시
 * @property {string} ntceInsttOfclNm - 담당자명
 * @property {string} ntceInsttOfclTelNo - 담당자 전화번호
 * @property {string} ntceKindNm - 공고종류 (등록/변경/취소/재공고)
 * @property {string} reNtceYn - 재공고여부
 * @property {string} intrbidYn - 국제입찰여부
 * @property {string} refNo - 참조번호
 * @property {string} prtcptLmtRgnNm - 참가제한지역
 */

/**
 * 낙찰 결과 데이터 모델
 * @typedef {Object} BidResult
 * @property {string} bidNtceNo - 입찰공고번호
 * @property {string} bidNtceOrd - 입찰공고차수
 * @property {string} bidClsfcNo - 입찰분류번호
 * @property {string} rbidNo - 재입찰번호
 * @property {string} bidNtceNm - 공고명
 * @property {number} prtcptCnum - 참가업체수
 * @property {string} bidwinnrNm - 낙찰업체명
 * @property {string} bidwinnrBizno - 낙찰업체 사업자번호
 * @property {string} bidwinnrCeoNm - 대표자명
 * @property {string} bidwinnrAdrs - 주소
 * @property {number} sucsfbidAmt - 낙찰금액 (원)
 * @property {number} sucsfbidRate - 낙찰률 (%)
 * @property {string} rlOpengDt - 실개찰일시
 * @property {string} fnlSucsfDate - 최종낙찰일자
 * @property {string} dminsttNm - 수요기관명
 */

/**
 * 개찰 순위 데이터 모델
 * @typedef {Object} OpeningRankItem
 * @property {string} bidNtceNo - 입찰공고번호
 * @property {number} opengRank - 개찰순위
 * @property {string} prcrmntCorpNm - 업체명
 * @property {string} bizno - 사업자등록번호
 * @property {number} bidprcAmt - 투찰금액
 * @property {number} bidprcRate - 투찰률 (%)
 * @property {string} drwtYn - 추첨여부
 * @property {number} [bidPrceEvlVal] - 입찰가격점수
 * @property {number} [techEvlVal] - 기술평가점수
 * @property {number} [totalEvlAmtVal] - 종합평가점수
 */

/**
 * 복수예비가격 데이터 모델
 * @typedef {Object} PreparPrice
 * @property {string} bidNtceNo - 입찰공고번호
 * @property {number} preparPcNo - 예비가격 순번 (1~15)
 * @property {number} preparPc - 예비가격 (원)
 * @property {number} drwtRate - 기초금액 대비 비율 (%)
 * @property {string} drwtYn - 추첨 선택 여부
 */

/**
 * 조달업체 데이터 모델
 * @typedef {Object} ProcurementCompany
 * @property {string} bizno - 사업자등록번호 (PK)
 * @property {string} corpNm - 업체명
 * @property {string} [engCorpNm] - 영문업체명
 * @property {string} rgnCd - 지역코드
 * @property {string} rgnNm - 지역명
 * @property {string} zip - 우편번호
 * @property {string} adrs - 주소
 * @property {string} [dtlAdrs] - 상세주소
 * @property {string} telNo - 전화번호
 * @property {string} [faxNo] - 팩스번호
 * @property {string} opbizDt - 개업일
 * @property {number} emplyeNum - 종업원수
 * @property {string} corpBsnsDivNm - 업무구분명
 * @property {string} mnfctDivNm - 제조구분명 (제조/공급)
 * @property {string} rgstDt - 등록일시
 * @property {string} chgDt - 변경일시
 */

/**
 * 업체별 투찰 이력 분석 데이터
 * @typedef {Object} CompanyBidHistory
 * @property {string} bizno - 사업자등록번호
 * @property {string} corpNm - 업체명
 * @property {Object} stats - 통계 요약
 * @property {number} stats.totalBids - 총 투찰 횟수
 * @property {number} stats.wonBids - 낙찰 횟수
 * @property {number} stats.winRate - 낙찰률 (%)
 * @property {number} stats.avgBidRate - 평균 투찰률 (%)
 * @property {number} stats.stdDevBidRate - 투찰률 표준편차
 * @property {number} stats.minBidRate - 최소 투찰률
 * @property {number} stats.maxBidRate - 최대 투찰률
 * @property {Array<{range: string, count: number}>} bidRateDistribution - 투찰률 분포
 * @property {Object} bidTimePattern - 시간대별 투찰 패턴
 * @property {Array<Object>} recentBids - 최근 투찰 이력
 */

/**
 * 투찰 예측 분석 결과
 * @typedef {Object} BidPrediction
 * @property {string} bidNtceNo - 입찰공고번호
 * @property {string} bidNtceNm - 공고명
 * @property {number} baseAmount - 기초금액
 * @property {number} scheduledPrice - 예정가격 (예측)
 * @property {number} estimatedParticipants - 예상 참가업체 수
 * @property {Array<CompetitionZone>} competitionZones - 경쟁 구간 예측
 * @property {Object} recommendation - 추천 투찰 구간
 * @property {number} recommendation.optimalRange.min - 추천 최소 투찰률
 * @property {number} recommendation.optimalRange.max - 추천 최대 투찰률
 * @property {number} recommendation.confidence - 신뢰도
 * @property {string} recommendation.reason - 추천 사유
 * @property {Array<Object>} expectedCompetitors - 예상 경쟁 업체 목록
 * @property {Object} similarBidsStats - 유사 공고 통계
 */

/**
 * 경쟁 구간 정보
 * @typedef {Object} CompetitionZone
 * @property {number} rangeStart - 구간 시작 (%)
 * @property {number} rangeEnd - 구간 끝 (%)
 * @property {'low'|'normal'|'high'|'optimal'} density - 경쟁 밀도
 * @property {number} estimatedBidders - 예상 투찰자 수
 * @property {string} color - 시각화 색상
 */

// 상태 레이블 매핑
export const BID_STATUS = {
    PROGRESS: '진행중',
    COMPLETED: '낙찰완료',
    FAILED: '유찰',
    REBID: '재입찰',
    CANCELED: '취소',
}

// 업무 구분
export const BUSINESS_TYPE = {
    CNSTWK: { code: 'cnstwk', label: '공사' },
    THNG: { code: 'thng', label: '물품' },
    SERVC: { code: 'servc', label: '용역' },
    FRGCPT: { code: 'frgcpt', label: '외자' },
}

// 예비가격 계산 함수
export function calculateScheduledPrice(selectedPrices) {
    if (!selectedPrices || selectedPrices.length === 0) return 0
    const sum = selectedPrices.reduce((acc, item) => acc + item.preparPc, 0)
    return Math.round(sum / selectedPrices.length)
}

// 금액 포맷팅
export function formatAmount(amount) {
    if (!amount) return '-'
    return new Intl.NumberFormat('ko-KR').format(amount)
}

// 날짜 포맷팅
export function formatDate(dateStr) {
    if (!dateStr) return '-'
    const date = new Date(dateStr.replace(' ', 'T'))
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}

// 날짜+시간 포맷팅
export function formatDateTime(dateStr) {
    if (!dateStr) return '-'
    const date = new Date(dateStr.replace(' ', 'T'))
    return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    })
}
