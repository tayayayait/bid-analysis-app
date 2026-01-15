import './Card.css'

/**
 * 기본 카드 컴포넌트
 * @param {Object} props
 * @param {string} props.title - 카드 제목
 * @param {React.ReactNode} props.headerRight - 헤더 우측 요소 (뱃지, 버튼 등)
 * @param {boolean} props.hoverable - 호버 효과 적용
 * @param {string} props.className - 추가 클래스
 * @param {React.ReactNode} props.children - 카드 내용
 */
function Card({
    title,
    headerRight,
    hoverable = false,
    className = '',
    children,
    ...props
}) {
    const classNames = [
        'card',
        hoverable && 'card-hoverable',
        className
    ].filter(Boolean).join(' ')

    return (
        <div className={classNames} {...props}>
            {(title || headerRight) && (
                <div className="card-header">
                    {title && <h3 className="card-title text-h2">{title}</h3>}
                    {headerRight && <div className="card-header-right">{headerRight}</div>}
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
        </div>
    )
}

/**
 * KPI 통계 카드 컴포넌트
 * @param {Object} props
 * @param {React.ReactNode} props.icon - 아이콘
 * @param {string} props.label - 레이블
 * @param {string|number} props.value - 핵심 수치
 * @param {string} props.change - 변화율 (예: "+12.5%")
 * @param {'up'|'down'|'neutral'} props.trend - 트렌드 방향
 */
function StatCard({
    icon,
    label,
    value,
    change,
    trend = 'neutral',
    className = '',
    ...props
}) {
    return (
        <div className={`stat-card ${className}`} {...props}>
            <div className="stat-header">
                {icon && <span className="stat-icon">{icon}</span>}
                <span className="stat-label text-caption">{label}</span>
            </div>
            <div className="stat-value text-data-lg">{value}</div>
            {change && (
                <div className={`stat-change stat-change-${trend}`}>
                    <span className="stat-change-icon">
                        {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '–'}
                    </span>
                    <span className="stat-change-text text-caption">{change}</span>
                </div>
            )}
        </div>
    )
}

export { Card, StatCard }
export default Card
