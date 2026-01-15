# 나라장터 API 데이터 구조 및 XML/JSON 응답 예시

> **문서 목적**: 시스템이 처리해야 할 데이터 구조와 스키마 정의

---

## 1. 입찰공고정보 (BidPublicInfoService)

### 1.1 공사 입찰공고 조회 응답

**API**: `getBidPblancListInfoCnstwk`

```xml
<response>
  <header>
    <resultCode>00</resultCode>
    <resultMsg>정상</resultMsg>
  </header>
  <body>
    <items>
      <item>
        <bidNtceNo>R25BK00932003</bidNtceNo>
        <bidNtceOrd>000</bidNtceOrd>
        <reNtceYn>N</reNtceYn>
        <rgstTyNm>조달청 또는 나라장터 자체 공고건</rgstTyNm>
        <ntceKindNm>등록공고</ntceKindNm>
        <intrbidYn>N</intrbidYn>
        <bidNtceDt>2025-07-01 06:23:47</bidNtceDt>
        <refNo>문성고등학교 공고 제2025-51호</refNo>
        <bidNtceNm>문성고등학교 비탈면공사 수의계약 안내공고</bidNtceNm>
        <ntceInsttCd>7380065</ntceInsttCd>
        <ntceInsttNm>광주광역시교육청 문성고등학교</ntceInsttNm>
        <dminsttCd>7380065</dminsttCd>
        <dminsttNm>광주광역시교육청 문성고등학교</dminsttNm>
        <bidMethdNm>전자입찰</bidMethdNm>
        <cntrctCnclsMthdNm>수의계약</cntrctCnclsMthdNm>
        <ntceInsttOfclNm>이건구</ntceInsttOfclNm>
        <ntceInsttOfclTelNo>062-670-7502</ntceInsttOfclTelNo>
        <ntceInsttOfclEmailAdrs>lkk7394@naver.com</ntceInsttOfclEmailAdrs>
        <bidBeginDt>2025-07-01 14:00:00</bidBeginDt>
        <bidClseDt>2025-07-08 10:00:00</bidClseDt>
        <opengDt>2025-07-08 11:00:00</opengDt>
        <prtcptLmtRgnNm>전국</prtcptLmtRgnNm>
        <rgstDt>2025-07-01 06:23:00</rgstDt>
        <chgDt>2025-07-01 06:23:00</chgDt>
      </item>
    </items>
    <numOfRows>10</numOfRows>
    <pageNo>1</pageNo>
    <totalCount>1</totalCount>
  </body>
</response>
```

### 1.2 JavaScript 데이터 모델

```javascript
// 입찰 공고 데이터 모델
const BidNotice = {
  bidNtceNo: "R25BK00932003",        // 입찰공고번호 (PK)
  bidNtceOrd: "000",                  // 입찰공고차수
  bidNtceNm: "문성고등학교 비탈면공사", // 공고명
  
  // 기관 정보
  ntceInsttCd: "7380065",             // 공고기관코드
  ntceInsttNm: "광주광역시교육청 문성고등학교", // 공고기관명
  dminsttCd: "7380065",               // 수요기관코드
  dminsttNm: "광주광역시교육청 문성고등학교", // 수요기관명
  
  // 입찰 방식
  bidMethdNm: "전자입찰",             // 입찰방식명
  cntrctCnclsMthdNm: "수의계약",      // 계약체결방법명
  
  // 일정
  bidNtceDt: "2025-07-01 06:23:47",   // 입찰공고일시
  bidBeginDt: "2025-07-01 14:00:00",  // 입찰개시일시
  bidClseDt: "2025-07-08 10:00:00",   // 입찰마감일시
  opengDt: "2025-07-08 11:00:00",     // 개찰일시
  
  // 담당자
  ntceInsttOfclNm: "이건구",          // 담당자명
  ntceInsttOfclTelNo: "062-670-7502", // 담당자 전화번호
  
  // 상태
  ntceKindNm: "등록공고",             // 공고종류 (등록/변경/취소/재공고)
  reNtceYn: "N",                      // 재공고여부
  intrbidYn: "N",                     // 국제입찰여부
};
```

---

## 2. 낙찰정보 (ScsbidInfoService)

### 2.1 낙찰된 목록 현황 조회 응답

**API**: `getScsbidListSttusThng` (물품), `getScsbidListSttusCnstwk` (공사)

