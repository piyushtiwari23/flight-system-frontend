import React, { useState } from 'react'
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom'
import LoginPage from './components/LoginPage'
import AdminPanel from './components/AdminPanel'
import RegisterPage from './components/RegisterPage'
import UserDashboard from './components/UserDashboard'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [role, setRole] = useState(localStorage.getItem('role'))

  const handleLogin = (newToken, newRole) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('role', newRole)
    setToken(newToken)
    setRole(newRole)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setToken(null)
    setRole(null)
  }

  return(
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to={role === 'admin' ? '/admin' : '/user'} /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/admin" element={token && role === 'admin' ? <AdminPanel onLogout={handleLogout}/> : <Navigate to="/" />} />
        <Route path="/user" element={token && role === 'user' ? <UserDashboard onLogout={handleLogout}/> : <Navigate to="/" />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  )
}

export default App;