import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { IMG } from './media'
import 'lenis/dist/lenis.css'
import './styles.css'
import './art.css'
import './systems.css'
import './editorial.css'

const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
if (favicon) favicon.href = IMG.favicon

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
const root=document.getElementById('root')!
if(root.hasChildNodes()) hydrateRoot(root,app)
else createRoot(root).render(app)
