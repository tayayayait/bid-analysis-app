import './Badge.css'

/**
 * 상태 뱃지 컴포넌트
 * @param {Object} props
 * @param {'진행중'|'낙찰완료'|'유찰'|'재입찰'|'취소'|'info'|'success'|'warning'|'error'} props.variant
 * @param {React.ReactNode} props.children - 뱃지 텍스트
 */
function Badge({
    variant = 'info',
    children,
    className = '',
    ...props
}) {
    // 상태명 → variant 매핑
    const variantMap = {
        '진행중': 'progress',
        '낙찰완료': 'success',
        '유찰': 'error',
        '재입찰': 'warning',
        '취소': 'neutral',
        'info': 'info',
        'success': 'success',
        'warning': 'warning',
        'error': 'error',
        'progress': 'progress',
        'neutral': 'neutral',
    }

    const mappedVariant = variantMap[variant] || 'info'

    return (
        <span className={`badge badge-${mappedVariant} ${className}`} {...props}>
            {children}
        </span>
    )
}

export default Badge
