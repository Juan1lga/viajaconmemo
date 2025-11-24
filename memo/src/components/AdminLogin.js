import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import { jwtDecode } from "jwt-decode";

const AdminLogin = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password }, { headers: { "Content-Type": "application/json" } });
      const token = res.data.token;
      const decoded = jwtDecode(token);
      const isAdmin = (decoded?.user?.isAdmin === true) || (decoded?.isAdmin === true);
      if (!isAdmin) {
        setError("No tienes permisos de administrador");
        return;
      }
      setToken(token);
      localStorage.setItem("token", token);
      navigate("/admin");
    } catch (err) {
      setError(err?.response?.data?.msg || "Credenciales inválidas");
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