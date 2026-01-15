import './Button.css'

/**
 * 버튼 컴포넌트
 * @param {Object} props
 * @param {'primary'|'secondary'|'ghost'|'danger'} props.variant - 버튼 스타일
 * @param {'small'|'medium'|'large'} props.size - 버튼 크기
 * @param {React.ReactNode} props.leftIcon - 좌측 아이콘
 * @param {React.ReactNode} props.rightIcon - 우측 아이콘
 * @param {boolean} props.disabled - 비활성화 상태
 * @param {boolean} props.loading - 로딩 상태
 * @param {boolean} props.fullWidth - 전체 너비
 * @param {React.ReactNode} props.children - 버튼 텍스트
 */
function Button({
    variant = 'primary',
    size = 'medium',
    leftIcon,
    rightIcon,
    disabled = false,
    loading = false,
    fullWidth = false,
    children,
    className = '',
    ...props
}) {
    const classNames = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth && 'btn-full',
        loading && 'btn-loading',
        className
    ].filter(Boolean).join(' ')

    return (
        <button
            className={classNames}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="btn-spinner" />
            ) : (
                <>
                    {leftIcon && <span className="btn-icon btn-icon-left">{leftIcon}</span>}
                    <span className="btn-text">{children}</span>
                    {rightIcon && <span className="btn-icon btn-icon-right">{rightIcon}</span>}
                </>
            )}
        </button>
    )
}

export default Button
