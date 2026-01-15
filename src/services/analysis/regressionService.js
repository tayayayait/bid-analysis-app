import { linearRegression, linearRegressionLine, standardDeviation, mean } from 'simple-statistics'

/**
 * Perform simple linear regression on a specific feature
 * @param {Array} data - Array of objects { x: { ...features }, y: target }
 * @param {String} featureKey - Key of the feature to use as X independent variable
 */
export function performRegression(data, featureKey = 'competitors') {
    if (!data || data.length < 2) {
        return { slope: 0, intercept: 0, r2: 0, predict: () => null }
    }

    // Prepare [x, y] points
    const points = data.map(item => [item.x[featureKey] || 0, item.y])

    // Calculate regression model (y = mx + b)
    const regression = linearRegression(points)
    const line = linearRegressionLine(regression)

    // Calculate R-squared (simple version or just rely on slope validity)
    // simple-statistics doesn't have direct R2 for linearRegression, we can implement if needed.
    // For now, return the line function.

    const yValues = points.map(p => p[1])
    const yMean = mean(yValues)
    const stdDev = standardDeviation(yValues)

    return {
        ...regression, // m, b
        predict: (x) => line(x),
        stats: {
            n: points.length,
            yMean,
            stdDev
        }
    }
}

/**
 * Analyze bid rate trends by institution using correlation
 */
export function analyzeInstitutionTrends(data) {
    // Group by institution
    const groups = new Map()
    for (const item of data) {
        const name = item.meta.dminsttNm || item.meta.ntceInsttNm || 'Unknown'
        if (!groups.has(name)) {
            groups.set(name, [])
        }
        groups.get(name).push(item.y)
    }

    const trends = []
    for (const [name, rates] of groups) {
        if (rates.length < 3) continue // Need stats
        const rateMean = mean(rates)
        const rateStd = standardDeviation(rates)
        trends.push({
            name,
            count: rates.length,
            mean: rateMean,
            stdDev: rateStd,
            min: Math.min(...rates),
            max: Math.max(...rates)
        })
    }

    // Sort by most consistent (lowest stdDev) first, then by count
    trends.sort((a, b) => a.stdDev - b.stdDev || b.count - a.count)
    return trends
}
