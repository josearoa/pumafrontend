// Importaciones necesarias para el componente
import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'; // Componentes de gráficos de Recharts
import axios from 'axios'; // Para realizar peticiones HTTP
import '../styles/AdminDashboard.css'; // Estilos del dashboard
import { isAuthenticated, getToken, logout } from '../utils/authUtils'; // Utilidades de autenticación
import { useNavigate } from 'react-router-dom'; // Para navegación

/**
 * Componente AdminDashboard - Panel de administración para gestionar órdenes
 * Muestra estadísticas, gráficos y una tabla de órdenes pendientes de validación
 */
const AdminDashboard = () => {
  // Estados del componente
  const [orders, setOrders] = useState([]); // Lista de todas las órdenes
  const [selectedOrder, setSelectedOrder] = useState(null); // Orden seleccionada para mostrar detalles
  const navigate = useNavigate(); // Hook para navegación
  const API_BASE = process.env.REACT_APP_API_URL; // URL base de la API

  // Hook useEffect para verificar autenticación al cargar el componente
  useEffect(() => {
    // Si el usuario no está autenticado, redirigir al login
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      // Si está autenticado, cargar las órdenes
      fetchOrders();
    }
  }, [navigate]);

  /**
   * Función para obtener todas las órdenes desde la API
   * Realiza petición GET con token de autorización
   */
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/orders`, {
        headers: {
          Authorization: `Bearer ${getToken()}` // Token de autenticación en headers
        }
      });
      setOrders(res.data); // Actualizar estado con las órdenes obtenidas
    } catch (err) {
      console.error('Error al cargar órdenes');
    }
  };

  /**
   * Función para validar una orden específica
   * @param {string} id - ID de la orden a validar
   */
  const validateOrder = async (id) => {
    try {
      await axios.post(`${API_BASE}/orders/${id}/validate`, {}, {
        headers: {
          Authorization: `Bearer ${getToken()}` // Token de autenticación
        }
      });
      fetchOrders(); // Recargar órdenes después de validar
    } catch (err) {
      console.error('Error al validar la orden');
    }
  };

  // Cálculo de estadísticas para los contadores del dashboard
  const approved = orders.filter(o => o.status === 'aprobado').length; // Órdenes aprobadas
  const pending = orders.filter(o => o.status === 'pendiente').length; // Órdenes pendientes
  const error = orders.filter(o => o.status === 'error').length; // Órdenes con error

  // Datos para los gráficos de estadísticas
  const trackerData = [
    { name: 'Aprobado', value: approved },
    { name: 'Pendiente', value: pending },
    { name: 'Error', value: error }
  ];
  // Colores para el gráfico de pie (verde, amarillo, rojo)
  const COLORS = ['#28a745', '#ffc107', '#dc3545'];

  /**
   * Función para obtener la clase CSS según el estado de la orden
   * @param {string} status - Estado de la orden
   * @returns {string} Clase CSS correspondiente
   */
  const getStatusClass = (status) => `status ${status}`;

  /**
   * Función para descargar un archivo de orden específica
   * @param {string} orderId - ID de la orden
   * @param {string} filename - Nombre del archivo a descargar
   */
  const downloadFile = async (orderId, filename) => {
    try {
      // Solicitar archivo como blob
      const res = await axios.get(`${API_BASE}/orders/${orderId}/download`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        },
        responseType: 'blob' // Respuesta como blob para archivos
      });

      // Crear URL temporal para el blob y descargar automáticamente
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click(); // Simular click para iniciar descarga
      link.remove(); // Limpiar el elemento temporal
    } catch (err) {
      console.error('Error al descargar archivo');
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header del dashboard con logo y navegación */}
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

      {/* Sección de resumen con contadores de órdenes */}
      <section className="summary">
        <div className="card"><h3>Total Orders</h3><p>{orders.length}</p></div>
        <div className="card"><h3>Approved</h3><p>{approved}</p></div>
        <div className="card"><h3>Pending</h3><p>{pending}</p></div>
        <div className="card"><h3>Errors</h3><p>{error}</p></div>
      </section>

      {/* Sección de gráficos para visualización de estadísticas */}
      <section className="charts-section">
        {/* Gráfico de barras para mostrar órdenes por estado */}
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
        {/* Gráfico de pie para distribución porcentual por estado */}
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
                {/* Asignar colores específicos a cada sección del pie */}
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

      {/* Tabla de órdenes para gestión y validación */}
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
            {/* Mapear todas las órdenes para mostrar en la tabla */}
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id.slice(0, 8)}</td> {/* Mostrar solo los primeros 8 caracteres del ID */}
                <td>{order.client}</td>
                <td>{order.filename}</td>
                <td>{new Date(order.uploadedAt).toLocaleDateString()}</td>
                <td><span className={getStatusClass(order.status)}>{order.status}</span></td>
                <td>
                  {/* Mostrar botón de validación solo para órdenes pendientes */}
                  {order.status === 'pendiente' ? (
                    <button onClick={() => validateOrder(order._id)}>Validate</button>
                  ) : (
                    // Para órdenes validadas, mostrar botones de ver y descargar
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

      {/* Modal para mostrar detalles de una orden seleccionada */}
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
