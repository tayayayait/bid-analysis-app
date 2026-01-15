import { openDB } from 'idb'

const DB_NAME = 'bid_analysis_db'
const DB_VERSION = 3

const ensureIndex = (store, name, keyPath, options) => {
    if (!store.indexNames.contains(name)) {
        store.createIndex(name, keyPath, options)
    }
}

export async function initDB() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db, _oldVersion, _newVersion, transaction) {
            // bid_notices
            const bidNoticesStore = db.objectStoreNames.contains('bid_notices')
                ? transaction.objectStore('bid_notices')
                : db.createObjectStore('bid_notices', { keyPath: 'bidNtceNo' })
            ensureIndex(bidNoticesStore, 'opentDt', 'opentDt')
            ensureIndex(bidNoticesStore, 'bidNtceDt', 'bidNtceDt')
            ensureIndex(bidNoticesStore, 'businessType', 'businessType')

            // bid_results
            const bidResultsStore = db.objectStoreNames.contains('bid_results')
                ? transaction.objectStore('bid_results')
                : db.createObjectStore('bid_results', { keyPath: 'bidNtceNo' })
            ensureIndex(bidResultsStore, 'rlOpengDt', 'rlOpengDt')
            ensureIndex(bidResultsStore, 'sucsfbidAmt', 'sucsfbidAmt')
            ensureIndex(bidResultsStore, 'bidwinnrBizno', 'bidwinnrBizno')

            // opening_results (multiple rows per bid)
            const openingResultsStore = db.objectStoreNames.contains('opening_results')
                ? transaction.objectStore('opening_results')
                : db.createObjectStore('opening_results', { keyPath: 'id', autoIncrement: true })
            ensureIndex(openingResultsStore, 'bidNtceNo', 'bidNtceNo')
            ensureIndex(openingResultsStore, 'bizno', 'bizno')
            ensureIndex(openingResultsStore, 'opengDt', 'opengDt')
            ensureIndex(openingResultsStore, 'opengRank', 'opengRank')

            // prepar_prices (multiple rows per bid)
            const preparPricesStore = db.objectStoreNames.contains('prepar_prices')
                ? transaction.objectStore('prepar_prices')
                : db.createObjectStore('prepar_prices', { keyPath: 'id', autoIncrement: true })
            ensureIndex(preparPricesStore, 'bidNtceNo', 'bidNtceNo')
            ensureIndex(preparPricesStore, 'preparPcNo', 'preparPcNo')

            // contracts
            const contractsStore = db.objectStoreNames.contains('contracts')
                ? transaction.objectStore('contracts')
                : db.createObjectStore('contracts', { keyPath: 'id', autoIncrement: true })
            ensureIndex(contractsStore, 'cntrctNo', 'cntrctNo')
            ensureIndex(contractsStore, 'bidNtceNo', 'bidNtceNo')
            ensureIndex(contractsStore, 'cntrctDt', 'cntrctDt')
            ensureIndex(contractsStore, 'dminsttCd', 'dminsttCd')

            // contract_details
            const contractDetailsStore = db.objectStoreNames.contains('contract_details')
                ? transaction.objectStore('contract_details')
                : db.createObjectStore('contract_details', { keyPath: 'id', autoIncrement: true })
            ensureIndex(contractDetailsStore, 'cntrctNo', 'cntrctNo')
            ensureIndex(contractDetailsStore, 'bidNtceNo', 'bidNtceNo')

            // contract_change_history
            const contractChangeStore = db.objectStoreNames.contains('contract_change_history')
                ? transaction.objectStore('contract_change_history')
                : db.createObjectStore('contract_change_history', { keyPath: 'id', autoIncrement: true })
            ensureIndex(contractChangeStore, 'cntrctNo', 'cntrctNo')
            ensureIndex(contractChangeStore, 'chgDt', 'chgDt')
            ensureIndex(contractChangeStore, 'dminsttCd', 'dminsttCd')

            // contract_delete_history
            const contractDeleteStore = db.objectStoreNames.contains('contract_delete_history')
                ? transaction.objectStore('contract_delete_history')
                : db.createObjectStore('contract_delete_history', { keyPath: 'id', autoIncrement: true })
            ensureIndex(contractDeleteStore, 'cntrctNo', 'cntrctNo')
            ensureIndex(contractDeleteStore, 'dltDt', 'dltDt')

            // companies
            const companiesStore = db.objectStoreNames.contains('companies')
                ? transaction.objectStore('companies')
                : db.createObjectStore('companies', { keyPath: 'bizno' })
            ensureIndex(companiesStore, 'corpNm', 'corpNm')
            ensureIndex(companiesStore, 'bizno', 'bizno')

            // company_industries
            const companyIndustriesStore = db.objectStoreNames.contains('company_industries')
                ? transaction.objectStore('company_industries')
                : db.createObjectStore('company_industries', { keyPath: 'id', autoIncrement: true })
            ensureIndex(companyIndustriesStore, 'bizno', 'bizno')
            ensureIndex(companyIndustriesStore, 'indstrytyCd', 'indstrytyCd')
            ensureIndex(companyIndustriesStore, 'rgstDt', 'rgstDt')

            // company_products
            const companyProductsStore = db.objectStoreNames.contains('company_products')
                ? transaction.objectStore('company_products')
                : db.createObjectStore('company_products', { keyPath: 'id', autoIncrement: true })
            ensureIndex(companyProductsStore, 'bizno', 'bizno')
            ensureIndex(companyProductsStore, 'prdctNo', 'prdctNo')
            ensureIndex(companyProductsStore, 'rgstDt', 'rgstDt')

            // company_penalties
            const companyPenaltiesStore = db.objectStoreNames.contains('company_penalties')
                ? transaction.objectStore('company_penalties')
                : db.createObjectStore('company_penalties', { keyPath: 'id', autoIncrement: true })
            ensureIndex(companyPenaltiesStore, 'bizno', 'bizno')
            ensureIndex(companyPenaltiesStore, 'rsttBgnDt', 'rsttBgnDt')
            ensureIndex(companyPenaltiesStore, 'rsttEndDt', 'rsttEndDt')

            // demand_institutions
            const demandInstitutionsStore = db.objectStoreNames.contains('demand_institutions')
                ? transaction.objectStore('demand_institutions')
                : db.createObjectStore('demand_institutions', { keyPath: 'dminsttCd' })
            ensureIndex(demandInstitutionsStore, 'dminsttCd', 'dminsttCd')
            ensureIndex(demandInstitutionsStore, 'bizno', 'bizno')
            ensureIndex(demandInstitutionsStore, 'rgstDt', 'rgstDt')

            // sync_state
            const syncStateStore = db.objectStoreNames.contains('sync_state')
                ? transaction.objectStore('sync_state')
                : db.createObjectStore('sync_state', { keyPath: 'key' })
            ensureIndex(syncStateStore, 'key', 'key')
        },
    })
}

