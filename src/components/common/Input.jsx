import { forwardRef } from 'react'
import './Input.css'

/**
 * 입력창 컴포넌트
 * @param {Object} props
 * @param {'small'|'medium'|'large'} props.size - 입력창 크기
 * @param {string} props.label - 레이블
 * @param {string} props.error - 에러 메시지
 * @param {string} props.helperText - 도움말 텍스트
 * @param {React.ReactNode} props.leftIcon - 좌측 아이콘
 * @param {React.ReactNode} props.rightIcon - 우측 아이콘 (또는 클리어 버튼)
 * @param {boolean} props.clearable - 클리어 버튼 표시
 */
const Input = forwardRef(function Input({
    size = 'medium',
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    clearable = false,
    onClear,
    className = '',
    value,
    onChange,
    ...props
}, ref) {
    const hasValue = value && value.length > 0

    const handleClear = () => {
        if (onClear) {
            onClear()
        } else if (onChange) {
            onChange({ target: { value: '' } })
        }
    }

    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label className="input-label text-caption">{label}</label>
            )}
            <div className={`input-container input-${size} ${error ? 'input-error' : ''}`}>
                {leftIcon && (
                    <span className="input-icon input-icon-left">{leftIcon}</span>
                )}
                <input
                    ref={ref}
                    className="input-field"
                    value={value}
                    onChange={onChange}
                    {...props}
                />
                {(clearable && hasValue) && (
                    <button
                        type="button"
                        className="input-clear"
                        onClick={handleClear}
                        aria-label="입력 지우기"
                    >
                        ✕
                    </button>
                )}
                {rightIcon && !clearable && (
                    <span className="input-icon input-icon-right">{rightIcon}</span>
                )}
            </div>
            {(error || helperText) && (
                <span className={`input-helper ${error ? 'input-helper-error' : ''}`}>
                    {error || helperText}
                </span>
            )}
        </div>
    )
})

/**
 * 검색 입력창 컴포넌트
 */
function SearchInput({
    placeholder = '검색...',
    ...props
}) {
    return (
        <Input
            leftIcon={<span>🔍</span>}
            placeholder={placeholder}
            clearable
            {...props}
        />
    )
}

export { Input, SearchInput }
export default Input
