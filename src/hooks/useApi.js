/**
 * React Query 기반 API 훅
 * API 호출과 캐싱 관리
 */
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getBidPblancList } from '../services/bidPublicInfoService'
import { getScsbidListSttus, getOpengResultListInfoOpengCompt } from '../services/scsbidInfoService'
import { searchCompany } from '../services/usrInfoService'

// 쿼리 키 상수
export const QUERY_KEYS = {
    BID_NOTICES: 'bidNotices',
    BID_RESULTS: 'bidResults',
    OPENING_RESULT: 'openingResult',
    COMPANY_SEARCH: 'companySearch',
}

/**
 * 입찰 공고 목록 조회 훅
 */
export function useBidNotices(businessType, params = {}, options = {}) {
    const { enabled = true, ...restOptions } = options
    return useQuery({
        queryKey: [QUERY_KEYS.BID_NOTICES, businessType, params],
        queryFn: () => getBidPblancList(businessType, params),
        enabled: !!businessType && enabled,
        staleTime: 5 * 60 * 1000, // 5분
        retry: (failureCount, error) => {
            if (error?.response?.status === 429) return false
            return failureCount < 2
        },
        ...restOptions,
    })
}

/**
 * 낙찰 결과 목록 조회 훅
 */
export function useBidResults(businessType, params = {}) {
    return useQuery({
        queryKey: [QUERY_KEYS.BID_RESULTS, businessType, params],
        queryFn: () => getScsbidListSttus(businessType, params),
        enabled: !!businessType,
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error) => {
            if (error?.response?.status === 429) return false
            return failureCount < 2
        },
    })
}

/**
 * 개찰 결과 상세 조회 훅
 */
export function useOpeningResult(bidNtceNo, bidNtceOrd = '000', bidClsfcNo, rbidNo) {
    return useQuery({
        queryKey: [QUERY_KEYS.OPENING_RESULT, bidNtceNo, bidNtceOrd, bidClsfcNo, rbidNo],
        queryFn: () =>
            getOpengResultListInfoOpengCompt({
                bidNtceNo,
                bidNtceOrd,
                bidClsfcNo,
                rbidNo,
            }),
        enabled: !!bidNtceNo,
        staleTime: 10 * 60 * 1000, // 10분
    })
}

/**
 * 업체 검색 훅
 */
export function useCompanySearch(keyword) {
    return useQuery({
        queryKey: [QUERY_KEYS.COMPANY_SEARCH, keyword],
        queryFn: () => searchCompany(keyword),
        enabled: !!keyword && keyword.length >= 2,
        staleTime: 30 * 60 * 1000, // 30분
    })
}
