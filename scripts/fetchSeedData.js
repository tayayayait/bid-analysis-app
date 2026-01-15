import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_KEY = decodeURIComponent('Tm9U4A4bvXGp8V3BL5wMFSc3vKZqECQ95p6DaEcNh9Hm00HIe0wpxkz3f11Vsgvx8sB6sCN6sg7izcBesPFP3Q%3D%3D');
const BASE_URL = 'https://apis.data.go.kr/1230000';
const OUTPUT_DIR = path.join(__dirname, '../src/data');

// Date Range (Last 1 Year)
const today = new Date();
const oneYearAgo = new Date();
oneYearAgo.setMonth(today.getMonth() - 2); // Fetch last 2 months only for speed/stability

const formatDate = (date, isEnd = false) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const time = isEnd ? '2359' : '0000';
    return `${year}${month}${day}${time}`;
};

const START_DATE = formatDate(oneYearAgo);
const END_DATE = formatDate(today, true);

console.log(`[Config] Range: ${START_DATE} ~ ${END_DATE}`);

// Ensure output dir
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function fetchAll(url, params, name) {
    let allItems = [];
    let pageNo = 1;
    const numOfRows = 100;

    console.log(`[Start] Fetching ${name}...`);

    while (true) {
        try {
            const response = await axios.get(url, {
                params: {
                    ...params,
                    serviceKey: API_KEY, // axios encodes this automatically? No, we might need manual handling if API is picky.
                    // But serviceKey usually needs raw if passed to axios params which encodes it. 
                    // Let's try passing provided key (which was encoded in .env). 
                    // Actually, if I decode it above, axios will encode it back. Correct.
                    numOfRows,
                    pageNo,
                    type: 'json'
                }
            });

            const body = response.data.response.body;
            const items = body.items || [];
            const totalCount = body.totalCount;

            // Debug: Log first item of first page
            if (pageNo === 1 && name === 'Bid Results') {
                console.log(`[Debug] Raw API Response Sample (${name}):`, items && items.length > 0 ? JSON.stringify(items[0], null, 2) : 'No items found');
            }

            if (Array.isArray(items)) {
                allItems.push(...items);
            } else if (items) {
                allItems.push(items);
            }

            process.stdout.write(`\r[Progress] ${name}: ${allItems.length} / ${totalCount}`);

            if (allItems.length >= totalCount || items.length === 0) {
                console.log('\n[Done] Finished.');
                break;
            }

            pageNo++;
            await new Promise(r => setTimeout(r, 100)); // Throttle
        } catch (error) {
            console.error(`\n[Error] Page ${pageNo}:`, error.message);
            if (error.response) console.error(error.response.data);
            break;
        }
    }
    return allItems;
}

async function run() {
    // 1. Bid Notices (Construction)
    const notices = await fetchAll(
        `${BASE_URL}/BidPublicInfoService/getBidPblancListInfoCnstwk`,
        {
            inqryDiv: '1',
            inqryBgnDt: START_DATE,
            inqryEndDt: END_DATE,
        },
        'Bid Notices'
    );
    fs.writeFileSync(path.join(OUTPUT_DIR, 'seed_bid_notices.json'), JSON.stringify(notices, null, 2));

    // 2. Bid Results (Construction)
    const results = await fetchAll(
        `${BASE_URL}/ScsbidInfoService/getScsbidListSttusCnstwk`,
        {
            inqryDiv: '1',
            inqryBgnDt: START_DATE,
            inqryEndDt: END_DATE,
        },
        'Bid Results'
    );
    // Add 'type' field to match app logic (optional, but good for uniformity)
    const resultsWithType = results.map(item => ({ ...item, type: 'cnstwk' }));

    if (resultsWithType.length > 0) {
        console.log('[Debug] First result item:', JSON.stringify(resultsWithType[0], null, 2));
    } else {
        console.log('[Debug] No results fetched.');
    }

    fs.writeFileSync(path.join(OUTPUT_DIR, 'seed_bid_results.json'), JSON.stringify(resultsWithType, null, 2));

    // 3. Opening Results (Detailed Bidders)
    console.log('[Start] Fetching Opening Results (This may take a while)...');
    const openingResults = [];
    const BATCH_SIZE = 5; // Parallel requests

    // Filter results that have opened (use winner name or success rate as proxy)
    const targetBids = resultsWithType.filter(r => (r.opengYn === 'Y' || r.bidwinnrNm || r.sucsfbidRate) && r.bidNtceNo);
    console.log(`[Info] Found ${targetBids.length} opened bids to fetch details for.`);

    // Helper for delay
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    for (let i = 0; i < targetBids.length; i += BATCH_SIZE) {
        const batch = targetBids.slice(i, i + BATCH_SIZE);
        const promises = batch.map(async (bid) => {
            try {
                const res = await axios.get(`${BASE_URL}/OpengResultInfoService/getOpengResultListInfoOpengCompt`, {
                    params: {
                        serviceKey: API_KEY,
                        bidNtceNo: bid.bidNtceNo,
                        numOfRows: 100,
                        pageNo: 1,
                        type: 'json'
                    }
                });
                const body = res.data.response.body;
                const items = body.items;
                return Array.isArray(items) ? items : (items ? [items] : []);
            } catch (err) {
                return [];
            }
        });

        const batchResults = await Promise.all(promises);
        batchResults.flat().forEach(item => openingResults.push(item));

        process.stdout.write(`\r[Progress] Opening Results: ${openingResults.length} items (Processed ${Math.min(i + BATCH_SIZE, targetBids.length)}/${targetBids.length} bids)`);
        await delay(50); // Be gentle with the API
    }

    fs.writeFileSync(path.join(OUTPUT_DIR, 'seed_opening_results.json'), JSON.stringify(openingResults, null, 2));

    console.log(`\nSuccess! Saved to ${OUTPUT_DIR}`);
}

run();
