import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import CabinetPage from './pages/CabinetPage'
import './App.css'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/cabinet"
          element={
            <ProtectedRoute>
              <CabinetPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/cabinet" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App