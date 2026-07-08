import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { AppRouter } from './router'

function App() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin

  return (
    <BrowserRouter>
      <AppRouter apiBaseUrl={apiBaseUrl} />
    </BrowserRouter>
  )
}

export default App
