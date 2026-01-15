
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

// 1. 쿼리 클라이언트 생성
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // 데이터 유효 시간 (24시간) - 하루 한도로 인해 길게 설정
            staleTime: 1000 * 60 * 60 * 24,
            // 가비지 컬렉션 시간 (48시간)
            gcTime: 1000 * 60 * 60 * 48,
            retry: 1,
            refetchOnWindowFocus: false, // 윈도우 포커스시 재요청 방지
            refetchOnMount: false, // 컴포넌트 마운트시 재요청 방지 (캐시 우선)
        },
    },
})

// 2. 퍼시스터 생성 (로컬 스토리지 사용)
export const persister = createSyncStoragePersister({
    storage: window.localStorage,
    // 키 prefix 설정
    key: 'BID_ANALYSIS_CACHE',
})

export { PersistQueryClientProvider }
