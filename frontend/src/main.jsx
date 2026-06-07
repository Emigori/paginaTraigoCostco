import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AdminPanel from './AdminPanel.jsx'
import CategoryMatcher from './CategoryMatcher.jsx'

function AdminRoute() {
  const { secret } = useParams()
  return <AdminPanel adminSecret={secret} />
}

function CategoryRoute() {
  const { secret } = useParams()
  return <CategoryMatcher adminSecret={secret} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:secret" element={<AdminRoute />} />
        <Route path="/:secret/categorizar" element={<CategoryRoute />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
