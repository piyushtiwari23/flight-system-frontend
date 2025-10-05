import React, {useState} from 'react'
import API from '../api'
import {useNavigate, Link} from 'react-router-dom'
import '../styles/auth.css'

function LoginPage(){
    const[form,setForm] = useState({email:'', password:''})
    const[loading, setLoading] = useState(false)
    const[error, setError] = useState('')
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({...form, [e.target.name] : e.target.value})
        setError('') // Clear error when user types
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try{
            const res = await API.post('/auth/login', form)
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('role', res.data.role)
            navigate(res.data.role === 'admin' ? '/admin' : '/user')
        }
        catch(err){
            console.error('Login error:', err)
            setError('Login failed. Please check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    return(
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to your account</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            name="password"
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading"></span>
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="auth-switch">
                    <span className="auth-switch-text">Don't have an account?</span>
                    <Link to="/register" className="auth-switch-link">Sign Up</Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage