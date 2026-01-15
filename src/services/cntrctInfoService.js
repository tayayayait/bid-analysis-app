/**
 * Contract Information Service API
 * Base: /ao/CntrctInfoService
 */
import { callApi } from './api'

const SERVICE_PATH = '/ao/CntrctInfoService'
const DEFAULT_CALL_OPTIONS = { retry: 2, retryDelay: 800, throttleMs: 200 }

// Thng (Goods)
export const getCntrctInfoListThng = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListThng`, params, DEFAULT_CALL_OPTIONS)

export const getCntrctInfoListThngDetail = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListThngDetail`, params, DEFAULT_CALL_OPTIONS)

export const getCntrctInfoListThngPPSSrch = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListThngPPSSrch`, params, DEFAULT_CALL_OPTIONS)

export const getCntrctInfoListThngChgHstry = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListThngChgHstry`, params, DEFAULT_CALL_OPTIONS)

export const getCntrctInfoListThngDltHstry = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListThngDltHstry`, params, DEFAULT_CALL_OPTIONS)

// Cnstwk (Construction)
export const getCntrctInfoListCnstwk = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListCnstwk`, params, DEFAULT_CALL_OPTIONS)

export const getCntrctInfoListCnstwkServcInfo = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListCnstwkServcInfo`, params, DEFAULT_CALL_OPTIONS)

export const getCntrctInfoListCnstwkPPSSrch = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListCnstwkPPSSrch`, params, DEFAULT_CALL_OPTIONS)

export const getCntrctInfoListCnstwkChgHstry = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListCnstwkChgHstry`, params, DEFAULT_CALL_OPTIONS)

export const getCntrctInfoListCnstwkDltHstry = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListCnstwkDltHstry`, params, DEFAULT_CALL_OPTIONS)

// Servc (Service)
export const getCntrctInfoListServc = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListServc`, params, DEFAULT_CALL_OPTIONS)

export const getCntrctInfoListGnrlServcServcInfo = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListGnrlServcServcInfo`, params, DEFAULT_CALL_OPTIONS)

export const getCntrctInfoListTechServcServcInfo = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListTechServcServcInfo`, params, DEFAULT_CALL_OPTIONS)

export const getCntrctInfoListServcPPSSrch = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListServcPPSSrch`, params, DEFAULT_CALL_OPTIONS)

export const getCntrctInfoListServcChgHstry = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListServcChgHstry`, params, DEFAULT_CALL_OPTIONS)

export const getCntrctInfoListServcDltHstry = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListServcDltHstry`, params, DEFAULT_CALL_OPTIONS)

// Frgcpt (Foreign Procurement)
export const getCntrctInfoListFrgcpt = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListFrgcpt`, params, DEFAULT_CALL_OPTIONS)

export const getCntrctInfoListFrgcptDetail = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListFrgcptDetail`, params, DEFAULT_CALL_OPTIONS)

export const getCntrctInfoListFrgcptPPSSrch = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListFrgcptPPSSrch`, params, DEFAULT_CALL_OPTIONS)

export const getCntrctInfoListFrgcptChgHstry = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListFrgcptChgHstry`, params, DEFAULT_CALL_OPTIONS)

export const getCntrctInfoListFrgcptDltHstry = (params = {}) =>
    callApi(`${SERVICE_PATH}/getCntrctInfoListFrgcptDltHstry`, params, DEFAULT_CALL_OPTIONS)
