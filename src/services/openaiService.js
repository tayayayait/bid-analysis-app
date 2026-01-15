/**
 * OpenAI API Client Service
 * 
 * [WARNING]
 * This client-side implementation exposes the API key in the browser.
 * For production, ALL keys must be managed on a backend server.
 */
import OpenAI from 'openai'

const apiKey = import.meta.env.VITE_OPENAI_API_KEY

// Initialize OpenAI client
// dangerousAllowBrowser: true is required for client-side usage
const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
})

/**
 * AI Bid Strategy Advisor
 * @param {Object} params
 * @param {string} params.bidTitle - 입찰 공고 제목
 * @param {string} params.bidContent - 입찰 공고 상세 내용 (또는 요약)
 * @param {Object} params.analysisResult - 분석된 정량적 데이터 (예상 경쟁률, 추천 구간 등)
 */
export async function analyzeBid(params) {
    const { bidTitle, bidContent, analysisResult } = params

    if (!apiKey || apiKey.includes('YOUR_OPENAI_API_KEY')) {
        throw new Error('OpenAI API Key가 설정되지 않았습니다. .env 파일을 확인해주세요.')
    }

    // Build context from analysis result
    let context = ''
    if (analysisResult) {
        context = `
[분석 데이터]
- 기초금액: ${analysisResult.baseAmount || '정보 없음'}
- 예상 참여 업체 수: ${analysisResult.estimatedParticipants || '정보 없음'}
- 추천 투찰 구간: ${analysisResult.recommendation?.optimalRange?.min}% ~ ${analysisResult.recommendation?.optimalRange?.max}%
- 유사 공고 평균 투찰률: ${analysisResult.similarBidsStats?.avgBidRate}%
- 분석 신뢰도: ${analysisResult.recommendation?.confidence}%
`
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: `당신은 조달청 입찰 전략 전문가입니다. 
주어지는 입찰 공고와 분석 데이터를 바탕으로 승부처와 리스크를 파악하고, 구체적인 투찰 전략을 제안해야 합니다.
답변은 다음 형식으로 명확하게 구분하여 작성하세요:

1. 🎯 핵심 전략: (한 줄 요약)
2. ⚠️ 리스크 요인: (주의해야 할 점 1~2가지)
3. 💡 제안: (분석 데이터를 근거로 한 구체적인 행동 제안)

말투는 전문적이고 비즈니스적인 톤을 유지하세요.`
                },
                {
                    role: "user",
                    content: `제목: ${bidTitle}\n${context}\n공고 내용 요약: ${bidContent}\n\n위 정보를 바탕으로 전략을 수립해 주세요.`
                }
            ],
            temperature: 0.7,
            max_tokens: 700
        })

        return response.choices[0].message.content
    } catch (error) {
        console.error('OpenAI Analysis Failed:', error)
        throw new Error('AI 전략 수립 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    }
}
