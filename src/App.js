import React from 'react'
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom'
import LoginPage from './components/LoginPage'
import AdminPanel from './components/AdminPanel'
import RegisterPage from './components/RegisterPage'
import UserDashboard from './components/UserDashboard'

function App() {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  return(
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to={role === 'admin' ? '/admin' : '/user'} /> : <LoginPage />} />
        <Route path="/admin" element={token && role === 'admin' ? <AdminPanel/> : <Navigate to="/" />} />
        <Route path="/user" element={token && role === 'user' ? <UserDashboard/> : <Navigate to="/" />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  )
}

export default App;