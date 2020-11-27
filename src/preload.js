// import { contextBridge, ipcRenderer } from 'electron';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {

  import: async () => {
    return await ipcRenderer.invoke('import');
  },
  export: async (data) => {
    await ipcRenderer.invoke('export', data);
  },
  parseError: async () => {
    ipcRenderer.invoke('parse-error');
  },
  on: async (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  }
})
