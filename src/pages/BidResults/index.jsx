import { useEffect, useState } from 'react'
import { Card, Button, Badge, SearchInput, Modal } from '../../components/common'
import { BusinessTypeTabs } from '../../components/common'
import { DataTable } from '../../components/tables'
import { formatAmount, formatDateTime } from '../../types/models'
import { useBidResults, useOpeningResult } from '../../hooks/useApi'
import { useAppStore } from '../../stores'
import { useNavigate } from 'react-router-dom'
import './BidResults.css'

const parseOpengCorpInfo = (value) => {
    if (!value || typeof value !== 'string') return null
    const parts = value.split('^').map((part) => part.trim())
    if (parts.length < 2) return null
    const [prcrmntCorpNm, bizno] = parts
    return { prcrmntCorpNm, bizno }
}


// 테이블 컬럼 정의
const COLUMNS = [
    {
        key: 'bidNtceNo',
        header: '공고번호',
        width: '130px',
        sortable: true,
    },
    {
        key: 'bidNtceNm',
        header: '공고명',
        sortable: true,
        render: (value) => (
            <span className="notice-name truncate" title={value}>
                {value}
            </span>
        ),
    },
    {
        key: 'dminsttNm',
        header: '수요기관',
        width: '150px',
        sortable: true,
        render: (value) => (
            <span className="truncate" title={value}>
                {value}
            </span>
        ),
    },
    {
        key: 'sucsfbidAmt',
        header: '낙찰금액',
        width: '130px',
        sortable: true,
        render: (value) => (
            <span className="amount-cell">{value ? `${formatAmount(value)}원` : '-'}</span>
        ),
    },
    {
        key: 'sucsfbidRate',
        header: '낙찰률',
        width: '80px',
        sortable: true,
        render: (value) => (
            <span className="rate-cell">{value ? `${value}%` : '-'}</span>
        ),
    },
    {
        key: 'bidwinnrNm',
        header: '낙찰업체',
        width: '150px',
        render: (value) => (
            <span className="truncate" title={value}>
                {value || '-'}
            </span>
        ),
    },
    {
        key: 'prtcptCnum',
        header: '참가수',
        width: '70px',
        sortable: true,
        render: (value) => value || '-',
    },
    {
        key: 'rlOpengDt',
        header: '개찰일시',
        width: '140px',
        sortable: true,
        render: (value) => formatDateTime(value),
    },
]

// 개찰 순위 테이블 컬럼
const RANK_COLUMNS = [
    { key: 'opengRank', header: '순위', width: '60px', sortable: true },
    {
        key: 'prcrmntCorpNm',
        header: '업체명',
        sortable: true,
        render: (value, row) => {
            const parsed = parseOpengCorpInfo(row?.opengCorpInfo)
            const name = value || parsed?.prcrmntCorpNm
            return (
                <span className="truncate" title={name || 'API 미제공'}>
                    {name || 'API 미제공'}
                </span>
            )
        },
    },
    {
        key: 'bizno',
        header: '사업자번호',
        width: '120px',
        render: (value, row) => {
            const parsed = parseOpengCorpInfo(row?.opengCorpInfo)
            return value || parsed?.bizno || '-'
        },
    },
    {
        key: 'bidprcAmt',
        header: '투찰금액',
        width: '130px',
        render: (value) => <span className="amount-cell">{value ? `${formatAmount(value)}원` : '-'}</span>
    },
    {
        key: 'bidprcRate',
        header: '투찰률',
        width: '80px',
        render: (value) => <span className="rate-cell">{value ? `${value}%` : '-'}</span>
    },
    { key: 'drwtYn', header: '추첨', width: '60px' },
]

/**
 * 낙찰 현황 페이지
 */
