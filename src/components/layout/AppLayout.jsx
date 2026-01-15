import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useSchedulerStore } from '../../services/scheduler'
import './AppLayout.css'

function AppLayout() {
    const location = useLocation()
    const { isSyncing, lastSyncTime, progress } = useSchedulerStore()
    const isActive = (path) => (location.pathname.startsWith(path) ? 'nav-item active' : 'nav-item')

    // useEffect(() => {
    //     startScheduler()
    //     return () => stopScheduler()
    // }, [])

    const formatTime = (date) => {
        if (!date) return '-'
        return new Date(date).toLocaleString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1 className="sidebar-logo">나라장터 분석</h1>
                </div>
                <nav className="sidebar-nav">
                    <a href="/dashboard" className={isActive('/dashboard')}>
                        📊 대시보드
                    </a>
                    <a href="/notices" className={isActive('/notices')}>
                        📢 입찰 공고
                    </a>
                    <a href="/results" className={isActive('/results')}>
                        🏁 낙찰 현황
                    </a>

                    <a href="/analysis" className={isActive('/analysis')}>
                        📈 경쟁사 분석
                    </a>
                    <a href="/prediction" className={isActive('/prediction')}>
                        🧭 투찰 예측
                    </a>
                    <a href="/settings" className={isActive('/settings')}>
                        ⚙️ 설정
                    </a>
                </nav>
                <div className="sidebar-footer">
                    <div className="sync-status">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-caption">데이터 동기화</span>
                            {isSyncing && <span className="text-caption text-primary animate-pulse">●</span>}
                        </div>
                        {isSyncing ? (
                            <div className="sync-progress">
                                <span className="text-caption text-secondary">
                                    {progress.step} ({progress.current})
                                </span>
                            </div>
                        ) : (
                            <div className="last-sync">
                                <span className="text-caption text-secondary">마지막: {formatTime(lastSyncTime)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            <div className="main-area">
                <header className="header">
                    <div className="header-title">입찰 패턴 분석 시스템</div>
                </header>

                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AppLayout
