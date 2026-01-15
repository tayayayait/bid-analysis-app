import { useState, useEffect } from 'react'
import { Card, Button, Badge, SearchInput, Modal } from '../../components/common'
import BidAnalysis from '../../components/BidAnalysis'
import { BusinessTypeTabs } from '../../components/common'
import { DataTable } from '../../components/tables'
import { formatAmount, formatDateTime } from '../../types/models'
import { useBidNotices } from '../../hooks/useApi'
import { useAppStore } from '../../stores'
import { useNavigate } from 'react-router-dom'
import './BidNotices.css'

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
        key: 'ntceInsttNm',
        header: '공고기관',
        width: '160px',
        sortable: true,
        render: (value) => (
            <span className="truncate" title={value}>
                {value}
            </span>
        ),
    },
    {
        key: 'presmptPrce',
        header: '추정가격',
        width: '130px',
        sortable: true,
        render: (value) => (
            <span className="amount-cell">{value ? `${formatAmount(value)}원` : '-'}</span>
        ),
    },
    {
        key: 'bidClseDt',
        header: '입찰마감',
        width: '150px',
        sortable: true,
        render: (value) => formatDateTime(value),
    },
    {
        key: 'cntrctCnclsMthdNm',
        header: '계약방법',
        width: '90px',
    },
    {
        key: 'ntceKindNm',
        header: '상태',
        width: '80px',
        render: (value) => {
            const variant = value === '등록공고' ? '진행중' : value === '변경공고' ? '재입찰' : '취소'
            return <Badge variant={variant}>{value || '-'}</Badge>
        },
    },
]

/**
 * 입찰 공고 목록 페이지 - 실제 API 연동
 */