function BidResults() {
    const navigate = useNavigate()
    const { hasApiKey } = useAppStore()
    const [activeTab, setActiveTab] = useState('cnstwk')
    const [searchValue, setSearchValue] = useState('')
    const [selectedResult, setSelectedResult] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showOnlyNamed, setShowOnlyNamed] = useState(false)

    // 날짜 범위 (최근 30일)
    const today = new Date()
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    const [dateRange] = useState({
        startDate: monthAgo.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
    })

    // 낙찰 결과 API 호출
    const { data, isLoading, error, refetch } = useBidResults(activeTab, {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        numOfRows: 50,
    })

    // 개찰 상세 조회 (모달용)
    const { data: openingData, isLoading: openingLoading } = useOpeningResult(
        selectedResult?.bidNtceNo,
        selectedResult?.bidNtceOrd,
        selectedResult?.bidClsfcNo,
        selectedResult?.rbidNo
    )

    const openingRows = (openingData?.items || []).map((item, index) => {
        const parsed = parseOpengCorpInfo(item?.opengCorpInfo)
        const bizno = item?.bizno || parsed?.bizno || 'no-bizno'
        const rank = item?.opengRank ?? 'no-rank'
        const amt = item?.bidprcAmt ?? 'no-amt'
        return {
            ...item,
            id: item?.id || `${rank}-${bizno}-${amt}-${index}`,
        }
    })

    const openingRowsNamed = openingRows.filter((item) => {
        const parsed = parseOpengCorpInfo(item?.opengCorpInfo)
        return item?.prcrmntCorpNm || item?.bizno || parsed?.prcrmntCorpNm || parsed?.bizno
    })

    const hasNamedRows = openingRowsNamed.length > 0
    const openingRowsVisible = showOnlyNamed ? openingRowsNamed : openingRows
    const openingEmptyMessage = showOnlyNamed
        ? '업체명 제공 건이 없습니다.'
        : '개찰 순위 정보가 없습니다.'

    useEffect(() => {
        if (showOnlyNamed && !hasNamedRows) {
            setShowOnlyNamed(false)
        }
    }, [showOnlyNamed, hasNamedRows])

    const results = data?.items || []

    // 검색 필터링
    const filteredData = results.filter((result) => {
        if (!searchValue) return true
        const keyword = searchValue.toLowerCase()
        return (
            (result.bidNtceNo || '').toLowerCase().includes(keyword) ||
            (result.bidNtceNm || '').toLowerCase().includes(keyword) ||
            (result.bidwinnrNm || '').toLowerCase().includes(keyword) ||
            (result.dminsttNm || '').toLowerCase().includes(keyword)
        )
    })

    const handleRowClick = (result) => {
        setSelectedResult(result)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedResult(null)
        setShowOnlyNamed(false)
    }

    const handleAnalyzeCompany = (bizno, corpNm) => {
        navigate(`/analysis?bizno=${bizno}&name=${encodeURIComponent(corpNm)}`)
    }

    // API 키 없을 때 안내
    if (!hasApiKey()) {
        return (
            <div className="bid-results-page">
                <h1 className="text-h1">낙찰 현황</h1>
                <Card className="mt-6">
                    <div className="api-warning">
                        <p className="text-body">⚠️ API 키가 설정되지 않았습니다.</p>
                        <Button variant="primary" className="mt-4" onClick={() => navigate('/settings')}>
                            설정 페이지로 이동
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="bid-results-page">
            {/* 헤더 */}
            <div className="page-header">
                <h1 className="text-h1">낙찰 현황</h1>
                <div className="header-actions">
                    <Button variant="secondary" size="small" onClick={() => refetch()} loading={isLoading}>
                        📥 데이터 동기화
                    </Button>
                </div>
            </div>

            {/* 탭 */}
            <div className="tabs-section mt-6">
                <BusinessTypeTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* 필터 영역 */}
            <Card className="filter-card mt-4">
                <div className="filter-row">
                    <div className="search-wrapper">
                        <SearchInput
                            placeholder="공고번호, 공고명, 낙찰업체 검색..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                    <div className="filter-info text-caption">
                        총 <strong>{data?.totalCount || 0}</strong>건 | 표시: <strong>{filteredData.length}</strong>건
                    </div>
                </div>
            </Card>

            {/* 에러 표시 */}
            {error && (
                <Card className="error-card mt-4">
                    <p className="text-body error-text">❌ 데이터 조회 실패: {error.message}</p>
                </Card>
            )}

            {/* 테이블 */}
            <div className="table-section mt-4">
                <DataTable
                    columns={COLUMNS}
                    data={filteredData}
                    rowKey="bidNtceNo"
                    onRowClick={handleRowClick}
                    pageSize={10}
                    loading={isLoading}
                    emptyMessage="낙찰 결과가 없습니다."
                />
            </div>

            {/* 개찰 상세 모달 */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="개찰 결과 상세"
                size="full"
                footer={
                    <Button variant="secondary" onClick={handleCloseModal}>
                        닫기
                    </Button>
                }
            >
                {selectedResult && (
                    <div className="result-detail">
                        {/* 기본 정보 */}
                        <div className="detail-section">
                            <h3 className="text-h3">📋 공고 정보</h3>
                            <div className="detail-grid mt-4">
                                <div className="detail-item">
                                    <span className="detail-label">공고번호</span>
                                    <span className="detail-value">{selectedResult.bidNtceNo}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">낙찰금액</span>
                                    <span className="detail-value amount-cell">
                                        {formatAmount(selectedResult.sucsfbidAmt)}원
                                    </span>
                                </div>
                                <div className="detail-item full-width">
                                    <span className="detail-label">공고명</span>
                                    <span className="detail-value">{selectedResult.bidNtceNm}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">낙찰업체</span>
                                    <span className="detail-value">
                                        {selectedResult.bidwinnrNm}
                                        {selectedResult.bidwinnrBizno && (
                                            <Button
                                                variant="ghost"
                                                size="small"
                                                className="ml-2"
                                                onClick={() => handleAnalyzeCompany(selectedResult.bidwinnrBizno, selectedResult.bidwinnrNm)}
                                            >
                                                📊 분석
                                            </Button>
                                        )}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">낙찰률</span>
                                    <span className="detail-value rate-cell">{selectedResult.sucsfbidRate}%</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">참가업체수</span>
                                    <span className="detail-value">{selectedResult.prtcptCnum}개사</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">개찰일시</span>
                                    <span className="detail-value">{formatDateTime(selectedResult.rlOpengDt)}</span>
                                </div>
                            </div>
                        </div>

                        {/* 순위 테이블 */}
                        <div className="detail-section mt-6">
                            <h3 className="text-h3">🏆 개찰 순위</h3>
                            <div className="opening-meta mt-2">
                                <p className="text-caption text-secondary">
                                    {'\uac1c\ucc30 \ucc38\uc5ec\uc5c5\uccb4 \uc815\ubcf4\ub294 \uacf5\uacf5\ub370\uc774\ud130 \uc81c\uacf5 \ubc94\uc704\uc5d0 \ub530\ub77c \uc77c\ubd80 \uacf5\uace0\uc5d0\uc11c \ub204\ub77d\ub420 \uc218 \uc788\uc2b5\ub2c8\ub2e4.'}
                                </p>
                                <label className="opening-toggle text-caption">
                                    <input
                                        type="checkbox"
                                        checked={showOnlyNamed}
                                        onChange={(e) => setShowOnlyNamed(e.target.checked)}
                                        disabled={!hasNamedRows}
                                    />
                                    업체명 제공 건만 보기 ({openingRowsNamed.length}/{openingRows.length})
                                </label>
                            </div>
                            <div className="mt-4">
                                <DataTable
                                    columns={RANK_COLUMNS}
                                    data={openingRowsVisible}
                                    rowKey="id"
                                    pageSize={10}
                                    loading={openingLoading}
                                    emptyMessage={openingEmptyMessage}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default BidResults
