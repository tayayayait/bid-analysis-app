import { useState, useMemo } from 'react'
import './DataTable.css'

/**
 * 데이터 테이블 컴포넌트
 * @param {Object} props
 * @param {Array<{key: string, header: string, sortable?: boolean, width?: string, render?: function}>} props.columns - 컬럼 정의
 * @param {Array<Object>} props.data - 데이터 배열
 * @param {string} props.rowKey - 행 고유 키 필드명
 * @param {boolean} props.selectable - 체크박스 선택 기능
 * @param {Array} props.selectedRows - 선택된 행 키 배열
 * @param {function} props.onSelectionChange - 선택 변경 콜백
 * @param {number} props.pageSize - 페이지당 행 수
 * @param {boolean} props.loading - 로딩 상태
 * @param {string} props.emptyMessage - 데이터 없을 때 메시지
 */
function DataTable({
    columns,
    data = [],
    rowKey = 'id',
    selectable = false,
    selectedRows = [],
    onSelectionChange,
    onRowClick,
    pageSize = 10,
    loading = false,
    emptyMessage = '데이터가 없습니다.',
    className = '',
}) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
    const [currentPage, setCurrentPage] = useState(1)

    // 정렬된 데이터
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return data

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key]
            const bValue = b[sortConfig.key]

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })
    }, [data, sortConfig])

    // 페이지네이션된 데이터
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return sortedData.slice(start, start + pageSize)
    }, [sortedData, currentPage, pageSize])

    const totalPages = Math.ceil(data.length / pageSize)

    // 정렬 핸들러
    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }))
    }

    // 전체 선택 핸들러
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            onSelectionChange?.(data.map((row) => row[rowKey]))
        } else {
            onSelectionChange?.([])
        }
    }

    // 행 선택 핸들러
    const handleSelectRow = (key) => {
        const isSelected = selectedRows.includes(key)
        if (isSelected) {
            onSelectionChange?.(selectedRows.filter((k) => k !== key))
        } else {
            onSelectionChange?.([...selectedRows, key])
        }
    }

    const isAllSelected = data.length > 0 && selectedRows.length === data.length

    return (
        <div className={`data-table-wrapper ${className}`}>
            <table className="data-table">
                <thead>
                    <tr>
                        {selectable && (
                            <th className="data-table-checkbox">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                />
                            </th>
                        )}
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                style={{ width: col.width }}
                                className={col.sortable ? 'sortable' : ''}
                                onClick={() => col.sortable && handleSort(col.key)}
                            >
                                <div className="th-content">
                                    <span>{col.header}</span>
                                    {col.sortable && (
                                        <span className="sort-icon">
                                            {sortConfig.key === col.key
                                                ? sortConfig.direction === 'asc'
                                                    ? '▲'
                                                    : '▼'
                                                : '↕'}
                                        </span>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length + (selectable ? 1 : 0)} className="data-table-loading">
                                <div className="loading-spinner" />
                            </td>
                        </tr>
                    ) : paginatedData.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (selectable ? 1 : 0)} className="data-table-empty">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        paginatedData.map((row) => {
                            const key = row[rowKey]
                            const isSelected = selectedRows.includes(key)
                            return (
                                <tr
                                    key={key}
                                    className={`${isSelected ? 'row-selected' : ''} ${onRowClick ? 'row-clickable' : ''}`}
                                    onClick={() => onRowClick?.(row)}
                                    style={onRowClick ? { cursor: 'pointer' } : undefined}
                                >
                                    {selectable && (
                                        <td className="data-table-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleSelectRow(key)}
                                            />
                                        </td>
                                    )}
                                    {columns.map((col) => (
                                        <td key={col.key}>
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            )
                        })
                    )}
                </tbody>
            </table>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="data-table-pagination">
                    <span className="pagination-info text-body-sm">
                        {(currentPage - 1) * pageSize + 1}-
                        {Math.min(currentPage * pageSize, data.length)} of {data.length}
                    </span>
                    <div className="pagination-controls">
                        <button
                            className="pagination-btn"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(1)}
                        >
                            ⟨⟨
                        </button>
                        <button
                            className="pagination-btn"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                        >
                            ⟨
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum
                            if (totalPages <= 5) {
                                pageNum = i + 1
                            } else if (currentPage <= 3) {
                                pageNum = i + 1
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i
                            } else {
                                pageNum = currentPage - 2 + i
                            }
                            return (
                                <button
                                    key={pageNum}
                                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            )
                        })}
                        <button
                            className="pagination-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                        >
                            ⟩
                        </button>
                        <button
                            className="pagination-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                        >
                            ⟩⟩
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DataTable
