import { useEffect } from 'react'
import logo from './assets/electron.svg'
import searchIcon from './assets/search_icon.png'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  const { send } = window.electron.ipcRenderer

  let biasX = 0
  let biasY = 0

  const moveEvent = (e) => {
    send('suspensionWindowMove', {
      x: e.screenX - biasX,
      y: e.screenY - biasY
    })
  }

  const initSuspension = () => {
    const suspensionDom = document.getElementsByClassName('suspension')[0]
    suspensionDom.addEventListener('mousedown', function (e) {
      switch (e.button) {
        case 0:
          biasX = e.x
          biasY = e.y
          document.addEventListener('mousemove', moveEvent)
          break
        case 2:
          ;``
          send('createSuspensionMenu')
          break
      }
    })
    suspensionDom.addEventListener('mouseup', function () {
      biasX = 0
      biasY = 0
      document.removeEventListener('mousemove', moveEvent)
    })
  }

  useEffect(() => {
    initSuspension()
  }, [])

  return (
    <div
      className="suspension"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        className="logo-icon"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <img src={logo} alt="Logo" width="32" height="32" />
      </div>
      <div
        className="search-icon"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <img src={searchIcon} alt="Search" width="32" height="32" />
      </div>
    </div>
  )
}

export default App