```xml
<response>
  <header>
    <resultCode>00</resultCode>
    <resultMsg>정상</resultMsg>
  </header>
  <body>
    <items>
      <item>
        <bidNtceNo>R25BK00965123</bidNtceNo>
        <bidNtceOrd>000</bidNtceOrd>
        <bidClsfcNo>1</bidClsfcNo>
        <rbidNo>000</rbidNo>
        <ntceDivCd>통050001</ntceDivCd>
        <bidNtceNm>혁신육아복합센터 건립공사(기계) 관급자재(간접가열보일러)</bidNtceNm>
        <prtcptCnum>2</prtcptCnum>
        <bidwinnrNm>주식회사 동광보일러</bidwinnrNm>
        <bidwinnrBizno>1408121883</bidwinnrBizno>
        <bidwinnrCeoNm>박정연</bidwinnrCeoNm>
        <bidwinnrAdrs>충청남도 아산시 수장로 67-0 (배미동)</bidwinnrAdrs>
        <bidwinnrTelNo>02-6258-8989</bidwinnrTelNo>
        <sucsfbidAmt>83500000</sucsfbidAmt>
        <sucsfbidRate>97.82</sucsfbidRate>
        <rlOpengDt>2025-07-23 11:00:00</rlOpengDt>
        <dminsttCd>6280147</dminsttCd>
        <dminsttNm>인천광역시 종합건설본부</dminsttNm>
        <rgstDt>2025-07-23 15:20:05</rgstDt>
        <fnlSucsfDate>2025-07-23</fnlSucsfDate>
      </item>
    </items>
    <numOfRows>10</numOfRows>
    <pageNo>1</pageNo>
    <totalCount>1</totalCount>
  </body>
</response>
```

### 2.2 개찰결과 상세 (순위별 투찰 정보)

**API**: `getOpengResultListInfoOpengCompt`

```xml
<response>
  <header>
    <resultCode>00</resultCode>
    <resultMsg>정상</resultMsg>
  </header>
  <body>
    <items>
      <item>
        <bidNtceNo>R25BK00965123</bidNtceNo>
        <bidNtceOrd>000</bidNtceOrd>
        <bidClsfcNo>1</bidClsfcNo>
        <rbidNo>000</rbidNo>
        <opengRank>1</opengRank>
        <prcrmntCorpNm>주식회사 동광보일러</prcrmntCorpNm>
        <bizno>1408121883</bizno>
        <bidprcAmt>83500000</bidprcAmt>
        <bidprcRate>97.82</bidprcRate>
        <drwtYn>N</drwtYn>
        <rlOpengDt>2025-07-23 11:00:00</rlOpengDt>
        <rgstDt>2025-07-23 15:20:05</rgstDt>
        
        <!-- 평가 점수 (1.1 버전 추가 항목) -->
        <bidPrceEvlVal>85.50</bidPrceEvlVal>
        <techEvlVal>90.25</techEvlVal>
        <totalEvlAmtVal>175.75</totalEvlAmtVal>
      </item>
      <item>
        <bidNtceNo>R25BK00965123</bidNtceNo>
        <bidNtceOrd>000</bidNtceOrd>
        <bidClsfcNo>1</bidClsfcNo>
        <rbidNo>000</rbidNo>
        <opengRank>2</opengRank>
        <prcrmntCorpNm>태양보일러 주식회사</prcrmntCorpNm>
        <bizno>1158802234</bizno>
        <bidprcAmt>84200000</bidprcAmt>
        <bidprcRate>98.64</bidprcRate>
        <drwtYn>N</drwtYn>
        <rlOpengDt>2025-07-23 11:00:00</rlOpengDt>
        <rgstDt>2025-07-23 15:20:05</rgstDt>
      </item>
    </items>
    <numOfRows>10</numOfRows>
    <pageNo>1</pageNo>
    <totalCount>2</totalCount>
  </body>
</response>
```

### 2.3 JavaScript 데이터 모델

