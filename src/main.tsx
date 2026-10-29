import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

const trackingKeys = new Set(['fbclid', 'gclid', 'dclid', 'gbraid', 'wbraid', 'msclkid'])
const currentUrl = new URL(window.location.href)
let removedTracking = false

for (const key of [...currentUrl.searchParams.keys()]) {
  if (/^utm_/i.test(key) || trackingKeys.has(key.toLowerCase())) {
    currentUrl.searchParams.delete(key)
    removedTracking = true
  }
}

if (removedTracking) {
  window.history.replaceState(window.history.state, '', `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
