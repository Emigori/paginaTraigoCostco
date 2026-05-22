import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AdminPanel from './AdminPanel.jsx'
import CategoryMatcher from './CategoryMatcher.jsx'

const ADMIN_PATH = `/${import.meta.env.VITE_ADMIN_SECRET}`

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path={ADMIN_PATH} element={<AdminPanel adminSecret={import.meta.env.VITE_ADMIN_SECRET} />} />
        <Route path={`${ADMIN_PATH}/categorizar`} element={<CategoryMatcher adminSecret={import.meta.env.VITE_ADMIN_SECRET} />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