function BidNotices() {
    const navigate = useNavigate()
    const { hasApiKey } = useAppStore()
    const [activeTab, setActiveTab] = useState('cnstwk')
    const [searchValue, setSearchValue] = useState('')
    const [selectedRows, setSelectedRows] = useState([])
    const [selectedNotice, setSelectedNotice] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // 날짜 범위 (최근 7일)
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const [dateRange] = useState({
        startDate: weekAgo.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
    })

    // API 호출
    const { data, isLoading, error, refetch } = useBidNotices(activeTab, {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        numOfRows: 50,
    })

    // API 키 없으면 설정 페이지로 이동 안내
    useEffect(() => {
        if (!hasApiKey()) {
            // 사용자에게 알림 후 설정 페이지로 이동하도록 처리할 수 있음
        }
    }, [hasApiKey])

    // 데이터 가져오기
    const notices = data?.items || []

    // 검색 필터링
    const filteredData = notices.filter((notice) => {
        if (!searchValue) return true
        const keyword = searchValue.toLowerCase()
        return (
            (notice.bidNtceNo || '').toLowerCase().includes(keyword) ||
            (notice.bidNtceNm || '').toLowerCase().includes(keyword) ||
            (notice.ntceInsttNm || '').toLowerCase().includes(keyword)
        )
    })

    const handleRowClick = (notice) => {
        setSelectedNotice(notice)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedNotice(null)
    }

    const handleSync = () => {
        refetch()
    }

    // API 키 없을 때 안내
    if (!hasApiKey()) {
        return (
            <div className="bid-notices-page">
                <h1 className="text-h1">입찰 공고</h1>
                <Card className="mt-6">
                    <div className="api-warning">
                        <p className="text-body">⚠️ API 키가 설정되지 않았습니다.</p>
                        <p className="text-body-sm mt-2">설정 페이지에서 공공데이터포털 API 키를 입력해주세요.</p>
                        <Button variant="primary" className="mt-4" onClick={() => navigate('/settings')}>
                            설정 페이지로 이동
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="bid-notices-page">
            {/* 헤더 */}
            <div className="page-header">
                <h1 className="text-h1">입찰 공고</h1>
                <div className="header-actions">
                    <Button variant="secondary" size="small" onClick={handleSync} loading={isLoading}>
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
                            placeholder="공고번호, 공고명, 기관명 검색..."
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
                    <p className="text-body error-text">
                        {error?.response?.status === 429
                            ? '🚫 일일 API 호출 한도를 초과했습니다. 내일 다시 시도해주세요.'
                            : `❌ 데이터 조회 실패: ${error.message}`}
                    </p>
                    {error?.response?.status !== 429 && (
                        <Button variant="secondary" size="small" onClick={handleSync} className="mt-2">
                            다시 시도
                        </Button>
                    )}
                </Card>
            )}

            {/* 테이블 */}
            <div className="table-section mt-4">
                <DataTable
                    columns={COLUMNS}
                    data={filteredData}
                    rowKey="bidNtceNo"
                    selectable
                    selectedRows={selectedRows}
                    onSelectionChange={setSelectedRows}
                    onRowClick={handleRowClick}
                    pageSize={10}
                    loading={isLoading}
                    emptyMessage={`${activeTab === 'cnstwk' ? '공사' : activeTab === 'thng' ? '물품' : activeTab === 'servc' ? '용역' : '외자'} 입찰 공고가 없습니다.`}
                />
            </div>

            {/* 공고 상세 모달 */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="공고 상세 정보"
                size="large"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            닫기
                        </Button>
                        <Button variant="primary" onClick={() => navigate(`/prediction?bidNtceNo=${selectedNotice?.bidNtceNo}`)}>
                            🎯 투찰 분석
                        </Button>
                    </>
                }
            >
                {selectedNotice && (
                    <div className="notice-detail">
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">공고번호</span>
                                <span className="detail-value">{selectedNotice.bidNtceNo}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">공고차수</span>
                                <span className="detail-value">{selectedNotice.bidNtceOrd || '000'}</span>
                            </div>
                            <div className="detail-item full-width">
                                <span className="detail-label">공고명</span>
                                <span className="detail-value">{selectedNotice.bidNtceNm}</span>
                            </div>
                            <div className="detail-item full-width">
                                <span className="detail-label">공고기관</span>
                                <span className="detail-value">{selectedNotice.ntceInsttNm}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">추정가격</span>
                                <span className="detail-value amount-cell">
                                    {selectedNotice.presmptPrce ? `${formatAmount(selectedNotice.presmptPrce)}원` : '-'}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">계약방법</span>
                                <span className="detail-value">{selectedNotice.cntrctCnclsMthdNm || '-'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">입찰방식</span>
                                <span className="detail-value">{selectedNotice.bidMethdNm || '-'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">공고종류</span>
                                <span className="detail-value">{selectedNotice.ntceKindNm || '-'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">입찰개시</span>
                                <span className="detail-value">{formatDateTime(selectedNotice.bidBeginDt)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">입찰마감</span>
                                <span className="detail-value">{formatDateTime(selectedNotice.bidClseDt)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">개찰일시</span>
                                <span className="detail-value">{formatDateTime(selectedNotice.opengDt)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">담당자</span>
                                <span className="detail-value">
                                    {selectedNotice.ntceInsttOfclNm || '-'} ({selectedNotice.ntceInsttOfclTelNo || '-'})
                                </span>
                            </div>
                        </div>

                        {/* AI 입찰 분석 컴포넌트 추가 */}
                        <BidAnalysis
                            bidTitle={selectedNotice.bidNtceNm}
                            bidContent={`
                                공고번호: ${selectedNotice.bidNtceNo}
                                공고기관: ${selectedNotice.ntceInsttNm}
                                추정가격: ${selectedNotice.presmptPrce}
                                계약방법: ${selectedNotice.cntrctCnclsMthdNm}
                                입찰방식: ${selectedNotice.bidMethdNm}
                                공고종류: ${selectedNotice.ntceKindNm}
                                마감일시: ${selectedNotice.bidClseDt}
                            `}
                        />
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default BidNotices
