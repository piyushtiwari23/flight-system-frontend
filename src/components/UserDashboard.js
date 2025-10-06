import React, {useState, useEffect} from 'react'
import API from '../api'
import {useNavigate} from 'react-router-dom'
import '../styles/dashboard.css'

// Logger utility for consistent logging
const logger = {
    info: (message, data = {}) => {
        console.log(`[UserDashboard][INFO] ${message}`, data);
    },
    error: (message, error) => {
        console.error(`[UserDashboard][ERROR] ${message}`, error);
    },
    debug: (message, data = {}) => {
        console.debug(`[UserDashboard][DEBUG] ${message}`, data);
    }
};

function UserDashboard({ onLogout }){
    const [flights, setFlights] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedFlight, setSelectedFlight] = useState(null)
    const [bookingLoading, setBookingLoading] = useState(false)
    const [bookingError, setBookingError] = useState(null)
    const navigate = useNavigate();

    const fetchFlights = async () => {
        try {
            logger.info('Fetching flights from API');
            setLoading(true);
            const res = await API.get('/flights');
            
            logger.debug('API Response received', { 
                status: res.status,
                flightCount: res.data.length 
            });

            if (res.data.length === 0) {
                logger.info('No flights available');
                setError('No flights are currently available');
            } else {
                logger.info(`Successfully fetched ${res.data.length} flights`);
                logger.debug('Flight data', { 
                    flights: res.data.map(f => ({
                        id: f._id,
                        number: f.flightNumber,
                        from: f.departure,
                        to: f.arrival
                    }))
                });
            }

            setFlights(res.data)
        } catch (error) {
            logger.error('Failed to fetch flights', error);
            setError('Failed to load flights. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    useEffect( ()=>{
        fetchFlights()
    }, [])

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    const handleBookFlight = async (flight) => {
        try {
            setSelectedFlight(flight);
            setBookingLoading(true);
            setBookingError(null);
            
            logger.info('Initiating flight booking', { flightId: flight._id });

            // Get user details from local storage or a form
            const userDetails = {
                name: localStorage.getItem('userName') || 'User',
                email: localStorage.getItem('userEmail') || 'user@example.com',
                phone: ''
            };

            const response = await API.post('/bookings', {
                flightId: flight._id,
                passengerDetails: userDetails
            });

            logger.info('Flight booked successfully', { 
                bookingId: response.data._id,
                flightId: flight._id
            });

            // Show success message
            alert('Flight booked successfully! Check your email for details.');
            
            // Optionally navigate to bookings page
            // navigate('/bookings');
        } catch (error) {
            logger.error('Error booking flight', error);
            setBookingError(error.response?.data?.message || 'Failed to book flight. Please try again.');
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div className="user-dashboard">
            <div className="dashboard-header">
                <h2>Flight Booking Dashboard</h2>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <div className="flights-section">
                <h3>Available Flights</h3>
                
                {loading ? (
                    <div className="loading-state">Loading flights...</div>
                ) : error ? (
                    <div className="error-state">{error}</div>
                ) : flights.length === 0 ? (
                    <div className="empty-state">No flights are currently available</div>
                ) : (
                    <div className="flights-grid">
                        {flights.map(flight => {
                            logger.debug('Rendering flight card', { 
                                id: flight._id, 
                                number: flight.flightNumber 
                            });
                            
                            return (
                                <div key={flight._id} className="flight-card">
                                    <div className="flight-logo">
                                        <img
                                            src={`http://localhost:1221/uploads/${flight.logo}`}
                                            alt={`${flight.flightNumber} logo`}
                                            onError={(e) => {
                                                logger.debug('Flight logo failed to load', { 
                                                    flightId: flight._id,
                                                    logoPath: flight.logo 
                                                });
                                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA0OEM0NC40MTgzIDQ4IDQ4IDQ0LjQxODMgNDggNDBDNDggMzUuNTgxNyA0NC40MTgzIDMyIDQwIDMyQzM1LjU4MTcgMzIgMzIgMzUuNTgxNyAzMiA0MEMzMiA0NC40MTgzIDM1LjU4MTcgNDggNDAgNDhaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik00MCA1NkMzNS41ODE3IDU2IDMyIDUyLjQxODMgMzIgNDhDMzIgNDMuNTgxNyAzNS41ODE3IDQwIDQwIDQwQzQ0LjQxODMgNDAgNDggNDMuNTgxNyA0OCA0OEM0OCA1Mi40MTgzIDQ0LjQxODMgNTYgNDAgNTZaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
                                            }}
                                        />
                                    </div>
                                    <div className="flight-info">
                                        <h4>{flight.flightNumber}</h4>
                                        <p><strong>From:</strong> {flight.departure}</p>
                                        <p><strong>To:</strong> {flight.arrival}</p>
                                        <p><strong>Time:</strong> {new Date(flight.time).toLocaleString()}</p>
                                        <button 
                                            className="book-btn"
                                            onClick={() => handleBookFlight(flight)}
                                            disabled={bookingLoading}
                                        >
                                            {bookingLoading && selectedFlight?._id === flight._id 
                                                ? 'Booking...' 
                                                : 'Book Flight'
                                            }
                                        </button>
                                        {bookingError && selectedFlight?._id === flight._id && (
                                            <p className="error-message">{bookingError}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserDashboard;