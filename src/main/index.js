import { app, shell, BrowserWindow, ipcMain, screen, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { createWindow, createChatWindow } from './window' // Import the createWindow function

// 定义所有可能用到的页面
const pages = {
  suspensionWin: undefined,
  chatWin: undefined
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  pages.suspensionWin = createWindow()
  // comment after production
  pages.suspensionWin.webContents.openDevTools({ mode: 'detach' })

  pages.chatWin = createChatWindow()
  pages.chatWin.webContents.openDevTools({ mode: 'detach' })

  // 主进程监听事件相关
  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  //移动悬浮球
  ipcMain.on('suspensionWindowMove', (event, message) => {
    pages.suspensionWin.setPosition(message.x, message.y)
  })

  // ipcMain.on('setFloatIgnoreMouse', (e, data) => {
  //   pages.suspensionWin.setIgnoreMouseEvents(data, { forward: true })
  // })

  let suspensionMenu = null //悬浮球右击菜单
  //创建悬浮球右击菜单
  ipcMain.on('createSuspensionMenu', (e) => {
    if (!suspensionMenu) {
      suspensionMenu = Menu.buildFromTemplate([
        {
          label: '打开客户端',
          click: () => {
            if (pages.suspensionWin === null) {
              //判断主窗口是否存在，已关闭则创建主窗口
              createWindow()
            }
          }
        },
        {
          label: '关闭悬浮球',
          click: () => {
            pages.suspensionWin.close()
          }
        },
        {
          label: '退出软件',
          click: () => {
            app.quit()
          }
        }
      ])
    }
    suspensionMenu.popup({})
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      pages.suspensionWin = createWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
