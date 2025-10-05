import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:1221/api'   // connectiveity with the backend part
})

API.interceptors.request.use( (req) =>{
    const token = localStorage.getItem('token')

    if(token) req.headers.Authorization = `Bearer ${token}`    // token handler
    return req
})

export default API;