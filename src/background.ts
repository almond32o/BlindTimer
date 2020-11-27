'use strict'

import {
  app,
  protocol,
  BrowserWindow,
  ipcMain,
  dialog,
} from 'electron'
import localShortcut from 'electron-localshortcut'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path';
import fs from 'fs';

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let win: BrowserWindow;

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
          .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true
  })

  if (!isDevelopment) win.setMenu(null);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

// fix the problem that audio files cannot play in electron:build
// https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/872

app.on('ready', async () => {
  registerLocalAudioProtocol()
})

function registerLocalAudioProtocol () {
  protocol.registerFileProtocol('local-audio', (request, callback) => {
    const url = request.url.replace(/^local-audio:\/\//, '')
    // Decode URL to prevent errors when loading filenames with UTF-8 chars or chars like "#"
    const decodedUrl = decodeURI(url) // Needed in case URL contains spaces
    try {
      // eslint-disable-next-line no-undef
      //@ts-ignore
      return callback(path.join(__static, decodedUrl))
    } catch (error) {
      console.error(
        'ERROR: registerLocalAudioProtocol: Could not get file path:',
        error
      )
    }
  })
}

ipcMain.handle('import', (event: Electron.IpcMainInvokeEvent): string | null => {
  try {
    const filePaths: string[] | undefined = dialog.showOpenDialogSync(win, {
      filters: [
        {name: 'text files', extensions: ['csv', 'txt']}
      ],
      properties: [
        'openFile'
      ],
      defaultPath: './'
    });
    if (filePaths === undefined) return null;
    return fs.readFileSync(filePaths[0], 'utf-8').toString();
  } catch(err) {
    dialog.showMessageBoxSync({
      title: 'File import error',
      type: 'error',
      message: 'Failed to import'
    });
    return null;
  }
})

ipcMain.handle('export', (event: Electron.IpcMainInvokeEvent, data: string) => {
  try {
    const filePaths: string | undefined = dialog.showSaveDialogSync(win, {
      filters: [
        {name: 'csv', extensions: ['csv']}
      ],
      defaultPath: './structure.csv'
    });
    if (filePaths === undefined) return;
    fs.writeFileSync(filePaths, data, 'utf-8');
  } catch(err) {
    console.log('error')
    dialog.showMessageBox({
      title: 'File export error',
      type: 'error',
      message: 'Failed to export'
    });
  }
})

ipcMain.handle('parse-error', (event: Electron.IpcMainInvokeEvent, data: string) => {
  dialog.showMessageBox({
    title: 'Parse error',
    type: 'error',
    message: 'Failed to import: file format is incorrect'
  })
})

app.whenReady().then(() => {
  localShortcut.register('Space', () => {
    win.webContents.send('keypress-space');
  })
})
