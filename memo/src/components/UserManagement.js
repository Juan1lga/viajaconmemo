import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './AdminDashboard.css'; // Reusing some styles from AdminDashboard

const UserManagement = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '', // Added password field
    role: 'user',
  });

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error al obtener usuarios:', err?.response?.data?.msg || err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      if (editingUser) {
        // Don't send password when updating user info, password changes should be handled separately
        const { password, ...updateData } = formData;
        await api.put(`/users/${editingUser._id}`, updateData);
      } else {
        // Cuando se crea un nuevo administrador, usa el endpoint protegido del módulo de usuarios
        const { email, password } = formData;
        await api.post('/users/add-admin', { email, password });
      }
      setFormData({ username: '', email: '', password: '', role: 'user' });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Error al guardar el usuario:', err?.response?.data?.msg || err.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, email: user.email, password: '', role: user.role });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Error al eliminar el usuario:', err?.response?.data?.msg || err.message);
    }
  };

  return (
    <div className='admin-dashboard'>
      <h3>Gestionar Usuarios</h3>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='username'
          placeholder='Nombre de usuario'
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type='email'
          name='email'
          placeholder='Correo electrónico'
          value={formData.email}
          onChange={handleChange}
          required
        />
        {!editingUser && (
          <input
            type='password'
            name='password'
            placeholder='Contraseña'
            value={formData.password}
            onChange={handleChange}
            required
          />
        )}
        <select name='role' value={formData.role} onChange={handleChange}>
          <option value='user'>Usuario</option>
          <option value='admin'>Administrador</option>
        </select>
        <button type='submit'>{editingUser ? 'Actualizar Usuario' : 'Añadir Nuevo Administrador'}</button>
        {editingUser && <button onClick={() => setEditingUser(null)}>Cancelar Edición</button>}
      </form>

      <table>
        <thead>
          <tr>
            <th>Nombre de usuario</th>
            <th>Correo electrónico</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Editar</button>
                <button onClick={() => handleDelete(user._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;