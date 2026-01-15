import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatCard, Button, Badge, Card } from '../../components/common'
import { DataTable } from '../../components/tables'
import { BidRateHistogram, TrendLineChart } from '../../components/charts'
import { formatAmount, formatDate } from '../../types/models'
import { useBidNotices } from '../../hooks/useApi'
import { getDashboardStats } from '../../services/dashboardService'
import './Dashboard.css'

const getNoticeStatus = (notice) => {
    const now = new Date()
    const closeDate = notice.bidClseDt ? new Date(notice.bidClseDt) : null
    const openDate = notice.opengDt ? new Date(notice.opengDt) : null

    if (!closeDate) return 'info' // 알수없음/진행중 가정

    if (now < closeDate) return 'processing'
    if (openDate && now >= openDate) return 'success' // 개찰완료
    return 'warning' // 마감됨 (개찰전)
}

const getStatusLabel = (status) => {
    switch (status) {
        case 'processing': return '진행중'
        case 'success': return '개찰완료'
        case 'warning': return '마감'
        default: return '기타'
    }
}

const NOTICE_COLUMNS = [
    {
        key: 'bidNtceNo',
        header: '공고번호',
        width: '140px',
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
        header: '기관명',
        width: '180px',
        sortable: true,
    },
    {
        key: 'baseAmount',
        header: '기초금액',
        width: '120px',
        sortable: true,
        render: (value, row) => {
            const amount = value || row?.presmptPrce || row?.presmptPrceAmt
            const formatted = formatAmount(amount)
            return <span className="amount-cell">{formatted === '-' ? '-' : `${formatted}원`}</span>
        },
    },
    {
        key: 'bidClseDt',
        header: '마감일',
        width: '100px',
        sortable: true,
        render: (value) => formatDate(value),
    },
    {
        key: 'status',
        header: '상태',
        width: '80px',
        render: (_, row) => {
            const status = getNoticeStatus(row)
            return <Badge variant={status}>{getStatusLabel(status)}</Badge>
        },
    },
]

const formatCount = (value) => {
    if (value === null || value === undefined) return '-'
    return new Intl.NumberFormat('ko-KR').format(value)
}

