import { standardDeviation, mean } from 'simple-statistics'

const parseNumber = (value) => {
    if (value === null || value === undefined) return null
    if (typeof value === 'number') return Number.isFinite(value) ? value : null
    const cleaned = String(value).replace(/,/g, '').replace('%', '').trim()
    const num = Number(cleaned)
    return Number.isFinite(num) ? num : null
}

/**
 * Calculate detailed profile for a competitor
 * @param {Array} openingResults - List of bids participated by this company
 */
export function calculateCompetitorProfile(openingResults) {
    if (!openingResults || openingResults.length < 3) {
        return {
            type: 'UNKNOWN',
            label: '정보 부족',
            aggressiveness: 0,
            consistency: 0,
            winRate: 0
        }
    }

    const rates = openingResults
        .map(r => parseNumber(r.bidprcRate ?? r.bidprcrt))
        .filter(r => r !== null && r > 0)

    if (rates.length < 3) {
        return {
            type: 'UNKNOWN',
            label: '정보 부족',
            aggressiveness: 0,
            consistency: 0,
            winRate: 0
        }
    }

    // 1. Consistency (Standard Deviation)
    // Lower stdDev means higher consistency. 
    // Normalize: 0 (very random, stdDev > 2) to 100 (very consistent, stdDev < 0.2)
    const stdDev = standardDeviation(rates)
    const consistencyScore = Math.max(0, Math.min(100, (2 - stdDev) * 50))

    // 2. Aggressiveness (Average Bid Rate)
    // Lower bid rate means more aggressive.
    // 87.745% (min) -> 100 (Most Aggressive)
    // 88.5% -> Neutral
    // > 90% -> Passive
    const avgRate = mean(rates)
    // Typical range: 86.745% (lower limit) to 87.745% (basic) .. up to 100%
    // Let's assume 87.745 is extreme aggressive (score 100), 95 is passive (score 0)
    const aggressivenessScore = Math.max(0, Math.min(100, (92 - avgRate) * (100 / (92 - 87))))

    // 3. Classification
    let type = 'NORMAL'
    let label = '일반형'

    if (consistencyScore > 80) {
        if (aggressivenessScore > 70) {
            type = 'SNIPER' // High Consistency + Low Rate
            label = '저가 저격형'
        } else {
            type = 'FIXED' // High Consistency + High/Mid Rate
            label = '고정 패턴형'
        }
    } else {
        if (aggressivenessScore > 70) {
            type = 'AGGRESSIVE' // Low Consistency + Low Rate
            label = '공격적 투찰형'
        } else if (aggressivenessScore < 30) {
            type = 'PASSIVE'
            label = '소극적 참여형'
        } else {
            type = 'RANDOM'
            label = '랜덤 투찰형'
        }
    }

    const totalBids = openingResults.length
    const wins = openingResults.filter(r => String(r.opengRank) === '1').length

    return {
        type,
        label,
        aggressiveness: Number(aggressivenessScore.toFixed(1)),
        consistency: Number(consistencyScore.toFixed(1)),
        avgRate: Number(avgRate.toFixed(3)),
        stdDev: Number(stdDev.toFixed(3)),
        winRate: (wins / totalBids) * 100
    }
}

/**
 * Cluster multiple competitors
 * @param {Array} competitorsData - Array of { bizno, openingResults }
 */
export function clusterCompetitors(competitorsData) {
    return competitorsData.map(comp => {
        const profile = calculateCompetitorProfile(comp.openingResults)
        return {
            ...comp,
            profile
        }
    })
}
