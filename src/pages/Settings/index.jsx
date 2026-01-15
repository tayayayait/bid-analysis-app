import { useState } from 'react'
import { Card, Button, Input } from '../../components/common'
import { useAppStore } from '../../stores'
import { syncLargeRange, resyncOpeningResults } from '../../services/dataSyncService'
import './Settings.css'

function Settings() {
    const { theme, toggleTheme, isAutoSyncEnabled, toggleAutoSync, apiKey, setApiKey, hasApiKey } = useAppStore()
    const [isSyncing, setIsSyncing] = useState(false)
    const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0, meta: null })
    const [syncLogs, setSyncLogs] = useState([])
    const [isResyncing, setIsResyncing] = useState(false)
    const [targets, setTargets] = useState({
        notices: true,
        results: true,
        contracts: false,
        companies: false,
    })

    const [types, setTypes] = useState({
        cnstwk: true,
        thng: false,
        servc: false,
        frgcpt: false,
    })

    const [incremental, setIncremental] = useState(false)
    const [apiKeyDraft, setApiKeyDraft] = useState(apiKey || '')

    const appendLog = (message) => {
        setSyncLogs((prev) => [{ id: Date.now(), message }, ...prev].slice(0, 200))
    }

    const handleSaveApiKey = () => {
        const trimmed = apiKeyDraft.trim()
        setApiKey(trimmed)
        alert(trimmed ? 'API 키가 저장되었습니다.' : 'API 키가 삭제되었습니다.')
    }

    const handleSync = async () => {
        const startDate = document.getElementById('syncStartDate').value
        const endDate = document.getElementById('syncEndDate').value

        if (!startDate || !endDate) {
            alert('날짜 범위를 선택해주세요.')
            return
        }

        const selectedTypes = Object.keys(types).filter((key) => types[key])
        const selectedTargets = Object.keys(targets).filter((key) => targets[key])

        if (!selectedTargets.length) {
            alert('동기화 대상을 하나 이상 선택해주세요.')
            return
        }

        if (!selectedTypes.length) {
            alert('업무 유형을 하나 이상 선택해주세요.')
            return
        }

        // if (!confirm(`${startDate} ~ ${endDate} 범위로 동기화를 시작할까요?`)) {
        //     return
        // }

        setIsSyncing(true)
        setSyncProgress({ current: 0, total: 0, meta: null })
        appendLog('동기화를 시작합니다.')

        try {
            await syncLargeRange({
                startDate,
                endDate,
                businessTypes: selectedTypes,
                incremental,
                targets: {
                    notices: targets.notices,
                    results: targets.results,
                    opening: targets.results,
                    contracts: targets.contracts,
                    companies: targets.companies,
                },
                onProgress: (current, total, meta) => {
                    setSyncProgress({ current, total, meta })
                    if (meta?.chunk && (!syncLogs.length || syncLogs[0].message !== `[${meta.chunk}] 처리 중...`)) {
                        // Only log chunk change once to avoid spam, or log separately
                    }
                    if (meta?.step) {
                        const chunkInfo = meta.chunk ? `[${meta.chunk}] ` : ''
                        appendLog(`${chunkInfo}${meta.step} (${current}건)`)
                    }
                },
                onError: (error, meta) => {
                    appendLog(`오류(${meta?.step || 'unknown'}): ${error.message}`)
                },
            })
            appendLog('동기화가 완료되었습니다.')
            alert('동기화가 완료되었습니다.')
        } catch (error) {
            console.error(error)
            appendLog(`동기화 실패: ${error.message}`)
            alert('동기화 중 오류가 발생했습니다.')
        } finally {
            setIsSyncing(false)
        }
    }

    const handleResyncOpening = async (months) => {
        const selectedTypes = Object.keys(types).filter((key) => types[key])
        if (!selectedTypes.length) {
            alert('업무 유형을 하나 이상 선택해주세요.')
            return
        }

        const end = new Date()
        const start = new Date(end)
        start.setMonth(end.getMonth() - months)
        const startDate = start.toISOString().split('T')[0]
        const endDate = end.toISOString().split('T')[0]

        setIsResyncing(true)
        setSyncProgress({ current: 0, total: 0, meta: null })
        appendLog(`개찰 상세 재수집 시작 (${startDate} ~ ${endDate})`)

        try {
            await resyncOpeningResults({
                startDate,
                endDate,
                businessTypes: selectedTypes,
                onProgress: (current, total, meta) => {
                    setSyncProgress({ current, total, meta })
                    if (meta?.step) {
                        appendLog(`${meta.step} (${current}건)`)
                    }
                },
                onError: (error, meta) => {
                    appendLog(`오류(${meta?.step || 'unknown'}): ${error.message}`)
                },
            })
            appendLog('개찰 상세 재수집 완료')
            alert('개찰 상세 재수집이 완료되었습니다.')
        } catch (error) {
            console.error(error)
            appendLog(`개찰 상세 재수집 실패: ${error.message}`)
            alert('개찰 상세 재수집 중 오류가 발생했습니다.')
        } finally {
            setIsResyncing(false)
        }
    }

    const handleTargetToggle = (key) => {
        setTargets((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    const handleTypeToggle = (key) => {
        setTypes((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <div className="settings-page">
            <h1 className="text-h1">설정</h1>

            <Card title="API 키" className="mt-6">
                <p className="text-body-sm text-secondary mb-4">
                    공공데이터포털 ServiceKey를 입력하면 나라장터 API 연동이 동작합니다. (저장 위치: 브라우저 LocalStorage)
                </p>
                <div className="api-key-row">
                    <div className="api-key-input">
                        <Input
                            label="ServiceKey"
                            type="password"
                            placeholder="ServiceKey를 입력하세요"
                            value={apiKeyDraft}
                            onChange={(e) => setApiKeyDraft(e.target.value)}
                            clearable
                            onClear={() => setApiKeyDraft('')}
                        />
                        <p className="text-caption text-secondary mt-1">
                            상태: {hasApiKey() ? '설정됨' : '미설정'}
                        </p>
                    </div>
                    <Button variant="primary" onClick={handleSaveApiKey} className="api-key-save">
                        저장
                    </Button>
                </div>
            </Card>

            <Card title="테마 설정" className="mt-6">
                <div className="theme-toggle">
                    <span className="text-body">현재 테마: {theme === 'light' ? '라이트' : '다크'}</span>
                    <Button variant="secondary" onClick={toggleTheme}>
                        {theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
                    </Button>
                </div>
            </Card>

            <Card title="데이터 동기화" className="mt-6">
                <p className="text-body-sm text-secondary mb-4">
                    공고/낙찰/계약/업체 데이터를 선택한 범위로 동기화합니다.
                </p>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6 border border-gray-100">
                    <div>
                        <h3 className="text-h3 text-gray-800">🔄 자동 동기화</h3>
                        <p className="text-caption text-gray-500 mt-1">
                            앱을 켜두면 주기적으로 최신 데이터를 확인하고 동기화합니다.
                        </p>
                    </div>
                    <div className="toggle-wrapper">
                        <Button
                            variant={isAutoSyncEnabled ? 'primary' : 'secondary'}
                            onClick={toggleAutoSync}
                            className="w-24"
                        >
                            {isAutoSyncEnabled ? 'ON' : 'OFF'}
                        </Button>
                    </div>
                </div>

                <div className="sync-grid">
                    <div className="sync-block">
                        <h3 className="text-h3 mb-2">동기화 대상</h3>
                        <label className="sync-option">
                            <input type="checkbox" checked={targets.notices} onChange={() => handleTargetToggle('notices')} />
                            공고
                        </label>
                        <label className="sync-option">
                            <input type="checkbox" checked={targets.results} onChange={() => handleTargetToggle('results')} />
                            낙찰/개찰
                        </label>
                        <label className="sync-option">
                            <input type="checkbox" checked={targets.contracts} onChange={() => handleTargetToggle('contracts')} />
                            계약
                        </label>

                        <label className="sync-option">
                            <input type="checkbox" checked={targets.companies} onChange={() => handleTargetToggle('companies')} />
                            업체 정보
                        </label>
                    </div>

                    <div className="sync-block">
                        <h3 className="text-h3 mb-2">업무 유형</h3>
                        <label className="sync-option">
                            <input type="checkbox" checked={types.cnstwk} onChange={() => handleTypeToggle('cnstwk')} />
                            공사
                        </label>
                        <label className="sync-option">
                            <input type="checkbox" checked={types.thng} onChange={() => handleTypeToggle('thng')} />
                            물품
                        </label>
                        <label className="sync-option">
                            <input type="checkbox" checked={types.servc} onChange={() => handleTypeToggle('servc')} />
                            용역
                        </label>
                        <label className="sync-option">
                            <input type="checkbox" checked={types.frgcpt} onChange={() => handleTypeToggle('frgcpt')} />
                            외자
                        </label>
                    </div>

                    <div className="sync-block">
                        <h3 className="text-h3 mb-2">동기화 범위</h3>
                        <div className="sync-date">
                            <input
                                type="date"
                                className="border p-2 rounded"
                                defaultValue={new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]}
                                id="syncStartDate"
                            />
                            <span className="text-gray-500">~</span>
                            <input
                                type="date"
                                className="border p-2 rounded"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                id="syncEndDate"
                            />
                        </div>
                        <label className="sync-option mt-2">
                            <input type="checkbox" checked={incremental} onChange={() => setIncremental((prev) => !prev)} />
                            증분 동기화 (마지막 동기화 이후만)
                        </label>
                    </div>
                </div>

                <div className="sync-actions column-layout">
                    <div className="preset-buttons mb-4 flex gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                const end = new Date()
                                const start = new Date()
                                start.setFullYear(end.getFullYear() - 1)
                                document.getElementById('syncStartDate').value = start.toISOString().split('T')[0]
                                document.getElementById('syncEndDate').value = end.toISOString().split('T')[0]
                            }}
                        >
                            최근 1년
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                const end = new Date()
                                const start = new Date()
                                start.setFullYear(end.getFullYear() - 3)
                                document.getElementById('syncStartDate').value = start.toISOString().split('T')[0]
                                document.getElementById('syncEndDate').value = end.toISOString().split('T')[0]
                            }}
                        >
                            최근 3년
                        </Button>
                    </div>

                    <Button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className={`w-full ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSyncing ? '동기화 시작 (시간이 소요될 수 있습니다)' : '데이터 가져오기'}
                    </Button>

                    <div className="mt-4 w-full">
                        <p className="text-body-sm text-secondary mb-2">
                            개찰 상세 재수집 (투찰률/경쟁업체 복구)
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => handleResyncOpening(6)}
                                disabled={isResyncing || isSyncing}
                                className="w-full"
                            >
                                {isResyncing ? '재수집 중...' : '최근 6개월'}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => handleResyncOpening(12)}
                                disabled={isResyncing || isSyncing}
                                className="w-full"
                            >
                                {isResyncing ? '재수집 중...' : '최근 1년'}
                            </Button>
                        </div>
                    </div>
                </div>

                {syncProgress.total > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1 mt-4">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${(syncProgress.current / syncProgress.total) * 100}%` }}
                        ></div>
                        <p className="text-xs text-right mt-1 text-gray-500">
                            {syncProgress.current} / {syncProgress.total} 처리 완료
                        </p>
                    </div>
                )}
            </Card>

            <Card title="동기화 로그" className="mt-6">
                {syncLogs.length === 0 ? (
                    <p className="text-body text-secondary">로그가 없습니다.</p>
                ) : (
                    <ul className="sync-log">
                        {syncLogs.map((log) => (
                            <li key={log.id}>{log.message}</li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    )
}

export default Settings
