import { Routes, Route, Navigate } from 'react-router-dom'

// 페이지 컴포넌트 (추후 구현)
import Dashboard from './pages/Dashboard'
import BidNotices from './pages/BidNotices'
import BidResults from './pages/BidResults'
import CompetitorAnalysis from './pages/CompetitorAnalysis'
import Prediction from './pages/Prediction'
import Contracts from './pages/Contracts'
import Settings from './pages/Settings'

// 레이아웃 컴포넌트 (Phase 2에서 구현)
import AppLayout from './components/layout/AppLayout'

import { useEffect } from 'react'
import { checkAndSeedData } from './services/db'
import { startScheduler } from './services/scheduler'

function App() {
  useEffect(() => {
    checkAndSeedData()
    startScheduler()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* 기본 경로는 대시보드로 리다이렉트 */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* 메인 페이지들 */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="notices" element={<BidNotices />} />
        <Route path="results" element={<BidResults />} />
        <Route path="analysis" element={<CompetitorAnalysis />} />
        <Route path="prediction" element={<Prediction />} />
        <Route path="contracts" element={<Contracts />} />
        <Route path="settings" element={<Settings />} />

        {/* 404 처리 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default App
