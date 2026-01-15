![](media/image1.png){width="7.0in"
height="2.5729166666666665in"}![](media/image2.png){width="7.0in"
height="2.5729166666666665in"}조달청 공공데이터 개방

OpenAPI 참고자료

[1. 서비스 명세 [3](#서비스-명세)](#서비스-명세)

[1.1 나라장터 사용자정보서비스
[3](#나라장터-사용자정보서비스)](#나라장터-사용자정보서비스)

[가. 서비스 개요 [3](#서비스-개요)](#서비스-개요)

[나. 오퍼레이션 목록 [4](#오퍼레이션-목록)](#오퍼레이션-목록)

**  
개정 이력**

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 16%" />
<col style="width: 17%" />
<col style="width: 54%" />
</colgroup>
<tbody>
<tr class="odd">
<td>버 전</td>
<td>변경일</td>
<td>변경 구분</td>
<td>변경사유</td>
</tr>
<tr class="even">
<td>1.0</td>
<td>2025.01.01</td>
<td>최초 개정</td>
<td>최초 개정</td>
</tr>
<tr class="odd">
<td>1.1</td>
<td>2025.12.19</td>
<td>기능 추가</td>
<td><p>[공공데이터 제공신청서_127896]에 의한 기능 추가</p>
<ul>
<li><p>추가 오퍼레이션 : 부정당재제업체정보조회</p></li>
</ul></td>
</tr>
<tr class="even">
<td></td>
<td></td>
<td></td>
<td><ul>
<li></li>
</ul></td>
</tr>
<tr class="odd">
<td></td>
<td></td>
<td></td>
<td><ul>
<li></li>
</ul></td>
</tr>
<tr class="even">
<td></td>
<td></td>
<td></td>
<td><ul>
<li></li>
</ul></td>
</tr>
<tr class="odd">
<td></td>
<td></td>
<td></td>
<td><ul>
<li></li>
</ul></td>
</tr>
</tbody>
</table>

# 1. 서비스 명세 {#서비스-명세 .unnumbered}

## 1.1 나라장터 사용자정보서비스 {#나라장터-사용자정보서비스 .unnumbered}

### 서비스 개요

<table style="width:100%;">
<colgroup>
<col style="width: 20%" />
<col style="width: 8%" />
<col style="width: 9%" />
<col style="width: 19%" />
<col style="width: 0%" />
<col style="width: 9%" />
<col style="width: 3%" />
<col style="width: 8%" />
<col style="width: 20%" />
</colgroup>
<tbody>
<tr class="odd">
<td rowspan="4">서비스 정보</td>
<td colspan="2">서비스 ID</td>
<td colspan="6">UsrInfoService02</td>
</tr>
<tr class="even">
<td colspan="2">서비스명(국문)</td>
<td colspan="6">나라장터 사용자정보서비스</td>
</tr>
<tr class="odd">
<td colspan="2">서비스명(영문)</td>
<td colspan="6">UsrInfoService02</td>
</tr>
<tr class="even">
<td colspan="2">서비스 설명</td>
<td colspan="6"><blockquote>
<p>나라장터에 등록된 조달업체와 수요기관에 대한 정보를 제공하는 서비스로
조달업체정보에는 사업자등록번호, 업체명, 업체주소, 업체의 등록업종정보,
업체의 공급물품정보가 포함되며 수요기관정보에는
수요기관코드(행자부코드가 기본으로 제공되며 행자부코드가 없을 경우
나라장터 수요기관코드가 제공됨), 소관구분, 주소, 최상위기관코드,
최상위기관명 등이 포함되는 나라장터 사용자정보서비스</p>
</blockquote></td>
</tr>
<tr class="odd">
<td rowspan="3">서비스 보안</td>
<td colspan="2">서비스 인증/권한</td>
<td colspan="5"><p>[O] 서비스 Key[ ] 인증서 (GPKI)</p>
<p>[] Basic (ID/PW) [ ] 없음</p></td>
<td rowspan="2">[ ]WS-Security</td>
</tr>
<tr class="even">
<td colspan="2">메시지 레벨 암호화</td>
<td colspan="5">[ ] 전자서명 [ ] 암호화 [O] 없음</td>
</tr>
<tr class="odd">
<td colspan="2">전송 레벨 암호화</td>
<td colspan="6">[ ] SSL [ O] 없음</td>
</tr>
<tr class="even">
<td rowspan="2">적용 기술 수준</td>
<td colspan="2">인터페이스 표준</td>
<td colspan="6"><p>[ ] SOAP 1.2</p>
<p>(RPC-Encoded, Document Literal, Document Literal Wrapped)</p>
<p>[ O ] REST (GET)</p>
<p>[ ] RSS 1.0 [ ] RSS 2.0 [ ] Atom 1.0 [ ] 기타</p></td>
</tr>
<tr class="odd">
<td colspan="2">교환 데이터 표준</td>
<td colspan="6">[ O ] XML [ O ] JSON [ ] MIME [ ] MTOM</td>
</tr>
<tr class="even">
<td rowspan="2">서비스 URL</td>
<td colspan="2">개발환경</td>
<td colspan="6">http://apis.data.go.kr/1230000/ao/UsrInfoService02</td>
</tr>
<tr class="odd">
<td colspan="2">운영환경</td>
<td colspan="6">http://apis.data.go.kr/1230000/ao/UsrInfoService02</td>
</tr>
<tr class="even">
<td rowspan="2">서비스 WADL</td>
<td colspan="2">개발환경</td>
<td colspan="6">N/A</td>
</tr>
<tr class="odd">
<td colspan="2">운영환경</td>
<td colspan="6">N/A</td>
</tr>
<tr class="even">
<td rowspan="3">서비스 배포 정보</td>
<td colspan="2">서비스 버전</td>
<td colspan="6">1.0</td>
</tr>
<tr class="odd">
<td colspan="2">서비스 시작일</td>
<td colspan="2">2025-01-06</td>
<td colspan="2">배포 일자</td>
<td colspan="2">2025-01-06</td>
</tr>
<tr class="even">
<td colspan="2">서비스 이력</td>
<td colspan="6">N/A</td>
</tr>
<tr class="odd">
<td>메시지 교환 유형</td>
<td colspan="8"><p>[O] Request-Response [ ] Publish-Subscribe</p>
<p>[ ] Fire-and-Forgot [ ] Notification</p></td>
</tr>
<tr class="even">
<td>메시지 로깅 수준</td>
<td>성공</td>
<td colspan="2">[O] Header [ ] Body</td>
<td colspan="2">실패</td>
<td colspan="3">[O] Header [O} Body</td>
</tr>
<tr class="odd">
<td>사용 제약 사항 (비고)</td>
<td colspan="8">N/A</td>
</tr>
<tr class="even">
<td>서비스 제공자</td>
<td colspan="8">차도빈 / 조달청 전자조달기획과 / 042-724-7124 /
dobin@korea.kr</td>
</tr>
<tr class="odd">
<td>데이터 갱신주기</td>
<td colspan="8">수시</td>
</tr>
</tbody>
</table>

### 오퍼레이션 목록

|          |                           |                               |                            |                |
|----------|---------------------------|-------------------------------|----------------------------|----------------|
| 일련번호 | 서비스(국문)              | 오퍼레이션명(영문)            | 오퍼레이션명(국문)         | 메시지명(영문) |
| 1        | 나라장터 사용자정보서비스 | getDminsttInfo02              | 수요기관정보조회           | N/A            |
| 2        |                           | getPrcrmntCorpBasicInfo02     | [조달업체 기본정보]{.mark} | N/A            |
| 3        |                           | getPrcrmntCorpIndstrytyInfo02 | 조달업체업종정보조회       | N/A            |
| 4        |                           | getPrcrmntCorpSplyPrdctInfo02 | 조달업체공급물품정보조회   | N/A            |

#### \[수요기관정보조회\] 오퍼레이션 명세

|                 |                    |                                                                                                                                                                                           |                    |                  |             |
|-----------------|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|------------------|-------------|
| 오퍼레이션 정보 | 오퍼레이션 번호    | 1                                                                                                                                                                                         | 오퍼레이션명(국문) | 수요기관정보조회 |             |
|                 | 오퍼레이션 유형    | 조회(목록)                                                                                                                                                                                | 오퍼레이션명(영문) | getDminsttInfo02 |             |
|                 | 오퍼레이션 설명    | 수요기관코드, 사업자등록번호, 수요기관명을 입력하여 수요기관명, 유효기간,법인등록번호, 사업자등록번호, 소관구분명, 기관유형명, 업태명, 업종명, 주소,등록일시 등 수요기관정보 목록을 조회. |                    |                  |             |
|                 | Call Back URL      | N/A                                                                                                                                                                                       |                    |                  |             |
|                 | 최대 메시지 사이즈 | \[ 4000bytes\]                                                                                                                                                                            |                    |                  |             |
|                 | 평균 응답 시간     | \[ 500 ms\]                                                                                                                                                                               | 초당 최대 트랜잭션 |                  | \[ 30 tps\] |

##### 요청 메시지 명세

<table>
<colgroup>
<col style="width: 19%" />
<col style="width: 19%" />
<col style="width: 13%" />
<col style="width: 12%" />
<col style="width: 12%" />
<col style="width: 21%" />
</colgroup>
<tbody>
<tr class="odd">
<td>항목명(영문)</td>
<td>항목명(국문)</td>
<td>항목크기</td>
<td>항목구분</td>
<td>샘플데이터</td>
<td>항목설명</td>
</tr>
<tr class="even">
<td>numOfRows</td>
<td>한 페이지 결과 수</td>
<td>4</td>
<td>1</td>
<td>10</td>
<td>한 페이지 결과 수</td>
</tr>
<tr class="odd">
<td>pageNo</td>
<td>페이지 번호</td>
<td>4</td>
<td>1</td>
<td>1</td>
<td>페이지 번호</td>
</tr>
<tr class="even">
<td>ServiceKey</td>
<td>서비스키</td>
<td>400</td>
<td>1</td>
<td>공공데이터포털에서 받은 인증키</td>
<td>공공데이터포털에서 받은 인증키</td>
</tr>
<tr class="odd">
<td>type</td>
<td>타입</td>
<td>4</td>
<td><mark>0</mark></td>
<td>json</td>
<td>오픈API 리턴 타입을 JSON으로 받고 싶을 경우 'json' 으로 지정함</td>
</tr>
<tr class="even">
<td>inqryDiv</td>
<td>조회구분</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>검색하고자하는 조회구분 입력<br />
1: 등록일기준 검색<br />
2: 변경일기준 검색<br />
3: 사업자등록번호 기준검색</td>
</tr>
<tr class="odd">
<td>inqryBgnDt</td>
<td>조회기준시작일시</td>
<td>12</td>
<td>0</td>
<td>201301010000</td>
<td>검색하고자하는 검색기준시작일시 입력<br />
"YYYYMMDDHHMM"<br />
조회구분 1,2인 경우 필수</td>
</tr>
<tr class="even">
<td>inqryEndDt</td>
<td>조회기준종료일시</td>
<td>12</td>
<td>0</td>
<td>201312312359</td>
<td>검색하고자하는 검색기준종료일시 입력<br />
"YYYYMMDDHHMM"<br />
조회구분 1,2인 경우 필수</td>
</tr>
<tr class="odd">
<td>dminsttCd</td>
<td>수요기관코드</td>
<td>7</td>
<td>0</td>
<td>9111117</td>
<td>검색하고자하는 수요기관코드<br />
조회구분 1,2인 경우 선택</td>
</tr>
<tr class="even">
<td>dminsttNm</td>
<td>수요기관명</td>
<td>200</td>
<td>0</td>
<td>경상남도교육청 경상남도거제교육지원청 거제장평중학교</td>
<td>검색하고자하는 수요기관명<br />
조회구분 1,2인 경우 선택</td>
</tr>
<tr class="odd">
<td>bizno</td>
<td>사업자등록번호</td>
<td>10</td>
<td>0</td>
<td>6128306057</td>
<td>검색하고자하는 사업자등록번호<br />
조회구분 3인 경우 필수</td>
</tr>
</tbody>
</table>

※ 항목구분 : 필수(1), 옵션(0), 1건 이상 복수건(1..n), 0건 또는
복수건(0..n)

##### 응답 메시지 예제

|                     |                      |          |          |                                                      |                                                                                                                                                                                                                                                                                        |
|---------------------|----------------------|----------|----------|------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 항목명(영문)        | 항목명(국문)         | 항목크기 | 항목구분 | 샘플데이터                                           | 항목설명                                                                                                                                                                                                                                                                               |
| resultCode          | 결과코드             | 2        | 1        | 00                                                   | 결과코드                                                                                                                                                                                                                                                                               |
| resultMsg           | 결과메세지           | 50       | 1        | 정상.                                                | 결과메세지                                                                                                                                                                                                                                                                             |
| numOfRows           | 한 페이지 결과 수    | 4        | 1        | 10                                                   | 한 페이지 결과 수                                                                                                                                                                                                                                                                      |
| pageNo              | 페이지 번호          | 4        | 1        | 1                                                    | 페이지 번호                                                                                                                                                                                                                                                                            |
| totalCount          | 전체 결과 수         | 4        | 1        | 1                                                    | 전체 결과 수                                                                                                                                                                                                                                                                           |
| dminsttCd           | 수요기관코드         | 7        | 1        | 9111117                                              | 수요기관코드 행자부코드(행정자치부에서 부여한 기관코드)가 있는 경우 행자부코드가 행자부코드가 없는 경우 조달청에서 부여한 수요기관 코드가 표기됨                                                                                                                                       |
| vldPrdBgnDt         | 유효기간시작일시     | 19       | 0        | 2012-03-15 12:00:00                                  | 유효기간시작일시 \'YYYY-MM-DD HH:MM:SS\'                                                                                                                                                                                                                                               |
| vldPrdEndDt         | 유효기간종료일시     | 19       | 0        | 2020-12-31 12:00:00                                  | 유효기간종료일시 \'YYYY-MM-DD HH:MM:SS\'                                                                                                                                                                                                                                               |
| dminsttNm           | 수요기관명           | 200      | 0        | 경상남도교육청 경상남도거제교육지원청 거제장평중학교 | 중앙조달인 경우 조달사업에 관한 법률 제2조(정의)에 따라 수요물자의 구매 공급 또는 시설공사 계약의 체결을 조달청장에게 요청할 수 있도록 조달청장이 인정하여 등록한 기관 또는 자체전자조달시스템을 이용하는 기관인 경우 계약을 의뢰한 기관의 명으로 공고기관과 수요기관이 동일할 수 있음 |
| dminsttAbrvtNm      | 수요기관약어명       | 100      | 0        | 거제장평중학교                                       | 수요기관약어명                                                                                                                                                                                                                                                                         |
| dminsttEngNm        | 수요기관영문명       | 400      | 0        | Geoje Jangpyug Junior High School                    | 수요기관영문명                                                                                                                                                                                                                                                                         |
| corprtRgstNo        | 법인등록번호         | 13       | 0        | 1101110375818                                        | 법인등록번호                                                                                                                                                                                                                                                                           |
| bizno               | 사업자등록번호       | 10       | 0        | 6128306057                                           | 사업자등록번호                                                                                                                                                                                                                                                                         |
| jrsdctnDivNm        | 소관구분명           | 200      | 0        | 교육기관                                             | 소관구분명                                                                                                                                                                                                                                                                             |
| insttTyCdLrgclsfcNm | 기관유형코드대분류명 | 200      | 0        | 중학교                                               | 기관유형코드대분류명                                                                                                                                                                                                                                                                   |
| insttTyCdMidclsfcNm | 기관유형코드중분류명 | 200      | 0        | 중학교(본교)                                         | 기관유형코드중분류명                                                                                                                                                                                                                                                                   |
| insttTyCdSmlclsfcNm | 기관유형코드소분류명 | 200      | 0        | 공립                                                 | 기관유형코드소분류명                                                                                                                                                                                                                                                                   |
| bizcndtnNm          | 업태명               | 50       | 0        | 교육업                                               | 업태명                                                                                                                                                                                                                                                                                 |
| indstrytyNm         | 업종명               | 50       | 0        | 교육                                                 | 업종명                                                                                                                                                                                                                                                                                 |
| ofclFaxNo           | 담당자팩스번호       | 25       | 0        | 055-636-9436                                         | 담당자팩스번호                                                                                                                                                                                                                                                                         |
| rgnCd               | 지역코드             | 10       | 0        | 48310                                                | 지역코드                                                                                                                                                                                                                                                                               |
| rgnNm               | 지역명               | 200      | 0        | 경상남도 거제시                                      | 지역구분명                                                                                                                                                                                                                                                                             |
| zip                 | 우편번호             | 6        | 0        | 53270                                                | 우편번호                                                                                                                                                                                                                                                                               |
| adrs                | 주소                 | 100      | 0        | 경상남도 거제시 장평4로                              | 주소                                                                                                                                                                                                                                                                                   |
| dtlAdrs             | 상세주소             | 100      | 0        | 40-0 (장평동)                                        | 상세주소                                                                                                                                                                                                                                                                               |
| telNo               | 전화번호             | 25       | 0        | 055-636-9434                                         | 전화번호                                                                                                                                                                                                                                                                               |
| faxNo               | 팩스번호             | 25       | 0        | 055-636-9436                                         | 팩스번호                                                                                                                                                                                                                                                                               |
| hmpgAdrs            | 홈페이지주소         | 255      | 0        | www.sawoman.or.kr                                    | 홈페이지주소                                                                                                                                                                                                                                                                           |
| dltYn               | 삭제여부             | 1        | 0        | N                                                    | 삭제여부                                                                                                                                                                                                                                                                               |
| toplvlInsttCd       | 최상위기관코드       | 7        | 0        | 9010000                                              | 최상위기관코드                                                                                                                                                                                                                                                                         |
| toplvlInsttNm       | 최상위기관명         | 200      | 0        | 경상남도교육청                                       | 최상위기관명                                                                                                                                                                                                                                                                           |
| rgstDt              | 등록일시             | 19       | 0        | 2013-01-11 16:16:54                                  | 등록일시 \"YYYY-MM-DD HH:MM:SS"                                                                                                                                                                                                                                                        |
| chgDt               | 변경일시             | 19       | 0        | 2025-01-15 10:38:52                                  | 변경일시 \"YYYY-MM-DD HH:MM:SS"                                                                                                                                                                                                                                                        |

※ 항목구분 : 필수(1), 옵션(0), 1건 이상 복수건(1..n), 0건 또는
복수건(0..n)

##### 요청 / 응답 메시지 예제 {#요청-응답-메시지-예제}

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td>REST(URI)</td>
</tr>
<tr class="even">
<td>http://apis.data.go.kr/1230000/ao/UsrInfoService02/getDminsttInfo02?inqryDiv=1&amp;inqryBgnDt=201301010000&amp;inqryEndDt=201312312359&amp;dminsttCd=9111117&amp;pageNo=1&amp;numOfRows=10&amp;ServiceKey=인증키</td>
</tr>
<tr class="odd">
<td>응답 메시지</td>
</tr>
<tr class="even">
<td><p>&lt;response&gt;</p>
<p>&lt;header&gt;</p>
<p>&lt;resultCode&gt;00&lt;/resultCode&gt;</p>
<p>&lt;resultMsg&gt;정상&lt;/resultMsg&gt;</p>
<p>&lt;/header&gt;</p>
<p>&lt;body&gt;</p>
<p>&lt;items&gt;</p>
<p>&lt;item&gt;</p>
<p>&lt;dminsttCd&gt;9111117&lt;/dminsttCd&gt;</p>
<p>&lt;vldPrdBgnDt&gt;&lt;/vldPrdBgnDt&gt;</p>
<p>&lt;vldPrdEndDt&gt;&lt;/vldPrdEndDt&gt;</p>
<p>&lt;dminsttNm&gt;경상남도교육청 경상남도거제교육지원청
거제장평중학교&lt;/dminsttNm&gt;</p>
<p>&lt;dminsttAbrvtNm&gt;거제장평중학교&lt;/dminsttAbrvtNm&gt;</p>
<p>&lt;dminsttEngNm&gt;Geoje Jangpyug Junior High
School&lt;/dminsttEngNm&gt;</p>
<p>&lt;corprtRgstNo&gt;&lt;/corprtRgstNo&gt;</p>
<p>&lt;bizno&gt;6128306057&lt;/bizno&gt;</p>
<p>&lt;jrsdctnDivNm&gt;교육기관&lt;/jrsdctnDivNm&gt;</p>
<p>&lt;insttTyCdLrgclsfcNm&gt;중학교&lt;/insttTyCdLrgclsfcNm&gt;</p>
<p>&lt;insttTyCdMidclsfcNm&gt;중학교(본교)&lt;/insttTyCdMidclsfcNm&gt;</p>
<p>&lt;insttTyCdSmlclsfcNm&gt;공립 &lt;/insttTyCdSmlclsfcNm&gt;</p>
<p>&lt;bizcndtnNm&gt;&lt;/bizcndtnNm&gt;</p>
<p>&lt;indstrytyNm&gt;&lt;/indstrytyNm&gt;</p>
<p>&lt;ofclFaxNo&gt;055-636-9436&lt;/ofclFaxNo&gt;</p>
<p>&lt;rgnCd&gt;48310&lt;/rgnCd&gt;</p>
<p>&lt;rgnNm&gt;경상남도 거제시&lt;/rgnNm&gt;</p>
<p>&lt;zip&gt;53270&lt;/zip&gt;</p>
<p>&lt;adrs&gt;경상남도 거제시 장평4로&lt;/adrs&gt;</p>
<p>&lt;dtlAdrs&gt;40-0 (장평동)&lt;/dtlAdrs&gt;</p>
<p>&lt;telNo&gt;055-636-9434&lt;/telNo&gt;</p>
<p>&lt;faxNo&gt;055-636-9436&lt;/faxNo&gt;</p>
<p>&lt;hmpgAdrs&gt;&lt;/hmpgAdrs&gt;</p>
<p>&lt;dltYn&gt;N&lt;/dltYn&gt;</p>
<p>&lt;toplvlInsttCd&gt;9010000&lt;/toplvlInsttCd&gt;</p>
<p>&lt;toplvlInsttNm&gt;경상남도교육청&lt;/toplvlInsttNm&gt;</p>
<p>&lt;rgstDt&gt;2013-01-11 16:16:54&lt;/rgstDt&gt;</p>
<p>&lt;chgDt&gt;2025-01-15 10:38:52&lt;/chgDt&gt;</p>
<p>&lt;/item&gt;</p>
<p>&lt;/items&gt;</p>
<p>&lt;numOfRows&gt;10&lt;/numOfRows&gt;</p>
<p>&lt;pageNo&gt;1&lt;/pageNo&gt;</p>
<p>&lt;totalCount&gt;1&lt;/totalCount&gt;</p>
<p>&lt;/body&gt;</p>
<p>&lt;/response&gt;</p></td>
</tr>
</tbody>
</table>

#### \[[조달업체 기본정보]{.mark}\] 오퍼레이션 명세

|                 |                    |                                                                                                                                                                                                                                                                                                                                                          |                    |                            |             |
|-----------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|----------------------------|-------------|
| 오퍼레이션 정보 | 오퍼레이션 번호    | 2                                                                                                                                                                                                                                                                                                                                                        | 오퍼레이션명(국문) | [조달업체 기본정보]{.mark} |             |
|                 | 오퍼레이션 유형    | 조회(목록)                                                                                                                                                                                                                                                                                                                                               | 오퍼레이션명(영문) | getPrcrmntCorpBasicInfo02  |             |
|                 | 오퍼레이션 설명    | 검색조건에 사업자등록번호와 업체명을 입력하여 사업자등록번호, 업체명, 영문업체명, 개업일시, 지역코드, 지역명, 우편번호, 주소, 상세주소, 전화번호, 팩스번호, 국가명, 홈페이지주소, 제조구분코드, 제조구분명, 종업원수, 업체업무구분코드, 업체업무구분명, 본사구분명, 등록일시, 변경일시, 고유번호증명등록여부, 대표자명 등 조달업체 기본정보 목록을 조회. |                    |                            |             |
|                 | Call Back URL      | N/A                                                                                                                                                                                                                                                                                                                                                      |                    |                            |             |
|                 | 최대 메시지 사이즈 | \[ 4000bytes\]                                                                                                                                                                                                                                                                                                                                           |                    |                            |             |
|                 | 평균 응답 시간     | \[ 500 ms\]                                                                                                                                                                                                                                                                                                                                              | 초당 최대 트랜잭션 |                            | \[ 30 tps\] |

##### 요청 메시지 명세

<table>
<colgroup>
<col style="width: 19%" />
<col style="width: 19%" />
<col style="width: 13%" />
<col style="width: 12%" />
<col style="width: 12%" />
<col style="width: 21%" />
</colgroup>
<tbody>
<tr class="odd">
<td>항목명(영문)</td>
<td>항목명(국문)</td>
<td>항목크기</td>
<td>항목구분</td>
<td>샘플데이터</td>
<td>항목설명</td>
</tr>
<tr class="even">
<td>numOfRows</td>
<td>한 페이지 결과 수</td>
<td>4</td>
<td>1</td>
<td>10</td>
<td>한 페이지 결과 수</td>
</tr>
<tr class="odd">
<td>pageNo</td>
<td>페이지 번호</td>
<td>4</td>
<td>1</td>
<td>1</td>
<td>페이지 번호</td>
</tr>
<tr class="even">
<td>ServiceKey</td>
<td>서비스키</td>
<td>400</td>
<td>1</td>
<td>공공데이터포털에서 받은 인증키</td>
<td>공공데이터포털에서 받은 인증키</td>
</tr>
<tr class="odd">
<td>type</td>
<td>타입</td>
<td>4</td>
<td><mark>0</mark></td>
<td>json</td>
<td>오픈API 리턴 타입을 JSON으로 받고 싶을 경우 'json' 으로 지정함</td>
</tr>
<tr class="even">
<td>inqryDiv</td>
<td>조회구분</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>검색하고자하는 조회구분 입력<br />
1: 등록일기준 검색<br />
2: 변경일기준검색<br />
3: 사업자등록번호 기준검색</td>
</tr>
<tr class="odd">
<td>inqryBgnDt</td>
<td>조회기준시작일시</td>
<td>12</td>
<td>0</td>
<td>200101010000</td>
<td>검색하고자하는 검색기준시작일시 입력<br />
"YYYYMMDDHHMM"<br />
조회구분 1,2인 경우 필수</td>
</tr>
<tr class="even">
<td>inqryEndDt</td>
<td>조회기준종료일시</td>
<td>12</td>
<td>0</td>
<td>200112312359</td>
<td>검색하고자하는 검색기준종료일시 입력<br />
"YYYYMMDDHHMM"<br />
조회구분 1,2인 경우 필수</td>
</tr>
<tr class="odd">
<td>corpNm</td>
<td>업체명</td>
<td>100</td>
<td>0</td>
<td>주식회사청마토건</td>
<td>검색하고자 하는 업체명<br />
조회구분 1,2인 경우 선택</td>
</tr>
<tr class="even">
<td>bizno</td>
<td>사업자등록번호</td>
<td>10</td>
<td>0</td>
<td>6168122531</td>
<td>검색하고자 하는 사업자등록번호<br />
조회구분 3인 경우 필수</td>
</tr>
</tbody>
</table>

※ 항목구분 : 필수(1), 옵션(0), 1건 이상 복수건(1..n), 0건 또는
복수건(0..n)

##### 응답 메시지 예제

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 20%" />
<col style="width: 14%" />
<col style="width: 10%" />
<col style="width: 14%" />
<col style="width: 21%" />
</colgroup>
<tbody>
<tr class="odd">
<td>항목명(영문)</td>
<td>항목명(국문)</td>
<td>항목크기</td>
<td>항목구분</td>
<td>샘플데이터</td>
<td>항목설명</td>
</tr>
<tr class="even">
<td>resultCode</td>
<td>결과코드</td>
<td>2</td>
<td>1</td>
<td>00</td>
<td>결과코드</td>
</tr>
<tr class="odd">
<td>resultMsg</td>
<td>결과메세지</td>
<td>50</td>
<td>1</td>
<td>정상.</td>
<td>결과메세지</td>
</tr>
<tr class="even">
<td>numOfRows</td>
<td>한 페이지 결과 수</td>
<td>4</td>
<td>1</td>
<td>10</td>
<td>한 페이지 결과 수</td>
</tr>
<tr class="odd">
<td>pageNo</td>
<td>페이지 번호</td>
<td>4</td>
<td>1</td>
<td>1</td>
<td>페이지 번호</td>
</tr>
<tr class="even">
<td>totalCount</td>
<td>전체 결과 수</td>
<td>4</td>
<td>1</td>
<td>1</td>
<td>전체 결과 수</td>
</tr>
<tr class="odd">
<td>bizno</td>
<td>사업자등록번호</td>
<td>10</td>
<td>1</td>
<td>6168122531</td>
<td>조달업체의 사업자등록번호</td>
</tr>
<tr class="even">
<td>corpNm</td>
<td>업체명</td>
<td>100</td>
<td>0</td>
<td>주식회사청마토건</td>
<td>입찰참가자격 등록한 업체명</td>
</tr>
<tr class="odd">
<td>engCorpNm</td>
<td>영문업체명</td>
<td>100</td>
<td>0</td>
<td>cheongma CO.LTD</td>
<td>영문업체명</td>
</tr>
<tr class="even">
<td>opbizDt</td>
<td>개업일시</td>
<td>19</td>
<td>0</td>
<td>1997-12-15 12:00:00</td>
<td>개업일시 "YYYY-MM-DD HH:MM:SS"</td>
</tr>
<tr class="odd">
<td>rgnCd</td>
<td>지역코드</td>
<td>10</td>
<td>0</td>
<td>50110</td>
<td>조달업체의 지역코드</td>
</tr>
<tr class="even">
<td>rgnNm</td>
<td>지역명</td>
<td>200</td>
<td>0</td>
<td>제주특별자치도 제주시 구좌읍 김녕리</td>
<td>조달업체의 지역명</td>
</tr>
<tr class="odd">
<td>zip</td>
<td>우편번호</td>
<td>6</td>
<td>0</td>
<td>63348</td>
<td>조달업체의 우편번호</td>
</tr>
<tr class="even">
<td>adrs</td>
<td>주소</td>
<td>100</td>
<td>0</td>
<td>제주특별자치도 제주시 구좌읍 김녕남2길</td>
<td>조달업체의 주소</td>
</tr>
<tr class="odd">
<td>dtlAdrs</td>
<td>상세주소</td>
<td>100</td>
<td>0</td>
<td>17 (거웅 라피네2차) 105동 제비101호</td>
<td>조달업체의 상세주소</td>
</tr>
<tr class="even">
<td>telNo</td>
<td>전화번호</td>
<td>25</td>
<td>0</td>
<td>064-712-0471</td>
<td>조달업체의 전화번호</td>
</tr>
<tr class="odd">
<td>faxNo</td>
<td>팩스번호</td>
<td>25</td>
<td>0</td>
<td>064-712-0472</td>
<td>조달업체의 팩스번호</td>
</tr>
<tr class="even">
<td>cntryNm</td>
<td>국가명</td>
<td>200</td>
<td>0</td>
<td>대한민국</td>
<td>조달업체의 국가명</td>
</tr>
<tr class="odd">
<td>hmpgAdrs</td>
<td>홈페이지주소</td>
<td>255</td>
<td>0</td>
<td>www.aaa.co.kr</td>
<td>조달업체의 홈페이지주소</td>
</tr>
<tr class="even">
<td>mnfctDivCd</td>
<td>제조구분코드</td>
<td>2</td>
<td>0</td>
<td>제240002</td>
<td>제조구분코드 제240001:제조<br />
제240002:공급</td>
</tr>
<tr class="odd">
<td>mnfctDivNm</td>
<td>제조구분명</td>
<td>200</td>
<td>0</td>
<td>공급</td>
<td>제조구분명</td>
</tr>
<tr class="even">
<td>emplyeNum</td>
<td>종업원수</td>
<td>10</td>
<td>0</td>
<td>7</td>
<td>조달업체의 종업원수</td>
</tr>
<tr class="odd">
<td>corpBsnsDivCd</td>
<td>업체업무구분코드</td>
<td>20</td>
<td>0</td>
<td>01,07</td>
<td>업체업무구분코드<br />
01 : 물품 07 : 공사<br />
05 : 용역 03 :일반용역<br />
02,04 : 외자</td>
</tr>
<tr class="even">
<td>corpBsnsDivNm</td>
<td>업체업무구분명</td>
<td>200</td>
<td>0</td>
<td>물품,공사</td>
<td>업체업무구분명</td>
</tr>
<tr class="odd">
<td>hdoffceDivNm</td>
<td>본사구분명</td>
<td>100</td>
<td>1</td>
<td>본사</td>
<td>본사구분명</td>
</tr>
<tr class="even">
<td>rgstDt</td>
<td>등록일시</td>
<td>19</td>
<td>0</td>
<td>2001-08-22 00:00:00</td>
<td>등록일시 "YYYY-MM-DD HH:MM:SS"</td>
</tr>
<tr class="odd">
<td>chgDt</td>
<td>변경일시</td>
<td>19</td>
<td>0</td>
<td>2025-07-26 07:00:37</td>
<td>변경일시 "YYYY-MM-DD HH:MM:SS"</td>
</tr>
<tr class="even">
<td>esntlNoCertRgstYn</td>
<td>고유번호증명등록여부</td>
<td>1</td>
<td>0</td>
<td>N</td>
<td>고유번호증명등록여부가 'Y'이면 해당 업체의 관련법규(조항조)를 알 수
있음<br />
법령으로 지정된 비영리법인,사회복지사업,금융사업 등 등록여부<br />
ex)장애인복지시설, 국민연금사업, 농업협동조합</td>
</tr>
<tr class="odd">
<td>ceoNm</td>
<td>대표자명</td>
<td>35</td>
<td>0</td>
<td>이동환</td>
<td>대표자명</td>
</tr>
</tbody>
</table>

※ 항목구분 : 필수(1), 옵션(0), 1건 이상 복수건(1..n), 0건 또는
복수건(0..n)

##### 요청 / 응답 메시지 예제 {#요청-응답-메시지-예제-1}

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td>REST(URI)</td>
</tr>
<tr class="even">
<td>http://apis.data.go.kr/1230000/ao/UsrInfoService02/getPrcrmntCorpBasicInfo02?inqryDiv=3&amp;bizno=6168122531&amp;pageNo=1&amp;numOfRows=10&amp;ServiceKey=인증키</td>
</tr>
<tr class="odd">
<td>응답 메시지</td>
</tr>
<tr class="even">
<td><p>&lt;response&gt;</p>
<p>&lt;header&gt;</p>
<p>&lt;resultCode&gt;00&lt;/resultCode&gt;</p>
<p>&lt;resultMsg&gt;정상&lt;/resultMsg&gt;</p>
<p>&lt;/header&gt;</p>
<p>&lt;body&gt;</p>
<p>&lt;items&gt;</p>
<p>&lt;item&gt;</p>
<p>&lt;bizno&gt;6168122531&lt;/bizno&gt;</p>
<p>&lt;corpNm&gt;주식회사청마토건&lt;/corpNm&gt;</p>
<p>&lt;engCorpNm&gt;cheongma CO.LTD&lt;/engCorpNm&gt;</p>
<p>&lt;opbizDt&gt;1997-12-15 00:00:00&lt;/opbizDt&gt;</p>
<p>&lt;rgnCd&gt;50110&lt;/rgnCd&gt;</p>
<p>&lt;rgnNm&gt;제주특별자치도 제주시 구좌읍 김녕리&lt;/rgnNm&gt;</p>
<p>&lt;zip&gt;63348&lt;/zip&gt;</p>
<p>&lt;adrs&gt;제주특별자치도 제주시 구좌읍 김녕남2길&lt;/adrs&gt;</p>
<p>&lt;dtlAdrs&gt;17 (거웅 라피네2차) 105동
제비101호&lt;/dtlAdrs&gt;</p>
<p>&lt;telNo&gt;064-712-0471&lt;/telNo&gt;</p>
<p>&lt;faxNo&gt;064-712-0472&lt;/faxNo&gt;</p>
<p>&lt;cntryNm&gt;대한민국&lt;/cntryNm&gt;</p>
<p>&lt;hmpgAdrs&gt;&lt;/hmpgAdrs&gt;</p>
<p>&lt;mnfctDivCd&gt;제240002&lt;/mnfctDivCd&gt;</p>
<p>&lt;mnfctDivNm&gt;공급&lt;/mnfctDivNm&gt;</p>
<p>&lt;emplyeNum&gt;7&lt;/emplyeNum&gt;</p>
<p>&lt;corpBsnsDivCd&gt;01,07&lt;/corpBsnsDivCd&gt;</p>
<p>&lt;corpBsnsDivNm&gt;물품,공사&lt;/corpBsnsDivNm&gt;</p>
<p>&lt;hdoffceDivNm&gt;본사&lt;/hdoffceDivNm&gt;</p>
<p>&lt;rgstDt&gt;2001-08-22 00:00:00&lt;/rgstDt&gt;</p>
<p>&lt;chgDt&gt;2025-07-26 07:00:37&lt;/chgDt&gt;</p>
<p>&lt;esntlNoCertRgstYn&gt;N&lt;/esntlNoCertRgstYn&gt;</p>
<p>&lt;ceoNm&gt;이동환&lt;/ceoNm&gt;</p>
<p>&lt;/item&gt;</p>
<p>&lt;/items&gt;</p>
<p>&lt;numOfRows&gt;10&lt;/numOfRows&gt;</p>
<p>&lt;pageNo&gt;1&lt;/pageNo&gt;</p>
<p>&lt;totalCount&gt;1&lt;/totalCount&gt;</p>
<p>&lt;/body&gt;</p>
<p>&lt;/response&gt;</p></td>
</tr>
</tbody>
</table>

#### \[조달업체업종정보조회\] 오퍼레이션 명세

|                 |                    |                                                                                                                                                                                         |                    |                               |             |
|-----------------|--------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|-------------------------------|-------------|
| 오퍼레이션 정보 | 오퍼레이션 번호    | 3                                                                                                                                                                                       | 오퍼레이션명(국문) | 조달업체업종정보조회          |             |
|                 | 오퍼레이션 유형    | 조회(목록)                                                                                                                                                                              | 오퍼레이션명(영문) | getPrcrmntCorpIndstrytyInfo02 |             |
|                 | 오퍼레이션 설명    | 검색조건에 사업자등록번호를 입력하여 사업자등록번호, 업종코드, 업종명, 등록일시, 유효기간만료일시, 시스템등록일시, 변경일시, 업종상태명, 대표업종여부 등 조달업체 업종정보 목록을 조회. |                    |                               |             |
|                 | Call Back URL      | N/A                                                                                                                                                                                     |                    |                               |             |
|                 | 최대 메시지 사이즈 | \[ 4000bytes\]                                                                                                                                                                          |                    |                               |             |
|                 | 평균 응답 시간     | \[ 500 ms\]                                                                                                                                                                             | 초당 최대 트랜잭션 |                               | \[ 30 tps\] |

##### 요청 메시지 명세

<table>
<colgroup>
<col style="width: 19%" />
<col style="width: 19%" />
<col style="width: 13%" />
<col style="width: 12%" />
<col style="width: 12%" />
<col style="width: 21%" />
</colgroup>
<tbody>
<tr class="odd">
<td>항목명(영문)</td>
<td>항목명(국문)</td>
<td>항목크기</td>
<td>항목구분</td>
<td>샘플데이터</td>
<td>항목설명</td>
</tr>
<tr class="even">
<td>numOfRows</td>
<td>한 페이지 결과 수</td>
<td>4</td>
<td>1</td>
<td>10</td>
<td>한 페이지 결과 수</td>
</tr>
<tr class="odd">
<td>pageNo</td>
<td>페이지 번호</td>
<td>4</td>
<td>1</td>
<td>1</td>
<td>페이지 번호</td>
</tr>
<tr class="even">
<td>ServiceKey</td>
<td>서비스키</td>
<td>400</td>
<td>1</td>
<td>공공데이터포털에서 받은 인증키</td>
<td>공공데이터포털에서 받은 인증키</td>
</tr>
<tr class="odd">
<td>type</td>
<td>타입</td>
<td>4</td>
<td><mark>0</mark></td>
<td>json</td>
<td>오픈API 리턴 타입을 JSON으로 받고 싶을 경우 'json' 으로 지정함</td>
</tr>
<tr class="even">
<td>inqryDiv</td>
<td>조회구분</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td><p>검색하고자하는 조회구분 입력<br />
1: 사업자등록번호 기준검색</p>
<p>2: 시스템등록일기준 검색<br />
3:시스템변경일기준검색</p></td>
</tr>
<tr class="odd">
<td>bizno</td>
<td>사업자등록번호</td>
<td>10</td>
<td>0</td>
<td>3068134668</td>
<td>검색하고자 하는 사업자등록번호 조회구분 1 일경우 필수</td>
</tr>
<tr class="even">
<td>inqryBgnDt</td>
<td>조회기준시작일시</td>
<td>12</td>
<td>0</td>
<td>201501010000</td>
<td>검색하고자하는 검색기준시작일시 입력<br />
"YYYYMMDDHHMM"<br />
조회구분 2,3인 경우 필수</td>
</tr>
<tr class="odd">
<td>inqryEndDt</td>
<td>조회기준종료일시</td>
<td>12</td>
<td>0</td>
<td>201512302359</td>
<td>검색하고자하는 검색기준종료일시 입력<br />
"YYYYMMDDHHMM"<br />
조회구분 2,3인 경우 필수</td>
</tr>
</tbody>
</table>

※ 항목구분 : 필수(1), 옵션(0), 1건 이상 복수건(1..n), 0건 또는
복수건(0..n)

##### 응답 메시지 예제

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 20%" />
<col style="width: 14%" />
<col style="width: 10%" />
<col style="width: 14%" />
<col style="width: 21%" />
</colgroup>
<tbody>
<tr class="odd">
<td>항목명(영문)</td>
<td>항목명(국문)</td>
<td>항목크기</td>
<td>항목구분</td>
<td>샘플데이터</td>
<td>항목설명</td>
</tr>
<tr class="even">
<td>resultCode</td>
<td>결과코드</td>
<td>2</td>
<td>1</td>
<td>00</td>
<td>결과코드</td>
</tr>
<tr class="odd">
<td>resultMsg</td>
<td>결과메세지</td>
<td>50</td>
<td>1</td>
<td>정상.</td>
<td>결과메세지</td>
</tr>
<tr class="even">
<td>numOfRows</td>
<td>한 페이지 결과 수</td>
<td>4</td>
<td>1</td>
<td>10</td>
<td>한 페이지 결과 수</td>
</tr>
<tr class="odd">
<td>pageNo</td>
<td>페이지 번호</td>
<td>4</td>
<td>1</td>
<td>1</td>
<td>페이지 번호</td>
</tr>
<tr class="even">
<td>totalCount</td>
<td>전체 결과 수</td>
<td>4</td>
<td>1</td>
<td>1</td>
<td>전체 결과 수</td>
</tr>
<tr class="odd">
<td>bizno</td>
<td>사업자등록번호</td>
<td>10</td>
<td>1</td>
<td>3068134668</td>
<td>사업자등록번호</td>
</tr>
<tr class="even">
<td>indstrytyNm</td>
<td>업종명</td>
<td>200</td>
<td>0</td>
<td>토목공사업</td>
<td>업종명</td>
</tr>
<tr class="odd">
<td>indstrytyCd</td>
<td>업종코드</td>
<td>4</td>
<td>0</td>
<td>0001</td>
<td>업종코드</td>
</tr>
<tr class="even">
<td>rgstDt</td>
<td>등록일시</td>
<td>19</td>
<td>0</td>
<td>2014-03-04 00:00:00</td>
<td><p>등록일시</p>
<p>“YYYY-MM-DD HH:MM:SS”</p></td>
</tr>
<tr class="odd">
<td>vldPrdExprtDt</td>
<td>유효기간만료일시</td>
<td>19</td>
<td>0</td>
<td>2017-04-02 00:00:00</td>
<td><p>유효기간만료일시</p>
<p>“YYYY-MM-DD HH:MM:SS”</p></td>
</tr>
<tr class="even">
<td>systmRgstDt</td>
<td>시스템등록일시</td>
<td>19</td>
<td>0</td>
<td>2014-03-10 16:40:27</td>
<td><p>시스템등록일시</p>
<p>“YYYY-MM-DD HH:MM:SS”</p></td>
</tr>
<tr class="odd">
<td>chgDt</td>
<td>변경일시</td>
<td>19</td>
<td>0</td>
<td>2015-07-31 17:36:49</td>
<td><p>변경일시</p>
<p>“YYYY-MM-DD HH:MM:SS”</p></td>
</tr>
<tr class="even">
<td>indstrytyStatsNm</td>
<td>업종상태명</td>
<td>200</td>
<td>0</td>
<td>유효기간 경과</td>
<td>업종상태명</td>
</tr>
<tr class="odd">
<td>rprsntIndstrytyYn</td>
<td>대표업종여부</td>
<td>1</td>
<td>0</td>
<td>N</td>
<td>대표업종여부 [Y/N]</td>
</tr>
<tr class="even">
<td>systmChgDt</td>
<td>시스템변경일시</td>
<td>19</td>
<td>0</td>
<td>2014-03-10 16:40:27</td>
<td><p>시스템변경일시</p>
<p>“YYYY-MM-DD HH:MM:SS”</p></td>
</tr>
</tbody>
</table>

※ 항목구분 : 필수(1), 옵션(0), 1건 이상 복수건(1..n), 0건 또는
복수건(0..n)

##### 요청 / 응답 메시지 예제 {#요청-응답-메시지-예제-2}

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td>REST(URI)</td>
</tr>
<tr class="even">
<td>http://apis.data.go.kr/1230000/ao/UsrInfoService02/getPrcrmntCorpIndstrytyInfo02?bizno=3068134668&amp;pageNo=1&amp;numOfRows=10&amp;ServiceKey=인증키</td>
</tr>
<tr class="odd">
<td>응답 메시지</td>
</tr>
<tr class="even">
<td><p>&lt;response&gt;</p>
<p>&lt;header&gt;</p>
<p>&lt;resultCode&gt;00&lt;/resultCode&gt;</p>
<p>&lt;resultMsg&gt;정상&lt;/resultMsg&gt;</p>
<p>&lt;/header&gt;</p>
<p>&lt;body&gt;</p>
<p>&lt;items&gt;</p>
<p>&lt;item&gt;</p>
<p>&lt;bizno&gt;3068134668&lt;/bizno&gt;</p>
<p>&lt;indstrytyNm&gt;토목공사업&lt;/indstrytyNm&gt;</p>
<p>&lt;indstrytyCd&gt;0001&lt;/indstrytyCd&gt;</p>
<p>&lt;rgstDt&gt;2014-03-04 00:00:00&lt;/rgstDt&gt;</p>
<p>&lt;vldPrdExprtDt&gt;2017-04-02 00:00:00&lt;/vldPrdExprtDt&gt;</p>
<p>&lt;systmRgstDt&gt;2014-03-10 16:40:27&lt;/systmRgstDt&gt;</p>
<p>&lt;chgDt&gt;2015-07-31 17:36:49&lt;/chgDt&gt;</p>
<p>&lt;indstrytyStatsNm&gt;유효기간 경과&lt;/indstrytyStatsNm&gt;</p>
<p>&lt;rprsntIndstrytyYn&gt;N&lt;/rprsntIndstrytyYn&gt;</p>
<p>&lt;systmChgDt&gt;2014-03-10 16:40:27&lt;/systmChgDt&gt;</p>
<p>&lt;/item&gt;</p>
<p>&lt;item&gt;</p>
<p>&lt;bizno&gt;3068134668&lt;/bizno&gt;</p>
<p>&lt;indstrytyNm&gt;건축공사업&lt;/indstrytyNm&gt;</p>
<p>&lt;indstrytyCd&gt;0002&lt;/indstrytyCd&gt;</p>
<p>&lt;rgstDt&gt;2015-12-22 00:00:00&lt;/rgstDt&gt;</p>
<p>&lt;vldPrdExprtDt&gt;&lt;/vldPrdExprtDt&gt;</p>
<p>&lt;systmRgstDt&gt;1900-01-01 00:00:00&lt;/systmRgstDt&gt;</p>
<p>&lt;chgDt&gt;2018-06-01 17:36:45&lt;/chgDt&gt;</p>
<p>&lt;indstrytyStatsNm&gt;&lt;/indstrytyStatsNm&gt;</p>
<p>&lt;rprsntIndstrytyYn&gt;Y&lt;/rprsntIndstrytyYn&gt;</p>
<p>&lt;systmChgDt&gt;2015-12-23 11:28:12&lt;/systmChgDt&gt;</p>
<p>&lt;/item&gt;</p>
<p>&lt;item&gt;</p>
<p>&lt;bizno&gt;3068134668&lt;/bizno&gt;</p>
<p>&lt;indstrytyNm&gt;토목건축공사업&lt;/indstrytyNm&gt;</p>
<p>&lt;indstrytyCd&gt;0003&lt;/indstrytyCd&gt;</p>
<p>&lt;rgstDt&gt;2014-03-04 00:00:00&lt;/rgstDt&gt;</p>
<p>&lt;vldPrdExprtDt&gt;2017-04-02 00:00:00&lt;/vldPrdExprtDt&gt;</p>
<p>&lt;systmRgstDt&gt;2014-03-10 16:40:27&lt;/systmRgstDt&gt;</p>
<p>&lt;chgDt&gt;2015-07-31 17:36:49&lt;/chgDt&gt;</p>
<p>&lt;indstrytyStatsNm&gt;유효기간 경과&lt;/indstrytyStatsNm&gt;</p>
<p>&lt;rprsntIndstrytyYn&gt;N&lt;/rprsntIndstrytyYn&gt;</p>
<p>&lt;systmChgDt&gt;2014-03-10 16:40:27&lt;/systmChgDt&gt;</p>
<p>&lt;/item&gt;</p>
<p>&lt;/items&gt;</p>
<p>&lt;numOfRows&gt;10&lt;/numOfRows&gt;</p>
<p>&lt;pageNo&gt;1&lt;/pageNo&gt;</p>
<p>&lt;totalCount&gt;3&lt;/totalCount&gt;</p>
<p>&lt;/body&gt;</p>
<p>&lt;/response&gt;</p></td>
</tr>
</tbody>
</table>

#### \[조달업체공급물품정보조회\] 오퍼레이션 명세

|                 |                    |                                                                                                                                                     |                    |                               |             |
|-----------------|--------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|-------------------------------|-------------|
| 오퍼레이션 정보 | 오퍼레이션 번호    | 4                                                                                                                                                   | 오퍼레이션명(국문) | 조달업체공급물품정보조회      |             |
|                 | 오퍼레이션 유형    | 조회(목록)                                                                                                                                          | 오퍼레이션명(영문) | getPrcrmntCorpSplyPrdctInfo02 |             |
|                 | 오퍼레이션 설명    | 검색조건에 사업자등록번호를 입력하여 사업자등록번호, 세부품명, 세부품명번호, 등록일시, 변경일시, 대표품명여부 등 조달업체 공급물품정보 목록을 조회. |                    |                               |             |
|                 | Call Back URL      | N/A                                                                                                                                                 |                    |                               |             |
|                 | 최대 메시지 사이즈 | \[ 4000bytes\]                                                                                                                                      |                    |                               |             |
|                 | 평균 응답 시간     | \[ 500 ms\]                                                                                                                                         | 초당 최대 트랜잭션 |                               | \[ 30 tps\] |

##### 요청 메시지 명세

<table>
<colgroup>
<col style="width: 19%" />
<col style="width: 19%" />
<col style="width: 13%" />
<col style="width: 12%" />
<col style="width: 12%" />
<col style="width: 21%" />
</colgroup>
<tbody>
<tr class="odd">
<td>항목명(영문)</td>
<td>항목명(국문)</td>
<td>항목크기</td>
<td>항목구분</td>
<td>샘플데이터</td>
<td>항목설명</td>
</tr>
<tr class="even">
<td>numOfRows</td>
<td>한 페이지 결과 수</td>
<td>4</td>
<td>1</td>
<td>10</td>
<td>한 페이지 결과 수</td>
</tr>
<tr class="odd">
<td>pageNo</td>
<td>페이지 번호</td>
<td>4</td>
<td>1</td>
<td>1</td>
<td>페이지 번호</td>
</tr>
<tr class="even">
<td>ServiceKey</td>
<td>서비스키</td>
<td>400</td>
<td>1</td>
<td>공공데이터포털에서 받은 인증키</td>
<td>공공데이터포털에서 받은 인증키</td>
</tr>
<tr class="odd">
<td>type</td>
<td>타입</td>
<td>4</td>
<td><mark>0</mark></td>
<td>json</td>
<td>오픈API 리턴 타입을 JSON으로 받고 싶을 경우 'json' 으로 지정함</td>
</tr>
<tr class="even">
<td>inqryDiv</td>
<td>조회구분</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td><p>검색하고자하는 조회구분 입력<br />
1: 사업자등록번호 기준검색</p>
<p>2: 등록일기준 검색<br />
3: 변경일기준검색</p></td>
</tr>
<tr class="odd">
<td>bizno</td>
<td>사업자등록번호</td>
<td>10</td>
<td>0</td>
<td>8633000223</td>
<td>검색하고자 하는 사업자등록번호</td>
</tr>
<tr class="even">
<td>inqryBgnDt</td>
<td>조회기준시작일시</td>
<td>12</td>
<td>0</td>
<td>202404010000</td>
<td>검색하고자하는 검색기준시작일시 입력<br />
"YYYYMMDDHHMM"<br />
조회구분 2,3인 경우 필수</td>
</tr>
<tr class="odd">
<td>inqryEndDt</td>
<td>조회기준종료일시</td>
<td>12</td>
<td>0</td>
<td>202404302359</td>
<td>검색하고자하는 검색기준종료일시 입력<br />
"YYYYMMDDHHMM"<br />
조회구분 2,3인 경우 필수</td>
</tr>
</tbody>
</table>

※ 항목구분 : 필수(1), 옵션(0), 1건 이상 복수건(1..n), 0건 또는
복수건(0..n)

##### 응답 메시지 예제

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 20%" />
<col style="width: 14%" />
<col style="width: 10%" />
<col style="width: 14%" />
<col style="width: 21%" />
</colgroup>
<tbody>
<tr class="odd">
<td>항목명(영문)</td>
<td>항목명(국문)</td>
<td>항목크기</td>
<td>항목구분</td>
<td>샘플데이터</td>
<td>항목설명</td>
</tr>
<tr class="even">
<td>resultCode</td>
<td>결과코드</td>
<td>2</td>
<td>1</td>
<td>00</td>
<td>결과코드</td>
</tr>
<tr class="odd">
<td>resultMsg</td>
<td>결과메세지</td>
<td>50</td>
<td>1</td>
<td>정상.</td>
<td>결과메세지</td>
</tr>
<tr class="even">
<td>numOfRows</td>
<td>한 페이지 결과 수</td>
<td>4</td>
<td>1</td>
<td>10</td>
<td>한 페이지 결과 수</td>
</tr>
<tr class="odd">
<td>pageNo</td>
<td>페이지 번호</td>
<td>4</td>
<td>1</td>
<td>1</td>
<td>페이지 번호</td>
</tr>
<tr class="even">
<td>totalCount</td>
<td>전체 결과 수</td>
<td>4</td>
<td>1</td>
<td>1</td>
<td>전체 결과 수</td>
</tr>
<tr class="odd">
<td>bizno</td>
<td>사업자등록번호</td>
<td>10</td>
<td>1</td>
<td>8633000223</td>
<td>사업자등록번호</td>
</tr>
<tr class="even">
<td>dtilPrdctClsfcNoNm</td>
<td>세부품명</td>
<td>200</td>
<td>0</td>
<td>프린트및복사용지</td>
<td>세부품명번호 10자리에 대한 한글명</td>
</tr>
<tr class="odd">
<td>dtilPrdctClsfcNo</td>
<td>세부품명번호</td>
<td>10</td>
<td>0</td>
<td>1411150701</td>
<td>품명에 대한 분류번호로서 10자리로 표시</td>
</tr>
<tr class="even">
<td>rgstDt</td>
<td>등록일시</td>
<td>19</td>
<td>0</td>
<td>2024-04-19 09:12:58</td>
<td><p>조달업체에 대한 세부품명 등록일시</p>
<p>“YYYY-MM-DD HH:MM:SS”</p></td>
</tr>
<tr class="odd">
<td>chgDt</td>
<td>변경일시</td>
<td>19</td>
<td>0</td>
<td>2024-04-19 09:12:58</td>
<td><p>조달업체에 대한 세부품명 변경일시</p>
<p>“YYYY-MM-DD HH:MM:SS”</p></td>
</tr>
<tr class="even">
<td>rprsntPrdctClsfcNoNmYn</td>
<td>대표품명여부</td>
<td>1</td>
<td>0</td>
<td>N</td>
<td>조달업체에 대한 세부품명의 대표여부 [Y/N]</td>
</tr>
<tr class="odd">
<td>mnfctYn</td>
<td>제조여부</td>
<td>1</td>
<td>0</td>
<td>N</td>
<td>조달업체에 대한 세부품명의 제조물품여부[Y/N]</td>
</tr>
</tbody>
</table>

※ 항목구분 : 필수(1), 옵션(0), 1건 이상 복수건(1..n), 0건 또는
복수건(0..n)

##### 요청 / 응답 메시지 예제 {#요청-응답-메시지-예제-3}

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td>REST(URI)</td>
</tr>
<tr class="even">
<td>http://apis.data.go.kr/1230000/ao/UsrInfoService02/getPrcrmntCorpSplyPrdctInfo02?bizno=8633000223&amp;pageNo=1&amp;numOfRows=10&amp;ServiceKey=인증키</td>
</tr>
<tr class="odd">
<td>응답 메시지</td>
</tr>
<tr class="even">
<td><p>&lt;response&gt;</p>
<p>&lt;header&gt;</p>
<p>&lt;resultCode&gt;00&lt;/resultCode&gt;</p>
<p>&lt;resultMsg&gt;정상&lt;/resultMsg&gt;</p>
<p>&lt;/header&gt;</p>
<p>&lt;body&gt;</p>
<p>&lt;items&gt;</p>
<p>&lt;item&gt;</p>
<p>&lt;bizno&gt;8633000223&lt;/bizno&gt;</p>
<p>&lt;dtilPrdctClsfcNoNm&gt;프린트및복사용지&lt;/dtilPrdctClsfcNoNm&gt;</p>
<p>&lt;dtilPrdctClsfcNo&gt;1411150701&lt;/dtilPrdctClsfcNo&gt;</p>
<p>&lt;rgstDt&gt;2024-04-19 09:12:58&lt;/rgstDt&gt;</p>
<p>&lt;chgDt&gt;2024-04-19 09:12:58&lt;/chgDt&gt;</p>
<p>&lt;rprsntPrdctClsfcNoNmYn&gt;N&lt;/rprsntPrdctClsfcNoNmYn&gt;</p>
<p>&lt;mnfctYn&gt;N&lt;/mnfctYn&gt;</p>
<p>&lt;/item&gt;</p>
<p>&lt;item&gt;</p>
<p>&lt;bizno&gt;8633000223&lt;/bizno&gt;</p>
<p>&lt;dtilPrdctClsfcNoNm&gt;물티슈&lt;/dtilPrdctClsfcNoNm&gt;</p>
<p>&lt;dtilPrdctClsfcNo&gt;1411170102&lt;/dtilPrdctClsfcNo&gt;</p>
<p>&lt;rgstDt&gt;2024-04-19 08:58:55&lt;/rgstDt&gt;</p>
<p>&lt;chgDt&gt;2024-04-19 08:58:55&lt;/chgDt&gt;</p>
<p>&lt;rprsntPrdctClsfcNoNmYn&gt;N&lt;/rprsntPrdctClsfcNoNmYn&gt;</p>
<p>&lt;mnfctYn&gt;N&lt;/mnfctYn&gt;</p>
<p>&lt;/item&gt;</p>
<p>&lt;item&gt;</p>
<p>&lt;bizno&gt;8633000223&lt;/bizno&gt;</p>
<p>&lt;dtilPrdctClsfcNoNm&gt;화장실용화장지&lt;/dtilPrdctClsfcNoNm&gt;</p>
<p>&lt;dtilPrdctClsfcNo&gt;1411170401&lt;/dtilPrdctClsfcNo&gt;</p>
<p>&lt;rgstDt&gt;2024-04-19 09:12:32&lt;/rgstDt&gt;</p>
<p>&lt;chgDt&gt;2024-04-19 09:12:32&lt;/chgDt&gt;</p>
<p>&lt;rprsntPrdctClsfcNoNmYn&gt;N&lt;/rprsntPrdctClsfcNoNmYn&gt;</p>
<p>&lt;mnfctYn&gt;N&lt;/mnfctYn&gt;</p>
<p>&lt;/item&gt;</p>
<p>&lt;item&gt;</p>
<p>&lt;bizno&gt;8633000223&lt;/bizno&gt;</p>
<p>&lt;dtilPrdctClsfcNoNm&gt;커피메이커&lt;/dtilPrdctClsfcNoNm&gt;</p>
<p>&lt;dtilPrdctClsfcNo&gt;4810150501&lt;/dtilPrdctClsfcNo&gt;</p>
<p>&lt;rgstDt&gt;2024-04-19 09:11:49&lt;/rgstDt&gt;</p>
<p>&lt;chgDt&gt;2024-04-19 09:11:49&lt;/chgDt&gt;</p>
<p>&lt;rprsntPrdctClsfcNoNmYn&gt;N&lt;/rprsntPrdctClsfcNoNmYn&gt;</p>
<p>&lt;mnfctYn&gt;N&lt;/mnfctYn&gt;</p>
<p>&lt;/item&gt;</p>
<p>&lt;item&gt;</p>
<p>&lt;bizno&gt;8633000223&lt;/bizno&gt;</p>
<p>&lt;dtilPrdctClsfcNoNm&gt;선물세트&lt;/dtilPrdctClsfcNoNm&gt;</p>
<p>&lt;dtilPrdctClsfcNo&gt;4910160202&lt;/dtilPrdctClsfcNo&gt;</p>
<p>&lt;rgstDt&gt;2024-01-24 12:03:10&lt;/rgstDt&gt;</p>
<p>&lt;chgDt&gt;2024-01-24 12:03:10&lt;/chgDt&gt;</p>
<p>&lt;rprsntPrdctClsfcNoNmYn&gt;N&lt;/rprsntPrdctClsfcNoNmYn&gt;</p>
<p>&lt;mnfctYn&gt;N&lt;/mnfctYn&gt;</p>
<p>&lt;/item&gt;</p>
<p>&lt;item&gt;</p>
<p>&lt;bizno&gt;8633000223&lt;/bizno&gt;</p>
<p>&lt;dtilPrdctClsfcNoNm&gt;종합운동기구&lt;/dtilPrdctClsfcNoNm&gt;</p>
<p>&lt;dtilPrdctClsfcNo&gt;4920161101&lt;/dtilPrdctClsfcNo&gt;</p>
<p>&lt;rgstDt&gt;2024-06-01 15:18:52&lt;/rgstDt&gt;</p>
<p>&lt;chgDt&gt;2024-06-01 15:18:52&lt;/chgDt&gt;</p>
<p>&lt;rprsntPrdctClsfcNoNmYn&gt;N&lt;/rprsntPrdctClsfcNoNmYn&gt;</p>
<p>&lt;mnfctYn&gt;N&lt;/mnfctYn&gt;</p>
<p>&lt;/item&gt;</p>
<p>&lt;item&gt;</p>
<p>&lt;bizno&gt;8633000223&lt;/bizno&gt;</p>
<p>&lt;dtilPrdctClsfcNoNm&gt;기타운동경기용구&lt;/dtilPrdctClsfcNoNm&gt;</p>
<p>&lt;dtilPrdctClsfcNo&gt;4922158201&lt;/dtilPrdctClsfcNo&gt;</p>
<p>&lt;rgstDt&gt;2024-06-01 15:26:16&lt;/rgstDt&gt;</p>
<p>&lt;chgDt&gt;2024-06-01 15:26:16&lt;/chgDt&gt;</p>
<p>&lt;rprsntPrdctClsfcNoNmYn&gt;N&lt;/rprsntPrdctClsfcNoNmYn&gt;</p>
<p>&lt;mnfctYn&gt;N&lt;/mnfctYn&gt;</p>
<p>&lt;/item&gt;</p>
<p>&lt;item&gt;</p>
<p>&lt;bizno&gt;8633000223&lt;/bizno&gt;</p>
<p>&lt;dtilPrdctClsfcNoNm&gt;성인용기저귀&lt;/dtilPrdctClsfcNoNm&gt;</p>
<p>&lt;dtilPrdctClsfcNo&gt;5310230601&lt;/dtilPrdctClsfcNo&gt;</p>
<p>&lt;rgstDt&gt;2024-01-24 12:02:24&lt;/rgstDt&gt;</p>
<p>&lt;chgDt&gt;2024-01-24 12:02:24&lt;/chgDt&gt;</p>
<p>&lt;rprsntPrdctClsfcNoNmYn&gt;N&lt;/rprsntPrdctClsfcNoNmYn&gt;</p>
<p>&lt;mnfctYn&gt;N&lt;/mnfctYn&gt;</p>
<p>&lt;/item&gt;</p>
<p>&lt;item&gt;</p>
<p>&lt;bizno&gt;8633000223&lt;/bizno&gt;</p>
<p>&lt;dtilPrdctClsfcNoNm&gt;손톱깎이&lt;/dtilPrdctClsfcNoNm&gt;</p>
<p>&lt;dtilPrdctClsfcNo&gt;5313162101&lt;/dtilPrdctClsfcNo&gt;</p>
<p>&lt;rgstDt&gt;2024-02-22 12:42:38&lt;/rgstDt&gt;</p>
<p>&lt;chgDt&gt;2024-02-22 12:42:38&lt;/chgDt&gt;</p>
<p>&lt;rprsntPrdctClsfcNoNmYn&gt;N&lt;/rprsntPrdctClsfcNoNmYn&gt;</p>
<p>&lt;mnfctYn&gt;N&lt;/mnfctYn&gt;</p>
<p>&lt;/item&gt;</p>
<p>&lt;/items&gt;</p>
<p>&lt;numOfRows&gt;999&lt;/numOfRows&gt;</p>
<p>&lt;pageNo&gt;1&lt;/pageNo&gt;</p>
<p>&lt;totalCount&gt;9&lt;/totalCount&gt;</p>
<p>&lt;/body&gt;</p>
<p>&lt;/response&gt;</p></td>
</tr>
</tbody>
</table>

#### \[부정당재제업체정보조회\] 오퍼레이션 명세

<table style="width:100%;">
<colgroup>
<col style="width: 4%" />
<col style="width: 21%" />
<col style="width: 17%" />
<col style="width: 21%" />
<col style="width: 2%" />
<col style="width: 33%" />
</colgroup>
<tbody>
<tr class="odd">
<td rowspan="6">오퍼레이션 정보</td>
<td>오퍼레이션 번호</td>
<td>5</td>
<td>오퍼레이션명(국문)</td>
<td colspan="2">부정당재제업체정보조회</td>
</tr>
<tr class="even">
<td>오퍼레이션 유형</td>
<td>조회(목록)</td>
<td>오퍼레이션명(영문)</td>
<td colspan="2">getUnptRsttCorpInfo02</td>
</tr>
<tr class="odd">
<td>오퍼레이션 설명</td>
<td colspan="4"><p>부정당 제재 업체 정보를 사업자등록번호, 재재시작일자
검색조건으로 사업자등록번호, 업체명,법인등록번호, 제재시작일자,
재재종료일자, 재재기관명, 계약법구분,제재근거법률,조항호, 조항호코드,
조항호코드명,시행규칙코드, 시행규칙코드명 목록을 조회.</p>
<p>(나라장터미등록업체 , 개인에 대한 부정당제재는 미제공)</p>
<p>[국가계약법] –조회시점에 제재만료,해제된 것은 제공되지 않습니다.</p>
<p>[지방계약법]-조회시점에 정지,제재만료,해제된 것은 제공되지
않습니다.</p></td>
</tr>
<tr class="even">
<td>Call Back URL</td>
<td colspan="4">N/A</td>
</tr>
<tr class="odd">
<td>최대 메시지 사이즈</td>
<td colspan="4">[ 4000bytes]</td>
</tr>
<tr class="even">
<td>평균 응답 시간</td>
<td>[ 500 ms]</td>
<td colspan="2">초당 최대 트랜잭션</td>
<td>[ 30 tps]</td>
</tr>
</tbody>
</table>

##### 요청 메시지 명세

<table>
<colgroup>
<col style="width: 19%" />
<col style="width: 19%" />
<col style="width: 13%" />
<col style="width: 12%" />
<col style="width: 12%" />
<col style="width: 21%" />
</colgroup>
<tbody>
<tr class="odd">
<td>항목명(영문)</td>
<td>항목명(국문)</td>
<td>항목크기</td>
<td>항목구분</td>
<td>샘플데이터</td>
<td>항목설명</td>
</tr>
<tr class="even">
<td>numOfRows</td>
<td>한 페이지 결과 수</td>
<td>4</td>
<td>1</td>
<td>10</td>
<td>한 페이지 결과 수</td>
</tr>
<tr class="odd">
<td>pageNo</td>
<td>페이지 번호</td>
<td>4</td>
<td>1</td>
<td>1</td>
<td>페이지 번호</td>
</tr>
<tr class="even">
<td>ServiceKey</td>
<td>서비스키</td>
<td>400</td>
<td>1</td>
<td>공공데이터포털에서 받은 인증키</td>
<td>공공데이터포털에서 받은 인증키</td>
</tr>
<tr class="odd">
<td>type</td>
<td>타입</td>
<td>4</td>
<td><mark>0</mark></td>
<td>json</td>
<td>오픈API 리턴 타입을 JSON으로 받고 싶을 경우 'json' 으로 지정함</td>
</tr>
<tr class="even">
<td>inqryDiv</td>
<td>조회구분</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td><p>검색하고자하는 조회구분 입력<br />
1: 사업자등록번호 기준검색</p>
<p>2: 재재시작일자 검색</p></td>
</tr>
<tr class="odd">
<td>bizno</td>
<td>사업자등록번호</td>
<td>10</td>
<td>0</td>
<td>1198686612</td>
<td>검색하고자 하는 사업자등록번호 조회구분 1인 경우 필수</td>
</tr>
<tr class="even">
<td>inqryBgnDt</td>
<td>조회기준시작일시</td>
<td>12</td>
<td>0</td>
<td>202508240000</td>
<td>검색하고자하는 검색기준시작일시 "YYYYMMDDHHMM"<br />
조회구분 2인 경우 필수<br />
국가계약법: 최초제재시작일자(201609030000)<br />
지방계약법: 최초제재시작일자(201609030000)</td>
</tr>
<tr class="odd">
<td>inqryEndDt</td>
<td>조회기준종료일시</td>
<td>12</td>
<td>0</td>
<td>202511242359</td>
<td>검색하고자하는 검색기준종료일시 "YYYYMMDDHHMM"<br />
조회구분 2인 경우 필수<br />
국가계약법: 최초제재시작일자(201609030000)<br />
지방계약법: 최초제재시작일자(201609030000)</td>
</tr>
</tbody>
</table>

※ 항목구분 : 필수(1), 옵션(0), 1건 이상 복수건(1..n), 0건 또는
복수건(0..n)

##### 응답 메시지 예제

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 20%" />
<col style="width: 14%" />
<col style="width: 10%" />
<col style="width: 14%" />
<col style="width: 21%" />
</colgroup>
<tbody>
<tr class="odd">
<td>항목명(영문)</td>
<td>항목명(국문)</td>
<td>항목크기</td>
<td>항목구분</td>
<td>샘플데이터</td>
<td>항목설명</td>
</tr>
<tr class="even">
<td>resultCode</td>
<td>결과코드</td>
<td>2</td>
<td>1</td>
<td>00</td>
<td>결과코드</td>
</tr>
<tr class="odd">
<td>resultMsg</td>
<td>결과메세지</td>
<td>50</td>
<td>1</td>
<td>정상.</td>
<td>결과메세지</td>
</tr>
<tr class="even">
<td>numOfRows</td>
<td>한 페이지 결과 수</td>
<td>4</td>
<td>1</td>
<td>10</td>
<td>한 페이지 결과 수</td>
</tr>
<tr class="odd">
<td>pageNo</td>
<td>페이지 번호</td>
<td>4</td>
<td>1</td>
<td>1</td>
<td>페이지 번호</td>
</tr>
<tr class="even">
<td>totalCount</td>
<td>전체 결과 수</td>
<td>4</td>
<td>1</td>
<td>1</td>
<td>전체 결과 수</td>
</tr>
<tr class="odd">
<td>bizno</td>
<td>사업자등록번호</td>
<td>10</td>
<td>1</td>
<td>1198686612</td>
<td>사업자등록번호</td>
</tr>
<tr class="even">
<td>corpNm</td>
<td>업체명</td>
<td>200</td>
<td>1</td>
<td>이엠티씨 주식회사</td>
<td>부정당업체명</td>
</tr>
<tr class="odd">
<td>unptRsttDocNm</td>
<td>제재문서명</td>
<td>200</td>
<td>0</td>
<td>규제개혁법무담당관-13809, 13810</td>
<td>부정당제재처리 문서명</td>
</tr>
<tr class="even">
<td>rsttBgnDate</td>
<td>제재시작일자</td>
<td>10</td>
<td>0</td>
<td>2025-10-15</td>
<td>제재시작일자("YYYY-MM-DD")</td>
</tr>
<tr class="odd">
<td>rsttEndDate</td>
<td>제재종료일자</td>
<td>10</td>
<td>0</td>
<td>2026-02-14</td>
<td>제재종료일자("YYYY-MM-DD")</td>
</tr>
<tr class="even">
<td>insttCd</td>
<td>수요기관코드</td>
<td>7</td>
<td>0</td>
<td>1230000</td>
<td>제재 통보 수요기관코드</td>
</tr>
<tr class="odd">
<td>insttNm</td>
<td>수요기관명</td>
<td>400</td>
<td>0</td>
<td>조달청</td>
<td>제재 통보 수요기관명</td>
</tr>
<tr class="even">
<td>lawordNm</td>
<td>근거법령명</td>
<td>500</td>
<td>0</td>
<td>지방계약법-부정당제재근거법령</td>
<td>재재근거 계약법 구분-근거 법률</td>
</tr>
<tr class="odd">
<td>lawordArtclClause</td>
<td>조항호</td>
<td>50</td>
<td>0</td>
<td>법31조제1항9호 나목 영92조제2항2호가목</td>
<td>조항호</td>
</tr>
<tr class="even">
<td>lawordArtclClauseCd</td>
<td>조항호코드</td>
<td>50</td>
<td>0</td>
<td>002-092-002-002-가-20190625</td>
<td>조항호코드</td>
</tr>
<tr class="odd">
<td>lawordArtclClauseCdNm</td>
<td>조항호코드명</td>
<td>4000</td>
<td>0</td>
<td>정당한 이유 없이 낙찰된 후 계약을 체결하지 않은 자 또는 계약을 체결한 이후 계약이행(제42조제2항에 따른 계약이행능력 심사 또는 제42조의3제2항에 따른 평가를 위해 제출한 하도급관리계획 및 외주근로자 근로조건 이행계획에 관한 사항, 제88조에 따른 공동계약에 관한 사항 및 「건설산업기본법」 제31조의2에 따른 하도급계획에 관한 사항의 이행을 포함한다)을 하지 않거나 계약서에 정한 조건을 위반하여 이행한 자</td>
<td>조항호코드명</td>
</tr>
<tr class="even">
<td>enfcAtcsCd</td>
<td>시행규칙코드</td>
<td>200</td>
<td>0</td>
<td>[별표 2]17가</td>
<td>시행령규칙코드</td>
</tr>
<tr class="odd">
<td>enfcPrvNm</td>
<td>시행규칙코드명</td>
<td>500</td>
<td>0</td>
<td>정당한 이유 없이 계약을 체결하지 않은 자 또는 계약을 체결한 후 계약이행을 하지 않은 자</td>
<td>시행령규칙코드명</td>
</tr>
<tr class="even">
<td>ntfcnDt</td>
<td>게재일시</td>
<td>19</td>
<td>0</td>
<td>2025-09-30 09:28</td>
<td>부정당 제제 업체 정보 게재한 일시<br />
“YYYY-MM-DD HH:MM:SS”</td>
</tr>
<tr class="odd">
<td>rsttPrdMonthNum</td>
<td>제재기간개월수</td>
<td>22</td>
<td>0</td>
<td>4</td>
<td>제재시작월과 종료월간의 개월 수</td>
</tr>
<tr class="even">
<td>rsttPrdDayNum</td>
<td>제재기간일수</td>
<td>22</td>
<td>0</td>
<td>0</td>
<td>제재시작일과 종료일간의 일수</td>
</tr>
<tr class="odd">
<td>rsttProgrsNm</td>
<td>제재상태명</td>
<td>500</td>
<td>0</td>
<td>제재</td>
<td>부정당 제제 이력의 최종 상태명</td>
</tr>
</tbody>
</table>

※ 항목구분 : 필수(1), 옵션(0), 1건 이상 복수건(1..n), 0건 또는
복수건(0..n)

##### 요청 / 응답 메시지 예제 {#요청-응답-메시지-예제-4}

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td>REST(URI)</td>
</tr>
<tr class="even">
<td><a
href="http://apis.data.go.kr/1230000/ao/UsrInfoService/getUnptRsttCorpInfo?inqryDiv=1&amp;bizno=1198686612&amp;numOfRows=999&amp;pageNo=1&amp;type=xml&amp;ServiceKey">http://apis.data.go.kr/1230000/ao/UsrInfoService02/getUnptRsttCorpInfo02?inqryDiv=1&amp;bizno=1198686612&amp;numOfRows=999&amp;pageNo=1&amp;type=xml&amp;ServiceKey</a>=인증키</td>
</tr>
<tr class="odd">
<td>응답 메시지</td>
</tr>
<tr class="even">
<td><p>&lt;response&gt;</p>
<p>&lt;header&gt;</p>
<p>&lt;resultCode&gt;00&lt;/resultCode&gt;</p>
<p>&lt;resultMsg&gt;정상&lt;/resultMsg&gt;</p>
<p>&lt;/header&gt;</p>
<p>&lt;body&gt;</p>
<p>&lt;items&gt;</p>
<p>&lt;item&gt;</p>
<p>&lt;unptRsttDocNm&gt;규제개혁법무담당관-13809,
13810&lt;/unptRsttDocNm&gt;</p>
<p>&lt;bizno&gt;1198686612&lt;/bizno&gt;</p>
<p>&lt;corpNm&gt;이엠티씨 주식회사&lt;/corpNm&gt;</p>
<p>&lt;rsttBgnDate&gt;2025-10-15&lt;/rsttBgnDate&gt;</p>
<p>&lt;rsttEndDate&gt;2026-02-14&lt;/rsttEndDate&gt;</p>
<p>&lt;insttCd&gt;1230000&lt;/insttCd&gt;</p>
<p>&lt;insttNm&gt;조달청&lt;/insttNm&gt;</p>
<p>&lt;lawordNm&gt;지방계약법-부정당제재근거법령&lt;/lawordNm&gt;</p>
<p>&lt;lawordArtclClause&gt;법31조제1항9호 나목
영92조제2항2호가목&lt;/lawordArtclClause&gt;</p>
<p>&lt;lawordArtclClauseCd&gt;002-092-002-002-가-20190625&lt;/lawordArtclClauseCd&gt;</p>
<p>&lt;lawordArtclClauseCdNm&gt;정당한 이유 없이 낙찰된 후 계약을
체결하지 않은 자 또는 계약을 체결한 이후 계약이행(제42조제2항에 따른
계약이행능력 심사 또는 제42조의3제2항에 따른 평가를 위해 제출한
하도급관리계획 및 외주근로자 근로조건 이행계획에 관한 사항, 제88조에
따른 공동계약에 관한 사항 및 「건설산업기본법」 제31조의2에 따른
하도급계획에 관한 사항의 이행을 포함한다)을 하지 않거나 계약서에 정한
조건을 위반하여 이행한 자&lt;/lawordArtclClauseCdNm&gt;</p>
<p>&lt;enfcAtcsCd&gt;[별표 2]17가&lt;/enfcAtcsCd&gt;</p>
<p>&lt;enfcPrvNm&gt;정당한 이유 없이 계약을 체결하지 않은 자 또는 계약을
체결한 후 계약이행을 하지 않은 자&lt;/enfcPrvNm&gt;</p>
<p>&lt;ntfcnDt&gt;2025-09-30 09:28&lt;/ntfcnDt&gt;</p>
<p>&lt;rsttPrdMonthNum&gt;4&lt;/rsttPrdMonthNum&gt;</p>
<p>&lt;rsttPrdDayNum&gt;0&lt;/rsttPrdDayNum&gt;</p>
<p>&lt;rsttProgrsNm&gt;제재&lt;/rsttProgrsNm&gt;</p>
<p>&lt;/item&gt;</p>
<p>&lt;/items&gt;</p>
<p>&lt;numOfRows&gt;999&lt;/numOfRows&gt;</p>
<p>&lt;pageNo&gt;1&lt;/pageNo&gt;</p>
<p>&lt;totalCount&gt;1&lt;/totalCount&gt;</p>
<p>&lt;/body&gt;</p>
<p>&lt;/response&gt;</p></td>
</tr>
</tbody>
</table>

####   **OPEN API 에러코드별 조치방안** {#open-api-에러코드별-조치방안 .unnumbered}

<table>
<colgroup>
<col style="width: 7%" />
<col style="width: 16%" />
<col style="width: 36%" />
<col style="width: 40%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Code</strong></th>
<th><strong>코드값</strong></th>
<th><strong>설명</strong></th>
<th><strong>조치방안</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>01</td>
<td>Application Error</td>
<td>제공기관 서비스 제공 상태가 원할하지 않습니다.</td>
<td>서비스 제공기관의 관리자에게 문의하시기 바랍니다.</td>
</tr>
<tr class="even">
<td>02</td>
<td>DB Error</td>
<td>제공기관 서비스 제공 상태가 원할하지 않습니다.</td>
<td>서비스 제공기관의 관리자에게 문의하시기 바랍니다.</td>
</tr>
<tr class="odd">
<td>03</td>
<td>No Data</td>
<td>데이터 없음 에러</td>
<td></td>
</tr>
<tr class="even">
<td>04</td>
<td>HTTP Error</td>
<td>제공기관 서비스 제공 상태가 원할하지 않습니다.</td>
<td>서비스 제공기관의 관리자에게 문의하시기 바랍니다.</td>
</tr>
<tr class="odd">
<td>05</td>
<td>service time out</td>
<td>제공기관 서비스 제공 상태가 원할하지 않습니다</td>
<td>서비스 제공기관의 관리자에게 문의하시기 바랍니다.</td>
</tr>
<tr class="even">
<td>06</td>
<td>날짜Format 에러</td>
<td>날짜 Default, Format Error</td>
<td>날짜형식을 확인 하시기 바랍니다.</td>
</tr>
<tr class="odd">
<td>07</td>
<td>입력범위값 초과 에러</td>
<td>요청하신 OpenAPI의 파라미터 입력값 범위가 초과 되었습니다.</td>
<td>기술문서를 다시 한번 확인하여 주시기 바랍니다.</td>
</tr>
<tr class="even">
<td>08</td>
<td>필수값 입력 에러</td>
<td>요청하신 OpenAPI의 필수 파라미터가 누락되었습니다.</td>
<td>기술문서를 다시 한번 확인하여 주시기 바랍니다.</td>
</tr>
<tr class="odd">
<td>10</td>
<td>잘못된 요청 파라미터 에러</td>
<td>OpenAPI 요청시 ServiceKey 파라미터가 없음</td>
<td><p>-OpenAPI 요청시 ServiceKey 파라미터가 누락되었습니다.</p>
<p>-OpenAPI 요청 URL을 확인하시기 바랍니다.</p></td>
</tr>
<tr class="even">
<td>11</td>
<td>필수 요청 파라미터가 없음</td>
<td>요청하신 OpenAPI의 필수 파라미터가 누락되었습니다.</td>
<td>기술문서를 다시 한번 확인하시어 주시기 바랍니다.</td>
</tr>
<tr class="odd">
<td>12</td>
<td>해당 오픈API 서비스가 없거나 폐기됨</td>
<td>OpenAPI 호출시 URL이 잘못됨</td>
<td><p>-제공기관 관리자에게 폐기된 서비스인지 확인바랍니다.</p>
<p>폐기된 서비스가 아니면 개발가이드에서 OpenAPI요청 URL을 다시
확인하시기 바랍니다.</p></td>
</tr>
<tr class="even">
<td>20</td>
<td>서비스 접근 거부</td>
<td>활용승인이 되지 않은 OpenAPI호출</td>
<td><p>-OpenAPI활용신청정보의 승인상태를 확인하시기 바랍니다.</p>
<p>-활용신청에 대해 제공기관 담당자가 확인 후 '승인'이후 부터 사용할 수
있습니다.</p>
<p>-신청 후 2~3일 소요되고 결과는 회원가입 시 등록한 e-mail로
발송됩니다.</p></td>
</tr>
<tr class="odd">
<td>22</td>
<td>서비스 요청 제한 횟수 초과 에러</td>
<td>일일 활용건수가 초과함(활용건수 증가 필요)</td>
<td><p>-OpenAPI활용신청정보의 서비스 상세기능별 일일 트래픽량을
확인하시기 바랍니다.</p>
<p>-개발계정의 경우 제공기관에서 정의한 트래픽을 초과하여 활용할 수
없습니다.</p>
<p>-운영계정의 경우 변경신청을 통해서 일일트래픽량을 변경 할 수
있습니다.</p></td>
</tr>
<tr class="even">
<td>30</td>
<td>등록되지 않은 서비스 키</td>
<td>잘못된 서비스키를 사용하였거나 서비스키를 URL인코딩하지</td>
<td><p>-OpenAPI활용신청정보의 발급받은 서비스키를 다시 확인하시기
바랍니다.</p>
<p>- 서비스키 값이 같다면 서비스키가 URL 인코등 되었는지 다시 확인하시기
바랍니다.</p></td>
</tr>
<tr class="odd">
<td>31</td>
<td>기한 만료된 서비스 키</td>
<td><p>OpenAPI 사용기간이 만료됨</p>
<p>(활용연장신청 후 사용가능)</p></td>
<td><p>-OpenAPI 활용신청정보의 활용기간을 확인합니다.</p>
<p>-활용기간이 지난 서비스는 이용할 수 없으며 연장신청을 통해 승인 받은
후 다시 이용가능 합니다.</p></td>
</tr>
<tr class="even">
<td>32</td>
<td>등록되지 않은 도메인명 또는 IP주소</td>
<td>활용신청한 서버의 IP와 실제 OpenAPI호출한 서버가 다를 경우</td>
<td><p>-OpenAPI 활용신청정보의 등록된 도메인명이나 IP주소를 다시
확인합니다.</p>
<p>-IP나 도메인의 정보를 변경하기 위해 변경신청을 할 수
있습니다.</p></td>
</tr>
</tbody>
</table>

####  {#section .unnumbered}