function Dashboard() {
    const navigate = useNavigate()
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
    })

    const MAX_RANGE_DAYS = 31
    const rangeInfo = useMemo(() => {
        const parseDateInput = (value) => {
            if (!value) return null
            const [year, month, day] = value.split('-').map((part) => Number(part))
            if (!year || !month || !day) return null
            return new Date(year, month - 1, day)
        }

        const startDate = parseDateInput(dateRange.start)
        const endDate = parseDateInput(dateRange.end)
        if (!startDate || !endDate) {
            return { isValid: false, error: '날짜 범위를 선택해주세요.' }
        }
        if (startDate > endDate) {
            return { isValid: false, error: '시작일은 종료일보다 이후일 수 없습니다.' }
        }
        const diffDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24))
        if (diffDays > MAX_RANGE_DAYS) {
            return { isValid: false, error: `조회 기간은 최대 ${MAX_RANGE_DAYS}일입니다. 기간을 줄여주세요.` }
        }
        return { isValid: true, error: null }
    }, [dateRange.end, dateRange.start])

    const { data, isLoading: noticesLoading, refetch, error: noticesError } = useBidNotices(
        'cnstwk',
        {
            startDate: dateRange.start,
            endDate: dateRange.end,
            numOfRows: 10,
        },
        { enabled: rangeInfo.isValid }
    )

    const [stats, setStats] = useState({
        counts: { notices: 0, results: 0, contracts: 0, recentNotices: 0 },
        monthlyResults: [],
        monthlyContracts: [],
        monthlyAvgRates: [],
        distribution: [],
    })
    const [statsLoading, setStatsLoading] = useState(true)

    useEffect(() => {
        const loadStats = async () => {
            setStatsLoading(true)
            try {
                const dashboardStats = await getDashboardStats()
                setStats(dashboardStats)
            } catch (err) {
                console.error('Failed to load dashboard stats', err)
            } finally {
                setStatsLoading(false)
            }
        }

        loadStats()
    }, [])

    const handleViewAllNotices = () => {
        navigate('/notices')
    }

    const handleRefresh = () => {
        if (!rangeInfo.isValid) return
        refetch()
        // Reload stats as well
        getDashboardStats().then(setStats).catch(console.error)
    }

    const notices = rangeInfo.isValid ? data?.items || [] : []
    const totalCount = data?.totalCount || 0
    const isLoading = noticesLoading || statsLoading
    const displayError = rangeInfo.error || noticesError?.message

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h1 className="text-h1">대시보드</h1>
                <div className="dashboard-actions">
                    <div className="date-range-group">
                        <div className="date-range">
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                className="date-input"
                            />
                            <span className="date-separator">~</span>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                className="date-input"
                            />
                        </div>
                        {displayError && <div className="date-error text-caption">{displayError}</div>}
                    </div>
                    <Button variant="secondary" size="small" onClick={handleRefresh} disabled={!rangeInfo.isValid}>
                        새로고침
                    </Button>
                </div>
            </div>

            <section className="kpi-section mt-6">
                <div className="kpi-grid">
                    <StatCard
                        icon="📢"
                        label="누적 공고"
                        value={isLoading ? '-' : `${formatCount(stats.counts.notices)}건`}
                        change="로컬 DB"
                        trend="neutral"
                    />
                    <StatCard
                        icon="🏁"
                        label="누적 낙찰"
                        value={isLoading ? '-' : `${formatCount(stats.counts.results)}건`}
                        change="로컬 DB"
                        trend="neutral"
                    />
                    <StatCard
                        icon="📄"
                        label="누적 계약"
                        value={isLoading ? '-' : `${formatCount(stats.counts.contracts)}건`}
                        change="로컬 DB"
                        trend="neutral"
                    />
                    <StatCard
                        icon="📈"
                        label="최근 공고"
                        value={isLoading ? '-' : `${formatCount(stats.counts.recentNotices)}건`}
                        change="최근 30일"
                        trend="up"
                    />
                </div>
            </section>

            <section className="charts-section mt-8">
                <div className="chart-grid">
                    <Card className="chart-card">
                        <TrendLineChart
                            data={stats.monthlyResults}
                            title="월별 낙찰 추이"
                            dataKey="count"
                            dataLabel="낙찰 건수"
                        />
                    </Card>
                    <Card className="chart-card">
                        <TrendLineChart
                            data={stats.monthlyContracts}
                            title="월별 계약 추이"
                            dataKey="count"
                            dataLabel="계약 건수"
                        />
                    </Card>
                    <Card className="chart-card">
                        <TrendLineChart
                            data={stats.monthlyAvgRates}
                            title="월별 평균 투찰률"
                            dataKey="rate"
                            dataLabel="평균 투찰률"
                        />
                    </Card>
                    <Card className="chart-card">
                        <BidRateHistogram
                            data={stats.distribution}
                            title="경쟁도 분포"
                        />
                    </Card>
                </div>
            </section>

            <section className="recent-section mt-8">
                <div className="section-header">
                    <h2 className="text-h2">최근 입찰 공고 (공사)</h2>
                    <Button variant="ghost" size="small" onClick={handleViewAllNotices}>
                        전체보기 →
                    </Button>
                </div>
                <div className="mt-4">
                    <DataTable
                        columns={NOTICE_COLUMNS}
                        data={notices}
                        rowKey="bidNtceNo"
                        pageSize={5}
                        loading={isLoading}
                        emptyMessage="최근 입찰 공고가 없습니다."
                        onRowClick={() => navigate('/notices')}
                    />
                </div>
            </section>
        </div>
    )
}

export default Dashboard