```javascript
// 낙찰 결과 데이터 모델
const BidResult = {
  // 공고 식별
  bidNtceNo: "R25BK00965123",     // 입찰공고번호
  bidNtceOrd: "000",              // 입찰공고차수
  bidClsfcNo: "1",                // 입찰분류번호
  rbidNo: "000",                  // 재입찰번호
  
  // 공고 정보
  bidNtceNm: "혁신육아복합센터 건립공사",
  prtcptCnum: 2,                  // 참가업체수
  
  // 낙찰 업체 정보
  bidwinnrNm: "주식회사 동광보일러",
  bidwinnrBizno: "1408121883",    // 사업자등록번호
  bidwinnrCeoNm: "박정연",
  bidwinnrAdrs: "충청남도 아산시 수장로 67-0",
  
  // 낙찰 금액/률
  sucsfbidAmt: 83500000,          // 낙찰금액 (원)
  sucsfbidRate: 97.82,            // 낙찰률 (%)
  
  // 일시
  rlOpengDt: "2025-07-23 11:00:00", // 실개찰일시
  fnlSucsfDate: "2025-07-23",       // 최종낙찰일자
};

// 개찰 순위 데이터 모델 (분석용 핵심 데이터)
const OpeningRankItem = {
  bidNtceNo: "R25BK00965123",
  opengRank: 1,                   // 개찰순위 ★
  prcrmntCorpNm: "주식회사 동광보일러", // 업체명
  bizno: "1408121883",            // 사업자등록번호
  bidprcAmt: 83500000,            // 투찰금액 ★
  bidprcRate: 97.82,              // 투찰률 ★ (예정가격 대비)
  drwtYn: "N",                    // 추첨여부
  
  // 평가 점수 (적격심사 등)
  bidPrceEvlVal: 85.50,           // 입찰가격점수
  techEvlVal: 90.25,              // 기술평가점수
  totalEvlAmtVal: 175.75,         // 종합평가점수
};
```

---

## 3. 예비가격 상세 정보

### 3.1 복수예비가격 조회 응답

**API**: `getOpengResultListInfoCnstwkPreparPcDetail`

```xml
<response>
  <header>
    <resultCode>00</resultCode>
    <resultMsg>정상</resultMsg>
  </header>
  <body>
    <items>
      <!-- 15개의 복수예비가격 중 선택된 4개 -->
      <item>
        <bidNtceNo>R25BK00932003</bidNtceNo>
        <bidNtceOrd>000</bidNtceOrd>
        <preparPcNo>3</preparPcNo>
        <preparPc>148500000</preparPc>
        <drwtRate>98.33</drwtRate>
        <drwtYn>Y</drwtYn>
      </item>
      <item>
        <bidNtceNo>R25BK00932003</bidNtceNo>
        <bidNtceOrd>000</bidNtceOrd>
        <preparPcNo>7</preparPcNo>
        <preparPc>151200000</preparPc>
        <drwtRate>100.13</drwtRate>
        <drwtYn>Y</drwtYn>
      </item>
      <item>
        <bidNtceNo>R25BK00932003</bidNtceNo>
        <bidNtceOrd>000</bidNtceOrd>
        <preparPcNo>11</preparPcNo>
        <preparPc>149800000</preparPc>
        <drwtRate>99.20</drwtRate>
        <drwtYn>Y</drwtYn>
      </item>
      <item>
        <bidNtceNo>R25BK00932003</bidNtceNo>
        <bidNtceOrd>000</bidNtceOrd>
        <preparPcNo>15</preparPcNo>
        <preparPc>150500000</preparPc>
        <drwtRate>99.67</drwtRate>
        <drwtYn>Y</drwtYn>
      </item>
    </items>
    <numOfRows>15</numOfRows>
    <pageNo>1</pageNo>
    <totalCount>15</totalCount>
  </body>
</response>
```

### 3.2 JavaScript 데이터 모델

```javascript
// 복수예비가격 데이터 모델
const PreparPrice = {
  bidNtceNo: "R25BK00932003",
  preparPcNo: 3,           // 예비가격 순번 (1~15)
  preparPc: 148500000,     // 예비가격 (원)
  drwtRate: 98.33,         // 기초금액 대비 비율 (%)
  drwtYn: "Y",             // 추첨 선택 여부
};

// 예정가격 계산 (선택된 4개의 산술평균)
function calculateScheduledPrice(selectedPrices) {
  const sum = selectedPrices.reduce((acc, item) => acc + item.preparPc, 0);
  return Math.round(sum / selectedPrices.length);
}
```

---

## 4. 조달업체 정보 (UsrInfoService02)

### 4.1 조달업체 기본정보 조회 응답

**API**: `getPrcrmntCorpBasicInfo02`

