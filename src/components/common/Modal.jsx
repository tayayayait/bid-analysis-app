import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './Modal.css'

/**
 * 모달 컴포넌트
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 열림 상태
 * @param {function} props.onClose - 닫기 콜백
 * @param {string} props.title - 모달 제목
 * @param {'small'|'medium'|'large'|'full'} props.size - 모달 크기
 * @param {React.ReactNode} props.footer - 푸터 영역
 * @param {boolean} props.closeOnBackdrop - 백드롭 클릭 시 닫기
 * @param {React.ReactNode} props.children - 모달 내용
 */
function Modal({
    isOpen,
    onClose,
    title,
    size = 'medium',
    footer,
    closeOnBackdrop = true,
    children,
}) {
    const modalRef = useRef(null)

    // ESC 키로 닫기
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEsc)
        return () => document.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    // 열릴 때 스크롤 잠금
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    // 백드롭 클릭 핸들러
    const handleBackdropClick = (e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
            onClose()
        }
    }

    if (!isOpen) return null

    return createPortal(
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className={`modal modal-${size}`} ref={modalRef} role="dialog" aria-modal="true">
                {/* 헤더 */}
                <div className="modal-header">
                    <h2 className="modal-title text-h2">{title}</h2>
                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        aria-label="닫기"
                    >
                        ✕
                    </button>
                </div>

                {/* 바디 */}
                <div className="modal-body">
                    {children}
                </div>

                {/* 푸터 */}
                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    )
}

export default Modal
