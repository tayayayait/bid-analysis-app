
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
let apiKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/VITE_PUBLIC_DATA_KEY=(.*)/);
    if (match && match[1]) {
        apiKey = match[1].trim();
        // Remove quotes if present
        if ((apiKey.startsWith('"') && apiKey.endsWith('"')) || (apiKey.startsWith("'") && apiKey.endsWith("'"))) {
            apiKey = apiKey.slice(1, -1);
        }
    }
} catch (e) {
    console.error('Could not read .env file:', e.message);
}

if (!apiKey) {
    console.error('API Key not found in .env');
    process.exit(1);
}

// 1. Test Construction (with /ad/)
const url = 'http://apis.data.go.kr/1230000/ad/BidPublicInfoService/getBidPblancListInfoCnstwk';

// Params
const today = new Date();
const weekAgo = new Date();
weekAgo.setDate(today.getDate() - 7);
const fmt = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}${m}${day}`;
};

const start = fmt(weekAgo) + '0000';
const end = fmt(today) + '2359';

const fullUrl = `${url}?ServiceKey=${apiKey}&numOfRows=1&pageNo=1&type=json&inqryDiv=1&inqryBgnDt=${start}&inqryEndDt=${end}`;

console.log('Testing Construction API...');
// console.log(fullUrl); // careful with logging key

fetch(fullUrl)
    .then(async (res) => {
        console.log('Status:', res.status);
        const text = await res.text();
        // Try parsing JSON
        try {
            const json = JSON.parse(text);
            console.log('Result Code:', json.response?.header?.resultCode);
            console.log('Result Msg:', json.response?.header?.resultMsg);
        } catch (e) {
            console.log('Response is not JSON:', text.substring(0, 200));
        }
    })
    .catch((err) => console.error('Error:', err));
