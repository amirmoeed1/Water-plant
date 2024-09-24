import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// API base URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://water-plant-five.vercel.app/' // Replace this with your live backend URL
  : 'http://localhost:5000'; // Local server for development

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { username, password });

      if (response.data.success) {
        // Store token and expiration time in localStorage
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('tokenExpiry', new Date().getTime() + 604800000); // 1 week in milliseconds
        alert('Login successful');
        navigate('/dashboard');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response from server:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error during login:', error.message);
      }
      alert('An error occurred during login');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ width: '300px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
