const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    // Expose limited APIs for security
    // e.g. sendNotification: (msg) => ipcRenderer.send('notify', msg)
    isElectron: true,
    apiBase: 'http://127.0.0.1:17890/api',
})
