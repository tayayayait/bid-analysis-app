/**
 * 앱 전역 상태 스토어
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const getStoredApiKey = () => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem('naramarket_api_key') || ''
}

const getEnvApiKey = () => import.meta.env.VITE_PUBLIC_DATA_KEY || ''

const useAppStore = create(
    persist(
        (set, get) => ({
            // 사이드바 상태
            sidebarCollapsed: false,
            toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

            // 테마 상태
            theme: 'light', // 'light' | 'dark'
            setTheme: (theme) => {
                document.documentElement.setAttribute('data-theme', theme)
                set({ theme })
            },
            toggleTheme: () => {
                const newTheme = get().theme === 'light' ? 'dark' : 'light'
                document.documentElement.setAttribute('data-theme', newTheme)
                set({ theme: newTheme })
            },

            // API 키 상태
            apiKey: getStoredApiKey() || getEnvApiKey(),
            setApiKey: (apiKey) => {
                localStorage.setItem('naramarket_api_key', apiKey)
                set({ apiKey })
            },

            // API 키 확인
            hasApiKey: () => {
                return !!get().apiKey || !!getStoredApiKey() || !!getEnvApiKey()
            },

            // 자동 동기화 설정
            isAutoSyncEnabled: true,
            toggleAutoSync: () => set((state) => ({ isAutoSyncEnabled: !state.isAutoSyncEnabled })),

            // 마지막 동기화 시간
            lastSyncTime: null,
            setLastSyncTime: (time) => set({ lastSyncTime: time }),
        }),
        {
            name: 'app-storage',
            partialize: (state) => ({
                sidebarCollapsed: state.sidebarCollapsed,
                theme: state.theme,
                apiKey: state.apiKey,
                lastSyncTime: state.lastSyncTime,
                isAutoSyncEnabled: state.isAutoSyncEnabled,
            }),
        }
    )
)

export default useAppStore