```xml
<response>
  <header>
    <resultCode>00</resultCode>
    <resultMsg>정상</resultMsg>
  </header>
  <body>
    <items>
      <item>
        <bizno>6168122531</bizno>
        <corpNm>주식회사청마토건</corpNm>
        <engCorpNm>cheongma CO.LTD</engCorpNm>
        <opbizDt>1997-12-15 12:00:00</opbizDt>
        <rgnCd>50110</rgnCd>
        <rgnNm>제주특별자치도 제주시 구좌읍 김녕리</rgnNm>
        <zip>63348</zip>
        <adrs>제주특별자치도 제주시 구좌읍 김녕남2길</adrs>
        <dtlAdrs>17 (거웅 라피네2차) 105동 제비101호</dtlAdrs>
        <telNo>064-712-0471</telNo>
        <faxNo>064-712-0472</faxNo>
        <cntryNm>대한민국</cntryNm>
        <mnfctDivNm>공급</mnfctDivNm>
        <emplyeNum>7</emplyeNum>
        <corpBsnsDivCd>01,07</corpBsnsDivCd>
        <corpBsnsDivNm>물품,공사</corpBsnsDivNm>
        <hdoffceDivNm>본사</hdoffceDivNm>
        <rgstDt>2001-08-22 00:00:00</rgstDt>
        <chgDt>2025-01-10 14:30:00</chgDt>
      </item>
    </items>
    <numOfRows>10</numOfRows>
    <pageNo>1</pageNo>
    <totalCount>1</totalCount>
  </body>
</response>
```

### 4.2 JavaScript 데이터 모델

```javascript
// 조달업체 데이터 모델
const ProcurementCompany = {
  bizno: "6168122531",            // 사업자등록번호 (PK)
  corpNm: "주식회사청마토건",       // 업체명
  engCorpNm: "cheongma CO.LTD",   // 영문업체명
  
  // 주소 정보
  rgnCd: "50110",                 // 지역코드
  rgnNm: "제주특별자치도 제주시",   // 지역명
  zip: "63348",                   // 우편번호
  adrs: "제주특별자치도 제주시 구좌읍 김녕남2길",
  dtlAdrs: "17 (거웅 라피네2차) 105동",
  
  // 연락처
  telNo: "064-712-0471",
  faxNo: "064-712-0472",
  
  // 업체 정보
  opbizDt: "1997-12-15",          // 개업일
  emplyeNum: 7,                   // 종업원수
  corpBsnsDivNm: "물품,공사",      // 업무구분명
  mnfctDivNm: "공급",             // 제조구분명 (제조/공급)
  
  // 메타데이터
  rgstDt: "2001-08-22",           // 등록일시
  chgDt: "2025-01-10",            // 변경일시
};
```

---

## 5. 계약정보 (CntrctInfoService)

### 5.1 계약현황 조회 응답

**API**: `getCntrctInfoListCnstwk`

```xml
<response>
  <header>
    <resultCode>00</resultCode>
    <resultMsg>정상</resultMsg>
  </header>
  <body>
    <items>
      <item>
        <untyCntrctNo>2025070000123</untyCntrctNo>
        <bsnsDivNm>공사</bsnsDivNm>
        <dcsnCntrctNo>R25TA00012345</dcsnCntrctNo>
        <cntrctNm>문성고등학교 비탈면공사</cntrctNm>
        <cmmnCntrctYn>N</cmmnCntrctYn>
        <lngtrmCtnuDivNm>신규</lngtrmCtnuDivNm>
        <cntrctCnclsDate>2025-07-25</cntrctCnclsDate>
        <cntrctPrd>2025.07.25 ~ 2025.09.30</cntrctPrd>
        <totCntrctAmt>0</totCntrctAmt>
        <thtmCntrctAmt>145000000</thtmCntrctAmt>
        <grntymnyRate>10</grntymnyRate>
        <ntceNo>R25BK00932003</ntceNo>
        <cntrctInsttCd>7380065</cntrctInsttCd>
        <cntrctInsttNm>광주광역시교육청 문성고등학교</cntrctInsttNm>
        <cntrctCnclsMthdNm>일반경쟁</cntrctCnclsMthdNm>
        <corpList>[1^주계약업체^단독^청마토건^홍길동^대한민국^100^김담당^6168122531]</corpList>
        <rgstDt>2025-07-25 10:30:00</rgstDt>
      </item>
    </items>
    <numOfRows>10</numOfRows>
    <pageNo>1</pageNo>
    <totalCount>1</totalCount>
  </body>
</response>
```

---

## 6. 분석용 통합 데이터 스키마

### 6.1 투찰 패턴 분석용 데이터 구조

