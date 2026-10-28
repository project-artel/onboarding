import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/index.css'
import './styles/responsive.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element was not found')
}

createRoot(root).render(<App />)
