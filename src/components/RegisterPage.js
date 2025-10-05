import React, {useState} from 'react'
import API from '../api'
import {useNavigate, Link} from 'react-router-dom'
import '../styles/auth.css'

function RegisterPage(){
    const[form,setForm] = useState({email:'', password:'', role:'user'})
    const[loading, setLoading] = useState(false)
    const[error, setError] = useState('')
    const[success, setSuccess] = useState('')
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({...form, [e.target.name] : e.target.value})
        setError('') // Clear error when user types
        setSuccess('') // Clear success message
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try{
            await API.post('/auth/register', form)
            setSuccess('Registration successful! You can now sign in.')
            setTimeout(() => {
                navigate('/')
            }, 2000)
        }
        catch(err){
            console.error('Registration error:', err)
            setError('Registration failed. Email might already be in use.')
        } finally {
            setLoading(false)
        }
    }

    return(
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join the flight booking platform</p>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form className="auth-form" onSubmit={handleRegister}>
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
                            placeholder="Create a password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Account Type</label>
                        <select
                            name="role"
                            className="form-select"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="user">Regular User</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading"></span>
                                Creating Account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="auth-switch">
                    <span className="auth-switch-text">Already have an account?</span>
                    <Link to="/" className="auth-switch-link">Sign In</Link>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage