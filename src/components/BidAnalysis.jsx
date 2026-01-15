import { useState } from 'react'
import { analyzeBid } from '../services/openaiService'

/**
 * BidAnalysis Component
 * Displays a button to trigger AI analysis for a specific bid.
 */
export default function BidAnalysis({ bidTitle, bidContent }) {
    const [analysisResult, setAnalysisResult] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleAnalyze = async () => {
        setLoading(true)
        setError(null)
        try {
            // If bidContent is too long, truncate it to avoid token limits (brief example)
            const contentToAnalyze = bidContent || "상세 내용 없음"
            const result = await analyzeBid(bidTitle, contentToAnalyze)
            setAnalysisResult(result)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bid-analysis-container p-4 mt-4 bg-gray-50 border rounded-lg">
            <h3 className="text-lg font-bold mb-2">🤖 AI 입찰 분석</h3>

            {!analysisResult && !loading && (
                <div className="text-center py-4">
                    <p className="mb-4 text-gray-600">이 공고의 핵심 내용과 낙찰 전략을 AI가 분석해드립니다.</p>
                    <button
                        onClick={handleAnalyze}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        분석 시작하기
                    </button>
                </div>
            )}

            {loading && (
                <div className="text-center py-4 text-gray-600">
                    <span className="animate-pulse">⏳ AI가 공고를 분석 중입니다...</span>
                </div>
            )}

            {error && (
                <div className="text-red-500 py-2">
                    ⚠️ {error}
                </div>
            )}

            {analysisResult && (
                <div className="analysis-result prose max-w-none">
                    <div className="whitespace-pre-line bg-white p-4 rounded border">
                        {analysisResult}
                    </div>
                    <button
                        onClick={() => setAnalysisResult('')}
                        className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                        다시 분석하기
                    </button>
                </div>
            )}
        </div>
    )
}
