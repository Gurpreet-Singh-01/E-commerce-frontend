import axios from 'axios';
import {updateUser,logout} from '../store/authSlice'

const api = axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    headers: {'Content-Type' : 'application/json'},
    withCredentials:true
})

export default api;