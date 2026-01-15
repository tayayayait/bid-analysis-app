import { useState } from 'react'
import { Card, Button, Badge } from '../../components/common'
import { analyzeBid } from '../../services/openaiService'
import './StrategyCard.css'

function StrategyCard({ bidTitle, bidContent, analysisResult }) {
    const [strategy, setStrategy] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleAnalyze = async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await analyzeBid({
                bidTitle,
                bidContent: bidContent || '상세 내용 없음',
                analysisResult
            })
            setStrategy(result)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!bidTitle) return null

    return (
        <Card className="strategy-card mt-6">
            <div className="strategy-header">
                <div className="flex items-center gap-3">
                    <h2 className="text-h2">🤖 AI 전략 어드바이저</h2>
                    <Badge variant="warning">GPT-4.1 mini</Badge>
                </div>
                {!strategy && (
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleAnalyze}
                        loading={loading}
                    >
                        전략 수립하기
                    </Button>
                )}
            </div>

            {loading && (
                <div className="strategy-loading">
                    <p className="text-body animate-pulse">AI가 입찰 공고와 분석 데이터를 검토하고 있습니다...</p>
                </div>
            )}

            {error && (
                <div className="strategy-error">
                    <p className="text-caption text-red-600">오류: {error}</p>
                    <Button variant="text" size="sm" onClick={handleAnalyze}>다시 시도</Button>
                </div>
            )}

            {strategy && (
                <div className="strategy-content mt-4">
                    <pre className="strategy-text">{strategy}</pre>
                    <div className="strategy-footer mt-4">
                        <Button variant="outline" size="sm" onClick={() => setStrategy(null)}>
                            새로 분석하기
                        </Button>
                    </div>
                </div>
            )}

            {!strategy && !loading && !error && (
                <p className="text-body text-secondary mt-2">
                    현재 공고와 분석된 데이터를 바탕으로 최적의 입찰 전략을 제안합니다.
                </p>
            )}
        </Card>
    )
}

export default StrategyCard
