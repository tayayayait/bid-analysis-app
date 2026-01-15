import { app, BrowserWindow, shell } from 'electron'
import * as http from 'http'
import * as https from 'https'
import { join } from 'path'
import { URL } from 'url'
// Simplified main.js for CommonJS or ESM. Since we are in an ESM project ("type": "module"), we can use import.

// However, electron main process in ESM can be tricky if not configured.
// Let's stick to standard require if "type": "module" causes issues, OR rename to .cjs.
// But package.json says "type": "module".
// Let's try ESM.

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged
const API_PROXY_HOST = '127.0.0.1'
const API_PROXY_PORT = 17890
const API_TARGET_ORIGIN = 'https://apis.data.go.kr/1230000'
let apiProxyServer = null

function startApiProxy() {
    if (apiProxyServer) return

    apiProxyServer = http.createServer((req, res) => {
        const urlPath = req.url || ''
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,OPTIONS',
            'Access-Control-Allow-Headers': req.headers['access-control-request-headers'] || '*',
        }

        if (req.method && req.method.toUpperCase() === 'OPTIONS') {
            res.writeHead(204, corsHeaders)
            res.end()
            return
        }

        if (!urlPath.startsWith('/api')) {
            res.writeHead(404, { ...corsHeaders, 'Content-Type': 'text/plain' })
            res.end('Not Found')
            return
        }

        const targetPath = urlPath.replace(/^\/api/, '')
        const targetUrl = new URL(targetPath, API_TARGET_ORIGIN)

        const proxyReq = https.request(
            targetUrl,
            {
                method: req.method,
                headers: {
                    ...req.headers,
                    host: targetUrl.host,
                },
            },
            (proxyRes) => {
                res.writeHead(proxyRes.statusCode || 500, {
                    ...proxyRes.headers,
                    ...corsHeaders,
                })
                proxyRes.pipe(res)
            }
        )

        proxyReq.on('error', (error) => {
            console.error('API Proxy Error:', error)
            res.writeHead(502, { ...corsHeaders, 'Content-Type': 'text/plain' })
            res.end('Bad Gateway')
        })

        if (req.method && req.method.toUpperCase() === 'GET') {
            proxyReq.end()
        } else {
            req.pipe(proxyReq)
        }
    })

    apiProxyServer.listen(API_PROXY_PORT, API_PROXY_HOST, () => {
        console.log(`API proxy listening on http://${API_PROXY_HOST}:${API_PROXY_PORT}`)
    })

    apiProxyServer.on('error', (error) => {
        console.error('API Proxy Server Error:', error)
    })
}

function stopApiProxy() {
    if (apiProxyServer) {
        apiProxyServer.close()
        apiProxyServer = null
    }
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: join(process.cwd(), 'electron/preload.js'),
        },
        autoHideMenuBar: true, // Hide menu bar for app-like feel
        title: '입찰 패턴 분석 시스템',
    })

    // Open external links in browser
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http')) {
            shell.openExternal(url)
            return { action: 'deny' }
        }
        return { action: 'allow' }
    })

    if (isDev) {
        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools()
    } else {
        win.loadFile(join(process.cwd(), 'dist/index.html'))
    }
}

app.whenReady().then(() => {
    if (!isDev) {
        startApiProxy()
    }

    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
    stopApiProxy()
})
