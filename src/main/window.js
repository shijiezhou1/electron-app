import { BrowserWindow, shell, screen } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// Create the window function
const createWindow = () => {
  // Create the browser window.

  // 悬浮球的一些设置
  const suspensionConfig = {
    width: 80,
    height: 40
  }

  const win = new BrowserWindow({
    width: suspensionConfig.width,
    height: suspensionConfig.height,
    type: 'toolbar',
    frame: false,
    resizable: false,
    transparent: true,
    alwaysOnTop: true,
    show: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  win.on('ready-to-show', () => {
    win.show()
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  const { left, top } = {
    left: screen.getPrimaryDisplay().workAreaSize.width - 150,
    top: screen.getPrimaryDisplay().workAreaSize.height - 100
  }

  win.setPosition(left, top)

  return win
}

const createChatWindow = () => {
  // Create the main page window.

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    type: 'normal',
    frame: true,
    resizable: true,
    transparent: false,
    alwaysOnTop: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  win.on('ready-to-show', () => {
    win.show()
  })

  // Load the main page content
  win.loadFile(join(__dirname, '../renderer/chat/index.html'))

  return win
}

export { createChatWindow, createWindow }
