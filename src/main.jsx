import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AppLanding from './AppLanding.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

const isLandingOnly = import.meta.env.VITE_LANDING_ONLY === 'true'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      {isLandingOnly ? <AppLanding /> : <App />}
    </ErrorBoundary>
  </React.StrictMode>
)
