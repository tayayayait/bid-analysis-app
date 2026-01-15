/**
 * 월별 트렌드 라인 차트
 * Recharts 기반
 */
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts'
import './Charts.css'

/**
 * 월별 낙찰 추이 차트
 * @param {Object} props
 * @param {Array<{month: string, count: number, rate?: number}>} props.data - 월별 데이터
 * @param {boolean} props.showRate - 낙찰률 표시 여부
 */
function TrendLineChart({
    data = [],
    title = '월별 추이',
    showRate = false,
    dataKey = 'count',
    dataLabel = '건수',
}) {
    return (
        <div className="chart-container">
            {title && <h3 className="chart-title text-h3">{title}</h3>}
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
                    <XAxis
                        dataKey="month"
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
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        name={dataLabel}
                        stroke="var(--chart-color-1)"
                        strokeWidth={2}
                        dot={{ fill: 'var(--chart-color-1)', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                    {showRate && (
                        <Line
                            type="monotone"
                            dataKey="rate"
                            name="평균 낙찰률"
                            stroke="var(--chart-color-2)"
                            strokeWidth={2}
                            dot={{ fill: 'var(--chart-color-2)', strokeWidth: 2, r: 4 }}
                            yAxisId="right"
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TrendLineChart
