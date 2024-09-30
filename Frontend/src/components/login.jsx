import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BASE_API_URL } from '../Api.Config';

// const users = [
//   { username: 'admin', password: '12345' } // Example user
// ];
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = async () => {
    console.log('Logging in with', { username, password }); // Log the credentials
    try {
        const response = await axios.post(`${BASE_API_URL}/login`, { username, password });

        if (response.data.success) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('tokenExpiry', new Date().getTime() + 604800000);
            alert('Login successful');
            navigate('/dashboard');
        } else {
            alert('Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error); // Log the error
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


 

