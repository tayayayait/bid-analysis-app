/**
 * 투찰률 분포 히스토그램 차트
 * Recharts 기반
 */
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts'
import './Charts.css'

/**
 * 투찰률 분포 히스토그램
 * @param {Object} props
 * @param {Array<{range: string, count: number, isOptimal?: boolean}>} props.data - 분포 데이터
 */
function BidRateHistogram({ data = [], title = '투찰률 분포' }) {
    // 기본 색상
    const maxCount = data.length ? Math.max(...data.map((item) => item.count || 0)) : 0
    const getBarColor = (entry) => {
        if (entry.isOptimal) return 'var(--color-bid-optimal)'
        const ratio = maxCount > 0 ? (entry.count || 0) / maxCount : 0
        if (ratio >= 0.8) return 'var(--color-bid-hot)'
        if (ratio >= 0.5) return 'var(--color-bid-warm)'
        if (ratio >= 0.2) return 'var(--color-bid-normal)'
        return 'var(--color-bid-cold)'
    }

    return (
        <div className="chart-container">
            {title && <h3 className="chart-title text-h3">{title}</h3>}
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
                    <XAxis
                        dataKey="range"
                        tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
                        axisLine={{ stroke: 'var(--color-border-medium)' }}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
                        axisLine={{ stroke: 'var(--color-border-medium)' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--color-bg-primary)',
                            border: '1px solid var(--color-border-light)',
                            borderRadius: 'var(--radius-sm)',
                        }}
                        formatter={(value) => [`${value}건`, '투찰 수']}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default BidRateHistogram
