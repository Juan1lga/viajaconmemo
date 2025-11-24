import React, { useState } from 'react';
import api from '../utils/api';
import './AdminLogin.css';

const AdminLogin = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className='admin-login'>
      <form onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        {error && <p className='error'>{error}</p>}
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;