const toArray = (items) => {
    if (!items) return []
    return Array.isArray(items) ? items : [items]
}

async function saveItems(storeName, items) {
    const list = toArray(items)
    if (list.length === 0) return
    const db = await initDB()
    const tx = db.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    for (const item of list) {
        await store.put(item)
    }
    await tx.done
}

export async function saveBidNotices(notices) {
    return saveItems('bid_notices', notices)
}

export async function saveBidResults(results) {
    return saveItems('bid_results', results)
}

export async function saveOpeningResults(results) {
    return saveItems('opening_results', results)
}

export async function savePreparPrices(prices) {
    return saveItems('prepar_prices', prices)
}

export async function saveContracts(contracts) {
    return saveItems('contracts', contracts)
}

export async function saveContractDetails(details) {
    return saveItems('contract_details', details)
}

export async function saveContractChangeHistory(items) {
    return saveItems('contract_change_history', items)
}

export async function saveContractDeleteHistory(items) {
    return saveItems('contract_delete_history', items)
}

export async function saveCompanies(companies) {
    return saveItems('companies', companies)
}

export async function saveCompanyIndustries(items) {
    return saveItems('company_industries', items)
}

export async function saveCompanyProducts(items) {
    return saveItems('company_products', items)
}

export async function saveCompanyPenalties(items) {
    return saveItems('company_penalties', items)
}

export async function saveDemandInstitutions(items) {
    return saveItems('demand_institutions', items)
}

export async function saveSyncState(key, value) {
    const db = await initDB()
    const tx = db.transaction('sync_state', 'readwrite')
    const store = tx.objectStore('sync_state')
    await store.put({ key, value, updatedAt: new Date().toISOString() })
    await tx.done
}

export async function getSyncState(key) {
    const db = await initDB()
    return db.get('sync_state', key)
}

export async function getAllBidNotices() {
    const db = await initDB()
    return db.getAll('bid_notices')
}

export async function getAllBidResults() {
    const db = await initDB()
    return db.getAll('bid_results')
}

export async function getAllOpeningResults() {
    const db = await initDB()
    return db.getAll('opening_results')
}

export async function getAllContracts() {
    const db = await initDB()
    return db.getAll('contracts')
}

export async function getBidNoticesCount() {
    const db = await initDB()
    return db.count('bid_notices')
}

export async function getOpeningResultsCount() {
    const db = await initDB()
    return db.count('opening_results')
}

export async function getContractsByBidNo(bidNtceNo) {
    const db = await initDB()
    return db.getAllFromIndex('contracts', 'bidNtceNo', bidNtceNo)
}

