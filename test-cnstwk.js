import axios from 'axios';

const ENCODED_KEY = 'Tm9U4A4bvXGp8V3BL5wMFSc3vKZqECQ95p6DaEcNh9Hm00HIe0wpxkz3f11Vsgvx8sB6sCN6sg7izcBesPFP3Q%3D%3D';
const DECODED_KEY = decodeURIComponent(ENCODED_KEY);

const CNSTWK_URL = 'https://apis.data.go.kr/1230000/BidPublicInfoService/getBidPblancListInfoCnstwk';
const THNG_URL = 'https://apis.data.go.kr/1230000/BidPublicInfoService/getBidPblancListInfoThng';

function getDates() {
    const today = new Date();
    const prev = new Date();
    prev.setDate(today.getDate() - 7);

    // Formatting to YYYYMMDDHHMM
    const fmt = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}${m}${day}`;
    };
    return { start: fmt(prev) + '0000', end: fmt(today) + '2359' };
}

async function runRequest(url, name, key) {
    const { start, end } = getDates();
    console.log(`\n--- Testing ${name} ---`);

    // Construct URL manually to match api.js behavior EXACTLY
    const fullUrl = `${url}?ServiceKey=${key}&numOfRows=1&pageNo=1&type=json&inqryDiv=1&inqryBgnDt=${start}&inqryEndDt=${end}`;
    console.log('URL:', fullUrl);

    try {
        const res = await axios.get(fullUrl);
        console.log('Status:', res.status);
        if (res.data?.response?.header?.resultCode !== '00') {
            console.log('ResultCode:', res.data?.response?.header?.resultCode);
            console.log('ResultMsg:', res.data?.response?.header?.resultMsg);
        }

        const items = res.data?.response?.body?.items;
        if (items) {
            const list = Array.isArray(items) ? items : [items];
            if (list.length > 0) {
                console.log('SUCCESS! First item keys:', Object.keys(list[0]));
                console.log('presmptPrce:', list[0].presmptPrce);
            } else {
                console.log('SUCCESS but no items.');
            }
        }
    } catch (e) {
        console.error('FAILED:', e.message);
        if (e.response) {
            console.log('Status:', e.response.status);
            console.log('Data:', JSON.stringify(e.response.data));
        }
    }
}

async function main() {
    // Try Thng with ENCODED key (since user said Thng works)
    await runRequest(THNG_URL, 'Goods (Thng)', ENCODED_KEY);

    // Try Cnstwk with ENCODED key
    await runRequest(CNSTWK_URL, 'Construction (Cnstwk)', ENCODED_KEY);
}

main();
