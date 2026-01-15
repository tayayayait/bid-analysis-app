import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, Input, Button } from '../../components/common'
import { DataTable } from '../../components/tables'
import { BidRateHistogram } from '../../components/charts'
import { formatAmount } from '../../types/models'
import { predictBidRange } from '../../services/analysis'
import StrategyCard from './StrategyCard'
import './Prediction.css'

const COMPETITOR_COLUMNS = [
    {
        key: 'name',
        header: '업체명',
        sortable: true,
        render: (value) => <span className="truncate" title={value}>{value}</span>,
    },
    {
        key: 'count',
        header: '참여횟수',
        width: '90px',
        sortable: true,
        render: (value) => `${value}회`,
    },
    {
        key: 'avgRate',
        header: '평균 투찰률',
        width: '110px',
        render: (value) => (value !== null && value !== undefined ? `${value}%` : '-'),
    },
]

const formatRate = (value, digits = 4) => (
    Number.isFinite(value) ? `${value.toFixed(digits)}%` : '-'
)

const formatHitRate = (value) => (
    Number.isFinite(value) ? `${(value * 100).toFixed(1)}%` : '-'
)

function Prediction() {
    const [searchParams] = useSearchParams()
    const urlBidNo = searchParams.get('bidNtceNo')

    const [bidNo, setBidNo] = useState(urlBidNo || '')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [result, setResult] = useState(null)

    useEffect(() => {
        if (urlBidNo) {
            handlePredict(urlBidNo)
        }
    }, [urlBidNo])

    const handlePredict = async (targetBidNo) => {
        const idToSearch = typeof targetBidNo === 'string' ? targetBidNo : bidNo
        if (!idToSearch) return

        setLoading(true)
        setError(null)
        setResult(null)
        try {
            const data = await predictBidRange({
                bidNtceNo: idToSearch.trim(),
            })
            setResult(data)
        } catch (err) {
            setError(err?.message || '예측 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="prediction-page">
            <h1 className="text-h1">투찰 예측</h1>

            <Card className="prediction-input-card">
                <div className="input-group">
                    <div className="input-wrapper">
                        <label className="input-label">공고번호</label>
                        <Input
                            placeholder="예: 20240114810"
                            value={bidNo}
                            onChange={(e) => setBidNo(e.target.value)}
                        />
                        <p className="input-hint">
                            * 공고번호를 입력하면 해당 공고의 기초금액과 유사 공고들을 자동으로 분석합니다.
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={handlePredict}
                        disabled={loading || !bidNo}
                        className="predict-btn"
                    >
                        {loading ? '분석 중...' : '예측 실행'}
                    </Button>
                </div>
            </Card>

            {error && (
                <Card className="mt-6">
                    <p className="text-body text-red-600">{error}</p>
                </Card>
            )}

            {result && (
                <>
                    <Card className="mt-6 result-summary">
                        <div className="result-header">
                            <h2 className="text-h2">추천 투찰 구간</h2>
                            <span className="text-caption">
                                신뢰도 {result.recommendation.confidence}%
                            </span>
                        </div>
                        <div className="result-grid">
                            <div className="result-item">
                                <span className="result-label">추천 구간</span>
                                <span className="result-value">
                                    {result.recommendation.optimalRange.min}% ~ {result.recommendation.optimalRange.max}%
                                </span>
                            </div>
                            <div className="result-item">
                                <span className="result-label">중심값</span>
                                <span className="result-value">
                                    {formatRate(result.recommendation.recommendedPoint)}
                                </span>
                            </div>
                            <div className="result-item">
                                <span className="result-label">예상 적중률</span>
                                <span className="result-value">
                                    {formatHitRate(result.recommendation.expectedHitRate)}
                                </span>
                            </div>
                            <div className="result-item">
                                <span className="result-label">구간폭</span>
                                <span className="result-value">
                                    {formatRate(result.recommendation.width)}
                                </span>
                            </div>
                            <div className="result-item">
                                <span className="result-label">예상 참여수</span>
                                <span className="result-value">{result.estimatedParticipants}개</span>
                            </div>
                            <div className="result-item">
                                <span className="result-label">기초금액</span>
                                <span className="result-value">
                                    {result.baseAmount ? `${formatAmount(result.baseAmount)}원` : '-'}
                                </span>
                            </div>
                            <div className="result-item">
                                <span className="result-label">유사 공고 수</span>
                                <span className="result-value">{result.similarBidsStats.sampleCount}건</span>
                            </div>
                        </div>
                        <p className="text-body text-secondary mt-4">{result.recommendation.reason}</p>
                        {result.onDemand?.performed && (
                            <p className="text-caption text-secondary mt-2">
                                데이터 부족으로 개찰 결과를 보강 수집했습니다.
                                {result.onDemand.fetchedOpening > 0 && ` (+${result.onDemand.fetchedOpening}건)`}
                            </p>
                        )}
                    </Card>

                    <StrategyCard
                        bidTitle={result.bidNtceNm || '공고명 (정보 없음)'}
                        bidContent={`공고번호: ${bidNo}, 기초금액: ${result.baseAmount ? formatAmount(result.baseAmount) : '정보 없음'}`}
                        analysisResult={result}
                    />

                    <Card className="mt-6">
                        {result.bidRateDistribution.length ? (
                            <BidRateHistogram
                                data={result.bidRateDistribution}
                                title="유사 공고 투찰률 분포"
                            />
                        ) : (
                            <p className="text-body text-secondary">분포 데이터를 생성할 수 없습니다.</p>
                        )}
                    </Card>

                    <Card className="mt-6">
                        <h2 className="text-h2 mb-4">유사 공고 요약</h2>
                        {result.similarBidsStats.totalSamples === 0 ? (
                            <div className="text-center py-6 bg-yellow-50 rounded-lg">
                                <p className="text-h3 text-yellow-800 mb-2">⚠️ 분석할 과거 데이터가 부족합니다</p>
                                <p className="text-body text-yellow-700 mb-4">
                                    유사한 공고 패턴을 찾을 수 없습니다.<br />
                                    정확한 분석을 위해 [설정] 메뉴에서 <strong>과거 데이터(최근 1년 등)</strong>를 먼저 수집해주세요.
                                </p>
                                <Button
                                    variant="secondary"
                                    onClick={() => window.location.href = '/settings'}
                                >
                                    데이터 동기화 하러 가기 👉
                                </Button>
                            </div>
                        ) : (
                            <div className="result-grid">
                                <div className="result-item">
                                    <span className="result-label">평균 투찰률</span>
                                    <span className="result-value">{result.similarBidsStats.avgBidRate}%</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">최소 투찰률</span>
                                    <span className="result-value">{result.similarBidsStats.minBidRate}%</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">최대 투찰률</span>
                                    <span className="result-value">{result.similarBidsStats.maxBidRate}%</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">샘플 수</span>
                                    <span className="result-value">{result.similarBidsStats.totalSamples}건</span>
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card className="mt-6">
                        <h2 className="text-h2 mb-4">예상 경쟁 업체</h2>
                        <DataTable
                            columns={COMPETITOR_COLUMNS}
                            data={result.expectedCompetitors}
                            rowKey="id"
                            pageSize={5}
                            emptyMessage="경쟁 업체 데이터가 없습니다."
                        />
                    </Card>
                </>
            )}

            {!result && !loading && (
                <Card className="mt-6">
                    <p className="text-body text-secondary">
                        공고번호 또는 기초금액을 입력하면 유사 공고를 기반으로 추천 투찰 구간을 계산합니다.
                    </p>
                </Card>
            )}
        </div>
    )
}

export default Prediction