export async function getContractDetailsByCntrctNo(cntrctNo) {
    const db = await initDB()
    return db.getAllFromIndex('contract_details', 'cntrctNo', cntrctNo)
}

export async function getContractChangeHistoryByCntrctNo(cntrctNo) {
    const db = await initDB()
    return db.getAllFromIndex('contract_change_history', 'cntrctNo', cntrctNo)
}

export async function getContractDeleteHistoryByCntrctNo(cntrctNo) {
    const db = await initDB()
    return db.getAllFromIndex('contract_delete_history', 'cntrctNo', cntrctNo)
}

export async function getBidNoticeByBidNo(bidNtceNo) {
    const db = await initDB()
    return db.get('bid_notices', bidNtceNo)
}

export async function getBidResultByBidNo(bidNtceNo) {
    const db = await initDB()
    return db.get('bid_results', bidNtceNo)
}

export async function getOpeningResultsByBidNo(bidNtceNo) {
    const db = await initDB()
    return db.getAllFromIndex('opening_results', 'bidNtceNo', bidNtceNo)
}

export async function getOpeningResultsByBizno(bizno) {
    const db = await initDB()
    return db.getAllFromIndex('opening_results', 'bizno', bizno)
}

export async function getBidNoticesByIds(ids = []) {
    const db = await initDB()
    const uniqueIds = Array.from(new Set(ids)).filter(Boolean)
    const results = await Promise.all(uniqueIds.map((id) => db.get('bid_notices', id)))
    return results.filter(Boolean)
}

export async function getCompaniesByName(corpNm) {
    const db = await initDB()
    // 1. Try exact match first (Fast)
    const exactMatches = await db.getAllFromIndex('companies', 'corpNm', corpNm)
    if (exactMatches.length > 0) return exactMatches

    // 2. Fallback: Partial match (Scan)
    // Warning: This scans the entire store. 
    // Optimization: In a real large-scale app, use an inversed index or search engine (e.g. Lunr.js).
    const allCompanies = await db.getAll('companies')
    return allCompanies.filter((company) => company.corpNm && company.corpNm.includes(corpNm))
}

export async function getCompanyHistoryByBizno(bizno) {
    const db = await initDB()
    const [company, industries, products, penalties] = await Promise.all([
        db.get('companies', bizno),
        db.getAllFromIndex('company_industries', 'bizno', bizno),
        db.getAllFromIndex('company_products', 'bizno', bizno),
        db.getAllFromIndex('company_penalties', 'bizno', bizno),
    ])

    return {
        company,
        industries,
        products,
        penalties,
    }
}

const RANDOM_COMPANY_NAMES = [
    'Alpha', 'Bravo', 'Cobalt', 'Delta', 'Echo', 'Falcon', 'Granite', 'Helios', 'Ion', 'Jade',
    'Kite', 'Lumen', 'Mirage', 'Nimbus', 'Orion', 'Praxis', 'Quartz', 'Raptor', 'Solstice', 'Titan',
]

