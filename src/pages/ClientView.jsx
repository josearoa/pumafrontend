import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ClientView.css';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getToken, logout } from '../utils/authUtils';
import { jwtDecode } from 'jwt-decode';

const ClientView = () => {
  const [file, setFile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [company, setCompany] = useState('');
  const [empresa, setEmpresa] = useState('');
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      decodeToken();
      fetchOrders();
    }
  }, [navigate]);

  const decodeToken = () => {
    try {
      const token = getToken();
      const decoded = jwtDecode(token);
      setNombreUsuario(decoded.name || decoded.username);
      setCompany(decoded.company);
      setEmpresa(decoded.company?.toLowerCase() || 'empresa');
    } catch (err) {
      console.error('Error al decodificar token:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/orders`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Error al cargar órdenes');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${API_BASE}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      fetchOrders();
    } catch (err) {
      console.error('Error al subir archivo');
    }
  };

  const normalizarEmpresa = (nombre) => {
    return nombre.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  };

  return (
    <div className="client-container">
      <header className="client-header improved">
        <div className="left">
          <img src={`/assets/logos/${normalizarEmpresa(empresa)}.png`} alt={`${empresa} logo`} className="client-logo" />
          <span className="client-name">{company}</span>
        </div>

        <div className="center">
          <span className="welcome-text">Bienvenid@ {nombreUsuario}</span>
        </div>

        <div className="right" onClick={() => { logout(); navigate('/login'); }}>
          Logout
        </div>
      </header>

      <section className="upload-section">
        <h2>Order Upload</h2>
        <form onSubmit={handleUpload}>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".csv, .xlsx, .xls, .pdf"
          />
          <button type="submit">Upload</button>
        </form>
        <p>Supported formats: Excel, CSV, PDF</p>
      </section>

      <section className="history-section">
        <h2>Order History</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Client</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.client}</td>
                <td>{new Date(order.uploadedAt).toISOString().split('T')[0]}</td>
                <td>
                  <span className={`status ${order.status}`}>{order.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {selectedOrder && (
        <div className="modal">
          <div className="modal-content">
            <h3>Detalle de Orden</h3>
            <p><strong>ID:</strong> {selectedOrder._id}</p>
            <p><strong>Cliente:</strong> {selectedOrder.client}</p>
            <p><strong>Archivo:</strong> {selectedOrder.filename}</p>
            <p><strong>Estado:</strong> {selectedOrder.status}</p>
            <p><strong>Fecha:</strong> {new Date(selectedOrder.uploadedAt).toLocaleDateString()}</p>
            <button onClick={() => setSelectedOrder(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientView;

