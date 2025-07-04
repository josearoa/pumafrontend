import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import axios from 'axios';
import '../styles/AdminDashboard.css';
import { isAuthenticated, getToken, logout } from '../utils/authUtils';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      fetchOrders();
    }
  }, [navigate]);

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

  const validateOrder = async (id) => {
    try {
      await axios.post(`${API_BASE}/orders/${id}/validate`, {}, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      fetchOrders();
    } catch (err) {
      console.error('Error al validar la orden');
    }
  };

  const approved = orders.filter(o => o.status === 'aprobado').length;
  const pending = orders.filter(o => o.status === 'pendiente').length;
  const error = orders.filter(o => o.status === 'error').length;

  const trackerData = [
    { name: 'Aprobado', value: approved },
    { name: 'Pendiente', value: pending },
    { name: 'Error', value: error }
  ];
  const COLORS = ['#28a745', '#ffc107', '#dc3545'];

  const getStatusClass = (status) => `status ${status}`;

  const downloadFile = async (orderId, filename) => {
    try {
      const res = await axios.get(`${API_BASE}/orders/${orderId}/download`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error al descargar archivo');
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header improved">
        <div className="left-header">
          <img src="/assets/logos/puma-37624.png" alt="Puma Logo" className="logo-puma" />
          <span className="logo-text">Puma Chile PO Management</span>
        </div>
        <nav className="right-header">
          <a href="/admin">Dashboard</a>
          <button onClick={logout}>Cerrar sesión</button>
        </nav>
      </header>

      <section className="summary">
        <div className="card"><h3>Total Orders</h3><p>{orders.length}</p></div>
        <div className="card"><h3>Approved</h3><p>{approved}</p></div>
        <div className="card"><h3>Pending</h3><p>{pending}</p></div>
        <div className="card"><h3>Errors</h3><p>{error}</p></div>
      </section>

      <section className="charts-section">
        <div className="chart-box">
          <h3>Order Tracker</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trackerData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-box">
          <h3>Distribución por Estado</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={trackerData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {trackerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="validation-queue">
        <h2>Validation Queue</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Filename</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id.slice(0, 8)}</td>
                <td>{order.client}</td>
                <td>{order.filename}</td>
                <td>{new Date(order.uploadedAt).toLocaleDateString()}</td>
                <td><span className={getStatusClass(order.status)}>{order.status}</span></td>
                <td>
                  {order.status === 'pendiente' ? (
                    <button onClick={() => validateOrder(order._id)}>Validate</button>
                  ) : (
                    <>
                      <button onClick={() => setSelectedOrder(order)}>View</button>
                      <button onClick={() => downloadFile(order._id, order.filename)}>Descargar</button>
                    </>
                  )}
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

export default AdminDashboard;