```javascript
// 업체별 투찰 이력 분석 데이터
const CompanyBidHistory = {
  bizno: "6168122531",
  corpNm: "주식회사청마토건",
  
  // 통계 요약
  stats: {
    totalBids: 156,               // 총 투찰 횟수
    wonBids: 23,                  // 낙찰 횟수
    winRate: 14.74,               // 낙찰률 (%)
    avgBidRate: 89.45,            // 평균 투찰률 (%)
    stdDevBidRate: 2.31,          // 투찰률 표준편차
    minBidRate: 85.20,            // 최소 투찰률
    maxBidRate: 94.80,            // 최대 투찰률
  },
  
  // 투찰률 분포 (히스토그램 데이터)
  bidRateDistribution: [
    { range: "85-86", count: 5 },
    { range: "86-87", count: 12 },
    { range: "87-88", count: 28 },
    { range: "88-89", count: 45 },
    { range: "89-90", count: 38 },
    { range: "90-91", count: 18 },
    { range: "91-92", count: 8 },
    { range: "92-93", count: 2 },
  ],
  
  // 시간대별 투찰 패턴
  bidTimePattern: {
    morning: 0.15,   // 09:00-12:00
    afternoon: 0.45, // 12:00-15:00
    evening: 0.35,   // 15:00-18:00
    night: 0.05,     // 18:00 이후
  },
  
  // 최근 투찰 이력 (상세)
  recentBids: [
    {
      bidNtceNo: "R25BK00932003",
      bidNtceNm: "도로포장공사",
      bidDate: "2025-07-01",
      bidprcRate: 89.23,
      opengRank: 2,
      result: "유찰",
    },
    // ... 추가 이력
  ],
};
```

### 6.2 공고별 예측 분석 데이터

```javascript
// 특정 공고에 대한 예측 분석 결과
const BidPrediction = {
  bidNtceNo: "R25BK00932003",
  bidNtceNm: "문성고등학교 비탈면공사",
  
  // 기초 정보
  baseAmount: 150000000,          // 기초금액
  scheduledPrice: 148750000,      // 예정가격 (예측/계산)
  estimatedParticipants: 15,      // 예상 참가업체 수
  
  // 경쟁 구간 예측
  competitionZones: [
    {
      rangeStart: 85.0,
      rangeEnd: 87.0,
      density: "low",
      estimatedBidders: 2,
      color: "#42A5F5",           // 저조 구간 (파랑)
    },
    {
      rangeStart: 87.0,
      rangeEnd: 89.0,
      density: "normal",
      estimatedBidders: 4,
      color: "#4CAF50",           // 적정 구간 (초록)
    },
    {
      rangeStart: 89.0,
      rangeEnd: 91.0,
      density: "high",
      estimatedBidders: 6,
      color: "#EF5350",           // 과열 구간 (빨강)
    },
    {
      rangeStart: 91.0,
      rangeEnd: 93.0,
      density: "optimal",
      estimatedBidders: 2,
      color: "#7C4DFF",           // 최적 추천 (보라)
    },
    {
      rangeStart: 93.0,
      rangeEnd: 95.0,
      density: "low",
      estimatedBidders: 1,
      color: "#42A5F5",
    },
  ],
  
  // 추천 투찰 구간
  recommendation: {
    optimalRange: { min: 91.5, max: 93.2 },
    confidence: 0.78,             // 신뢰도 78%
    reason: "유사 공고 분석 결과, 해당 구간에서 낙찰 확률이 가장 높음",
  },
  
  // 예상 경쟁 업체 목록
  expectedCompetitors: [
    { bizno: "6168122531", corpNm: "청마토건", bidRateRange: "88.5-92.3%" },
    { bizno: "1234567890", corpNm: "대한건설", bidRateRange: "87.2-91.5%" },
    // ...
  ],
  
  // 유사 공고 통계 (학습 기반)
  similarBidsStats: {
    count: 45,                    // 유사 공고 수
    avgWinningRate: 91.23,        // 평균 낙찰률
    medianWinningRate: 90.85,     // 중앙 낙찰률
    avgParticipants: 14.2,        // 평균 참가자 수
  },
};
```

---

## 7. API 호출 파라미터 요약

### 7.1 공통 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `ServiceKey` | String | Y | 공공데이터포털 인증키 |
| `numOfRows` | Integer | Y | 한 페이지 결과 수 |
| `pageNo` | Integer | Y | 페이지 번호 |
| `type` | String | N | 응답 형식 (`json` 또는 생략 시 XML) |

### 7.2 조회구분별 파라미터

| 조회구분 | 필수 파라미터 | 설명 |
|---------|--------------|------|
| `1` (등록일시) | `inqryBgnDt`, `inqryEndDt` | YYYYMMDDHHMM 형식 |
| `2` (입찰공고번호) | `bidNtceNo` | 공고번호로 직접 조회 |
| `3` (변경일시) | `inqryBgnDt`, `inqryEndDt` | 변경 이력 추적 |
| `4` (공고일시/개찰일시) | 서비스별 상이 | 낙찰정보서비스 전용 |

---

**문서 끝**
