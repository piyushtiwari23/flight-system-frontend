import React, {useState,useEffect} from 'react'
import API from '../api'
import {useNavigate} from 'react-router-dom'
import '../styles/dashboard.css'

function AdminPanel({ onLogout }){

    const[form,setForm] = useState({flightNumber:'', departure:'', arrival:'', time:''})
    const[logo,setLogo] = useState(null)
    const[flights,setFlights] = useState([])
    const[editing, setEditing] = useState(null)
    const[logoPreview, setLogoPreview] = useState('')

    const navigate = useNavigate();

    const fetchFlights = async () =>{
        const res = await API.get('/flights')
        setFlights(res.data)
    }

    useEffect( ()=>{
        fetchFlights()
    }, [])

    const handleChange = (e) => setForm({...form, [e.target.name] : e.target.value})

    const handleUpload = async () =>{
        const data = new FormData()
        Object.entries(form).forEach(([key,value]) => data.append(key,value))
        data.append('logo',logo)

        await API.post('/flights',data)
        fetchFlights()
    }

    const handleUpdate = async() =>{
        const data = new FormData()
        Object.entries(form).forEach(([key,value]) => data.append(key,value))
        data.append('logo',logo)

        await API.put(`/flights/${editing}`, data)
        setEditing(null)
        setLogo(null)
        setForm({flightNumber:'', departure:'', arrival:'', time:''})
        fetchFlights()
    }

    const handleEdit = (flight) =>{
        setForm({
            flightNumber :flight.flightNumber,
            departure: flight.departure,
            arrival: flight.arrival,
            time: flight.time
        })
        setEditing(flight._id)
        setLogoPreview(`http://localhost:1221/uploads/${flight.logo}`)
    }

    const handleDelete = async (id) =>{
        await API.delete(`/flights/${id}`)
        fetchFlights()
    }

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    return(
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2 className="dashboard-title">Admin Panel</h2>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <div className="admin-panel">
                <h3 className="section-title">Add/Edit Flight</h3>
                <div className="admin-form">
                    <input name="flightNumber" className="admin-input" placeholder="Flight Number" value={form.flightNumber} onChange={handleChange} />
                    <input name="departure" className="admin-input" placeholder="Departure" value={form.departure} onChange={handleChange} />
                    <input name="arrival" className="admin-input" placeholder="Arrival" value={form.arrival} onChange={handleChange} />
                    <input name="time" className="admin-input" placeholder="Time" value={form.time} onChange={handleChange} />
                    <div className="file-input">
                        <input type="file" onChange={(e) => setLogo(e.target.files[0])}/>
                        <p>Upload airline logo</p>
                    </div>
                </div>

                <div className="admin-actions">
                    {editing ? (
                        <>
                            {logoPreview && <img src={logoPreview} width="50" alt="preview" />}
                            <button className="admin-button secondary" onClick={handleUpdate}>Update Flight</button>
                            <button className="admin-button" onClick={() => setEditing(null)}>Cancel</button>
                        </>
                    ): (
                        <button className="admin-button" onClick={handleUpload}>Add Flight</button>
                    )}
                </div>
            </div>

            <div className="flights-section">

                <h3 className="section-title">Flight Management</h3>
                <div className="flights-list">
                    {flights.map( flight => (
                        <div key={flight._id} className="flight-item">
                            <div className="flight-logo">
                                <img
                                    src={`http://localhost:1221/uploads/${flight.logo}`}
                                    width="50"
                                    alt="logo"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSAzMEMyNy43NjE0IDMwIDMwIDI3Ljc2MTQgMzAgMjVDMzAgMjIuMjM4NiAyNy43NjE0IDIwIDI1IDIwQzIyLjIzODYgMjAgMjAgMjIuMjM4NiAyMCAyNUMyMCAyNy43NjE0IDIyLjIzODYgMzAgMjUgMzBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yNSAzNUMyMi4yMzg2IDM1IDIwIDMyLjc2MTQgMjAgMzBDMjAgMjcuMjM4NiAyMi4yMzg2IDI1IDI1IDI1QzI3Ljc2MTQgMjUgMzAgMjcuMjM4NiAzMCAzMEMzMCAzMi43NjE0IDI3Ljc2MTQgMzUgMjUgMzVaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
                                    }}
                                />
                            </div>
                            <div className="flight-info">
                                <div className="flight-number">{flight.flightNumber}</div>
                                <div className="flight-route">{flight.departure} → {flight.arrival}</div>
                                <div className="flight-time">Departure: {flight.time}</div>
                            </div>
                            <div className="flight-actions">
                                <button className="admin-button secondary" onClick={ () => handleEdit(flight)}>Edit</button>
                                <button className="admin-button danger" onClick={ () => handleDelete(flight._id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AdminPanel;