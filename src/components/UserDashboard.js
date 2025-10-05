import React, {useState, useEffect} from 'react'
import API from '../api'
import {useNavigate} from 'react-router-dom'
import '../styles/dashboard.css'

function UserDashboard({ onLogout }){
    const[flights,setFlights] = useState([])
    const navigate = useNavigate();

    const fetchFlights = async () =>{
        try {
            const res = await API.get('/flights')
            setFlights(res.data)
        } catch (error) {
            console.error('Failed to fetch flights:', error)
        }
    }

    useEffect( ()=>{
        fetchFlights()
    }, [])

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    return(
        <div className="user-dashboard">
            <div className="dashboard-header">
                <h2>Flight Booking Dashboard</h2>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <div className="flights-section">
                <h3>Available Flights</h3>
                <div className="flights-grid">
                    {flights.map( flight => (
                        <div key={flight._id} className="flight-card">
                            <div className="flight-logo">
                                <img
                                    src={`http://localhost:1221/uploads/${flight.logo}`}
                                    alt="airline logo"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA0OEM0NC40MTgzIDQ4IDQ4IDQ0LjQxODMgNDggNDBDNDggMzUuNTgxNyA0NC40MTgzIDMyIDQwIDMyQzM1LjU4MTcgMzIgMzIgMzUuNTgxNyAzMiA0MEMzMiA0NC40MTgzIDM1LjU4MTcgNDggNDAgNDhaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik00MCA1NkMzNS41ODE3IDU2IDMyIDUyLjQxODMgMzIgNDhDMzIgNDMuNTgxNyAzNS41ODE3IDQwIDQwIDQwQzQ0LjQxODMgNDAgNDggNDMuNTgxNyA0OCA0OEM0OCA1Mi40MTgzIDQ0LjQxODMgNTYgNDAgNTZaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
                                    }}
                                />
                            </div>
                            <div className="flight-info">
                                <h4>{flight.flightNumber}</h4>
                                <p className="route">{flight.departure} → {flight.arrival}</p>
                                <p className="time">Departure: {flight.time}</p>
                            </div>
                            <button className="book-btn">Book Flight</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default UserDashboard;