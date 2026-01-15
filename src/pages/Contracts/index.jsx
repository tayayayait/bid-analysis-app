import { useEffect, useMemo, useState } from 'react'
import { Card, Button, Modal, Tabs, Badge } from '../../components/common'
import { DataTable } from '../../components/tables'
import { formatAmount, formatDateTime } from '../../types/models'
import {
    getAllContracts,
    getContractDetailsByCntrctNo,
    getContractChangeHistoryByCntrctNo,
    getContractDeleteHistoryByCntrctNo,
} from '../../services/db'
import './Contracts.css'

const TABS = [
    { id: 'all', label: '전체' },
    { id: 'cnstwk', label: '공사' },
    { id: 'thng', label: '물품' },
    { id: 'servc', label: '용역' },
    { id: 'frgcpt', label: '외자' },
]

const CONTRACT_COLUMNS = [
    {
        key: 'cntrctNo',
        header: '계약번호',
        width: '160px',
        sortable: true,
        render: (value, row) => value || row.untyCntrctNo || row.cntrctRefNo || '-',
    },
    {
        key: 'cntrctNm',
        header: '계약명',
        sortable: true,
        render: (value, row) => (
            <span className="truncate" title={value || row.cntrctNm || row.cntrctCnclsNm}>
                {value || row.cntrctNm || row.cntrctCnclsNm || '-'}
            </span>
        ),
    },
    {
        key: 'cntrctDt',
        header: '계약일자',
        width: '120px',
        sortable: true,
        render: (value, row) => formatDateTime(value || row.cntrctCnclsDt),
    },
    {
        key: 'cntrctAmt',
        header: '계약금액',
        width: '120px',
        sortable: true,
        render: (value, row) => {
            const amount = value || row.totCntrctAmt || row.cntrctAmt
            const formatted = formatAmount(amount)
            return <span className="amount-cell">{formatted === '-' ? '-' : `${formatted}원`}</span>
        },
    },
    {
        key: 'dminsttNm',
        header: '수요기관',
        width: '140px',
        render: (value, row) => value || row.dminsttNm || row.dminsttCd || '-',
    },
    {
        key: 'cntrctType',
        header: '유형',
        width: '80px',
        render: (value) => <Badge variant="info">{value || '-'}</Badge>,
    },
]

function Contracts() {
    const [activeTab, setActiveTab] = useState('all')
    const [contracts, setContracts] = useState([])
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState(null)
    const [detailData, setDetailData] = useState({ details: [], changes: [], deletes: [] })
    const [detailLoading, setDetailLoading] = useState(false)

    const loadContracts = async () => {
        setLoading(true)
        const data = await getAllContracts()
        setContracts(data)
        setLoading(false)
    }

    useEffect(() => {
        loadContracts()
    }, [])

    const filteredContracts = useMemo(() => {
        const withId = contracts.map((item, index) => ({
            ...item,
            id: item.id || `${item.cntrctNo || item.untyCntrctNo || item.cntrctRefNo || 'contract'}-${index}`,
        }))
        if (activeTab === 'all') return withId
        return withId.filter((item) => item.cntrctType === activeTab)
    }, [contracts, activeTab])

    const handleRowClick = async (row) => {
        setSelected(row)
        setDetailLoading(true)
        const cntrctNo = row.untyCntrctNo || row.cntrctNo || row.cntrctRefNo
        const [details, changes, deletes] = await Promise.all([
            cntrctNo ? getContractDetailsByCntrctNo(cntrctNo) : [],
            cntrctNo ? getContractChangeHistoryByCntrctNo(cntrctNo) : [],
            cntrctNo ? getContractDeleteHistoryByCntrctNo(cntrctNo) : [],
        ])
        setDetailData({ details, changes, deletes })
        setDetailLoading(false)
    }

    return (
        <div className="contracts-page">
            <div className="page-header">
                <h1 className="text-h1">계약 정보</h1>
                <Button variant="secondary" size="small" onClick={loadContracts} loading={loading}>
                    새로고침
                </Button>
            </div>

            <div className="tabs-section mt-6">
                <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <Card className="mt-4">
                <DataTable
                    columns={CONTRACT_COLUMNS}
                    data={filteredContracts}
                    rowKey="id"
                    pageSize={10}
                    loading={loading}
                    emptyMessage="계약 데이터가 없습니다."
                    onRowClick={handleRowClick}
                />
            </Card>

            <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="계약 상세">
                {selected && (
                    <div className="contract-detail">
                        <div className="detail-summary">
                            <div>
                                <span className="detail-label">계약명</span>
                                <span className="detail-value">{selected.cntrctNm || selected.cntrctCnclsNm || '-'}</span>
                            </div>
                            <div>
                                <span className="detail-label">계약번호</span>
                                <span className="detail-value">{selected.cntrctNo || selected.untyCntrctNo || '-'}</span>
                            </div>
                            <div>
                                <span className="detail-label">계약일자</span>
                                <span className="detail-value">{formatDateTime(selected.cntrctDt || selected.cntrctCnclsDt)}</span>
                            </div>
                            <div>
                                <span className="detail-label">계약금액</span>
                                <span className="detail-value">{formatAmount(selected.totCntrctAmt || selected.cntrctAmt)}원</span>
                            </div>
                        </div>

                        {detailLoading ? (
                            <p className="text-body text-secondary mt-4">상세 정보를 불러오는 중입니다...</p>
                        ) : (
                            <>
                                <div className="detail-section mt-6">
                                    <h3 className="text-h3">계약 상세</h3>
                                    {detailData.details.length ? (
                                        <ul className="detail-list">
                                            {detailData.details.slice(0, 10).map((item) => (
                                                <li key={item.id}>
                                                    {item.prdctNm || item.indstrytyNm || item.prdctNo || item.indstrytyCd}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-body text-secondary">상세 정보가 없습니다.</p>
                                    )}
                                </div>
                                <div className="detail-section mt-6">
                                    <h3 className="text-h3">변경 이력</h3>
                                    {detailData.changes.length ? (
                                        <ul className="detail-list">
                                            {detailData.changes.slice(0, 10).map((item) => (
                                                <li key={item.id}>
                                                    {item.chgDt || item.chgDttm || '-'} {item.cntrctNm || item.cntrctRefNo || ''}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-body text-secondary">변경 이력이 없습니다.</p>
                                    )}
                                </div>
                                <div className="detail-section mt-6">
                                    <h3 className="text-h3">삭제 이력</h3>
                                    {detailData.deletes.length ? (
                                        <ul className="detail-list">
                                            {detailData.deletes.slice(0, 10).map((item) => (
                                                <li key={item.id}>
                                                    {item.dltDt || item.dltDttm || '-'} {item.cntrctRefNo || ''}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-body text-secondary">삭제 이력이 없습니다.</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default Contracts
