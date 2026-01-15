/**
 * 입찰 데이터 상태 스토어
 */
import { create } from 'zustand'

const useBidStore = create((set) => ({
    // 현재 업무 구분 (공사/물품/용역/외자)
    businessType: 'cnstwk',
    setBusinessType: (type) => set({ businessType: type }),

    // 입찰 공고 상태
    notices: [],
    noticesLoading: false,
    noticesError: null,
    noticesTotalCount: 0,

    setNotices: (notices, totalCount) => set({
        notices,
        noticesTotalCount: totalCount,
        noticesError: null
    }),
    setNoticesLoading: (loading) => set({ noticesLoading: loading }),
    setNoticesError: (error) => set({ noticesError: error, noticesLoading: false }),

    // 낙찰 결과 상태
    results: [],
    resultsLoading: false,
    resultsError: null,
    resultsTotalCount: 0,

    setResults: (results, totalCount) => set({
        results,
        resultsTotalCount: totalCount,
        resultsError: null
    }),
    setResultsLoading: (loading) => set({ resultsLoading: loading }),
    setResultsError: (error) => set({ resultsError: error, resultsLoading: false }),

    // 필터 상태
    filters: {
        startDate: null,
        endDate: null,
        searchKeyword: '',
        region: '',
    },
    setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
    })),
    resetFilters: () => set({
        filters: {
            startDate: null,
            endDate: null,
            searchKeyword: '',
            region: '',
        }
    }),

    // 페이지네이션
    pagination: {
        pageNo: 1,
        numOfRows: 10,
    },
    setPagination: (pagination) => set((state) => ({
        pagination: { ...state.pagination, ...pagination }
    })),

    // 선택된 공고
    selectedNotice: null,
    setSelectedNotice: (notice) => set({ selectedNotice: notice }),

    // 상세 모달 상태
    detailModalOpen: false,
    setDetailModalOpen: (open) => set({ detailModalOpen: open }),
}))

export default useBidStore
