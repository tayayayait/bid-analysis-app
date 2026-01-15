import { syncAllData, syncLargeRange } from './dataSyncService'
import { create } from 'zustand'
import { useAppStore } from '../stores'
import {
    getBidNoticesCount,
    getOpeningResultsCount,
    getSyncState,
    saveSyncState,
} from './db'

export const useSchedulerStore = create((set) => ({
    isSyncing: false,
    lastSyncTime: null,
    nextSyncTime: null,
    error: null,
    progress: { current: 0, total: 0, step: '' },
    setSyncing: (isSyncing) => set({ isSyncing }),
    setLastSyncTime: (time) => set({ lastSyncTime: time }),
    setNextSyncTime: (time) => set({ nextSyncTime: time }),
    setError: (error) => set({ error }),
    setProgress: (progress) => set({ progress }),
}))

let timerId = null
const CHECK_INTERVAL_MS = 60 * 60 * 1000 // Check every 1 hour
const DAILY_MS = 24 * 60 * 60 * 1000
const INITIAL_SYNC_YEARS = 3
const DEFAULT_INCREMENTAL_LOOKBACK_DAYS = 30
// MVP scope: 시설 공사 중심
const DEFAULT_SYNC_TYPES = ['cnstwk']
const GLOBAL_SYNC_KEY = 'sync:global:lastRun'

export function startScheduler() {
    if (timerId) return

    // Run immediately on start if needed, then schedule periodic checks
    runSyncJob({ reason: 'startup' })
    scheduleNextRun()
}

export function stopScheduler() {
    if (timerId) {
        clearTimeout(timerId)
        timerId = null
    }
}

function scheduleNextRun() {
    timerId = setTimeout(async () => {
        await runSyncJob()
        scheduleNextRun()
    }, CHECK_INTERVAL_MS)
}

const toDateOnly = (date) => date.toISOString().split('T')[0]

const daysBetween = (start, end) => Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))

const getLastRunAt = async () => {
    const state = await getSyncState(GLOBAL_SYNC_KEY)
    const raw = state?.value?.lastRunAt
    if (!raw) return null
    const parsed = new Date(raw)
    return Number.isNaN(parsed.getTime()) ? null : parsed
}

const setLastRunAt = async (date, mode, range) => {
    await saveSyncState(GLOBAL_SYNC_KEY, {
        lastRunAt: date.toISOString(),
        mode,
        range,
    })
}

const needsInitialSync = async () => {
    const [noticeCount, openingCount] = await Promise.all([
        getBidNoticesCount(),
        getOpeningResultsCount(),
    ])
    return noticeCount === 0 || openingCount === 0
}

const resolveSyncPlan = async (force) => {
    if (force) return { shouldRun: true, mode: 'force' }

    // Check Auto Sync Setting
    const { isAutoSyncEnabled } = useAppStore.getState()
    if (!isAutoSyncEnabled) return { shouldRun: false, mode: 'skip' }

    // Skip auto sync when API key is missing (seed data can still be used)
    const { hasApiKey } = useAppStore.getState()
    if (typeof hasApiKey === 'function' && !hasApiKey()) {
        return { shouldRun: false, mode: 'skip' }
    }

    if (await needsInitialSync()) return { shouldRun: true, mode: 'initial' }

    const lastRunAt = await getLastRunAt()
    if (!lastRunAt) return { shouldRun: true, mode: 'incremental' }

    const elapsed = Date.now() - lastRunAt.getTime()
    if (elapsed >= DAILY_MS) return { shouldRun: true, mode: 'incremental' }

    return { shouldRun: false, mode: 'skip' }
}

export async function runSyncJob(options = {}) {
    const { force = false, startDate: startDateOpt, endDate: endDateOpt } = options
    const store = useSchedulerStore.getState()
    if (store.isSyncing) return
    const appState = useAppStore.getState()
    if (!appState.isAutoSyncEnabled && !force && !(startDateOpt && endDateOpt)) {
        return
    }

    const plan = await resolveSyncPlan(force)
    if (!plan.shouldRun) {
        return
    }

    store.setSyncing(true)
    store.setError(null)

    try {
        const today = new Date()

        let startDate = null
        let endDate = null
        let incremental = true

        if (startDateOpt && endDateOpt) {
            startDate = new Date(startDateOpt)
            endDate = new Date(endDateOpt)
            incremental = !force && plan.mode !== 'initial'
        } else if (plan.mode === 'initial' || force) {
            endDate = today
            startDate = new Date(today)
            startDate.setFullYear(today.getFullYear() - INITIAL_SYNC_YEARS)
            incremental = false
        } else {
            endDate = today
            const lastRunAt = await getLastRunAt()
            if (lastRunAt) {
                startDate = lastRunAt
            } else {
                startDate = new Date(today)
                startDate.setDate(today.getDate() - DEFAULT_INCREMENTAL_LOOKBACK_DAYS)
            }
        }

        const startStr = toDateOnly(startDate)
        const endStr = toDateOnly(endDate)
        const rangeDays = daysBetween(startDate, endDate)
        const syncFn = !incremental && rangeDays > 366 ? syncLargeRange : syncAllData

        await syncFn({
            startDate: startStr,
            endDate: endStr,
            incremental,
            businessTypes: DEFAULT_SYNC_TYPES,
            onProgress: (current, total, meta) => {
                store.setProgress({ current, total, step: meta.step })
            },
            onError: (err) => {
                console.error('Background Sync Error:', err)
                if (err?.response?.status === 429 || err?.message?.includes('Quota Exceeded')) {
                    throw new Error('FATAL_SYNC_ERROR: API Quota Exceeded')
                }
                // Don't stop the whole process on minor errors
            }
        })
        const finishedAt = new Date()
        store.setLastSyncTime(finishedAt)
        await setLastRunAt(finishedAt, plan.mode, { startDate: startStr, endDate: endStr })
    } catch (error) {
        console.error('Scheduler Fatal Error:', error)
        store.setError(error.message)
    } finally {
        store.setSyncing(false)
        store.setProgress({ current: 0, total: 0, step: '' })
    }
}