async function generateSyntheticData(db) {
    // Helper for Gaussian distribution (Box-Muller transform)
    function randn_bm() {
        let u = 0, v = 0;
        while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while (v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    console.log('[Seed] Generating synthetic opening results (Enhanced)...')
    const tx = db.transaction(['bid_results', 'opening_results'], 'readwrite')
    const resultsStore = tx.objectStore('bid_results')
    const openingStore = tx.objectStore('opening_results')

    const results = await resultsStore.getAll(null, 500) // Generate for last 500 items
    let count = 0

    // Competitor pool to simulate recurring companies
    const competitorPool = Array.from({ length: 50 }, (_, i) => ({
        bizno: (1000000000 + i).toString(),
        name: `${RANDOM_COMPANY_NAMES[i % RANDOM_COMPANY_NAMES.length]} Construction ${i + 1}`
    }))

    for (const result of results) {
        if (!result.bidNtceNo || !result.sucsfbidRate) continue

        const baseRate = parseFloat(result.sucsfbidRate)
        if (isNaN(baseRate)) continue

        // Check if exists
        const existing = await openingStore.index('bidNtceNo').getAll(result.bidNtceNo)
        if (existing.length > 0) continue

        // Generate 15-40 competitors (More realistic competition)
        const numCompetitors = Math.floor(Math.random() * 25) + 15

        // Generate bids with a tendency to cluster around the baseRate (simulating analytics usage)
        // Some outliers high/low
        const bids = []
        for (let i = 0; i < numCompetitors; i++) {
            // Mix of strategies:
            // 70% cluster tight around baseRate (std dev 0.2%)
            // 30% random spread (std dev 1.0%)
            const isSmart = Math.random() > 0.3
            const stdDev = isSmart ? 0.2 : 1.0

            // Random noise
            const noise = randn_bm() * stdDev

            // Calculate rate. Ensure it stays within reasonable bounds (e.g., 87.745% +/- var)
            // But here baseRate is mostly likely the winning rate, so we scatter around it.
            let rate = (baseRate + noise).toFixed(5) // High precision

            // Select random competitor from pool or new one
            let competitor
            if (Math.random() > 0.2) {
                competitor = competitorPool[Math.floor(Math.random() * competitorPool.length)]
            } else {
                competitor = {
                    bizno: Math.floor(Math.random() * 9000000000 + 1000000000).toString(),
                    name: `New Entrant ${Math.floor(Math.random() * 1000)}`
                }
            }

            bids.push({
                rate: parseFloat(rate),
                competitor
            })
        }

        // Sort bids to determine rank
        // Logic: Closest to sucsfbidRate from below? Or just ascending/descending?
        // Usually lower is better, but above floor. 
        // For simplicity, let's just sort by rate ascending.
        bids.sort((a, b) => a.rate - b.rate)

        for (let i = 0; i < bids.length; i++) {
            const bid = bids[i]
            const item = {
                bidNtceNo: result.bidNtceNo,
                bidNtceOrd: result.bidNtceOrd || '000',
                opengRank: String(i + 1),
                bizno: bid.competitor.bizno,
                prcrmntCorpNm: bid.competitor.name,
                bidprcRate: bid.rate.toFixed(4), // Store as string with 4 decimals
                succsfbidRate: result.sucsfbidRate,
                id: `${result.bidNtceNo}-${i}`
            }
            await openingStore.put(item)
            count++
        }
    }
    console.log(`[Seed] Generated ${count} synthetic opening records with Gaussian distribution.`)
}

export async function checkAndSeedData() {
    try {
        const db = await initDB()
        const noticeCount = await db.count('bid_notices')
        const openingCount = await db.count('opening_results')

        if (noticeCount === 0) {
            console.log('[Seed] Database is empty. Seeding initial data...')

            // 1. Fetch Seed Data
            try {
                const [noticesRes, resultsRes, openingRes] = await Promise.all([
                    fetch('./data/seed_bid_notices.json'),
                    fetch('./data/seed_bid_results.json'),
                    fetch('./data/seed_opening_results.json')
                ])

                if (noticesRes.ok && resultsRes.ok) {
                    const notices = await noticesRes.json()
                    const results = await resultsRes.json()
                    const opening = openingRes.ok ? await openingRes.json() : []

                    if (notices.length > 0) {
                        await saveBidNotices(notices)
                        console.log(`[Seed] Loaded ${notices.length} notices.`)
                    }

                    if (results.length > 0) {
                        await saveBidResults(results)
                        console.log(`[Seed] Loaded ${results.length} results.`)

                        if (opening.length === 0) {
                            await generateSyntheticData(db)
                        }
                    }

                    if (opening.length > 0) {
                        await saveOpeningResults(opening)
                        console.log(`[Seed] Loaded ${opening.length} opening results.`)
                    }
                    return true
                }
            } catch (e) {
                console.warn('[Seed] Error loading seed files', e)
            }
        } else if (openingCount < 50) {
            // Self-healing: Data sparse. Try loading seeds first.
            console.log('[Seed] Data sparse (Notices: ' + noticeCount + ', Opening: ' + openingCount + '). Attempting to load seeds...')

            try {
                // Try fetching seeds
                const [noticesRes, resultsRes, openingRes] = await Promise.all([
                    fetch('./data/seed_bid_notices.json'),
                    fetch('./data/seed_bid_results.json'),
                    fetch('./data/seed_opening_results.json')
                ])

                if (noticesRes.ok && openingRes.ok) {
                    const notices = await noticesRes.json()
                    const opening = await openingRes.json()

                    if (notices.length > 0 && opening.length > 0) {
                        await saveBidNotices(notices)
                        await saveOpeningResults(opening)
                        // Also save results if available
                        if (resultsRes.ok) {
                            const results = await resultsRes.json()
                            if (results.length > 0) await saveBidResults(results)
                        }

                        console.log(`[Seed] Successfully injected synthetic seed data (${opening.length} items).`)
                        return true
                    }
                }
            } catch (e) {
                console.warn('[Seed] Failed to load JSON seeds in self-healing mode:', e)
            }

            // Fallback to algorithmic generation if seeds fail
            console.log('[Seed] JSON seeds unavailable. Generating algorithmic synthetic data...')
            await generateSyntheticData(db)
            return true
        } else {
            console.log(`[Seed] Database healthy. Notices: ${noticeCount}, Opening: ${openingCount}`)
        }
    } catch (error) {
        console.error('[Seed] Error during seeding:', error)
    }
    return false
}
