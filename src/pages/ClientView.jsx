// Importaciones necesarias para el componente
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Para realizar peticiones HTTP
import '../styles/ClientView.css'; // Estilos específicos del cliente
import { useNavigate } from 'react-router-dom'; // Para navegación entre páginas
import { isAuthenticated, getToken, logout } from '../utils/authUtils'; // Utilidades de autenticación
import { jwtDecode } from 'jwt-decode'; // Para decodificar tokens JWT

/**
 * Componente ClientView - Vista principal para clientes
 * Permite subir archivos de órdenes y ver el historial de órdenes
 */
const ClientView = () => {
  // Estados del componente
  const [file, setFile] = useState(null); // Archivo seleccionado para subir
  const [orders, setOrders] = useState([]); // Lista de órdenes del cliente
  const [selectedOrder, setSelectedOrder] = useState(null); // Orden seleccionada para ver detalles
  const [nombreUsuario, setNombreUsuario] = useState(''); // Nombre del usuario logueado
  const [company, setCompany] = useState(''); // Nombre de la empresa del usuario
  const [empresa, setEmpresa] = useState(''); // Versión normalizada del nombre de empresa
  const navigate = useNavigate(); // Hook para navegación
  const API_BASE = process.env.REACT_APP_API_URL; // URL base de la API

  // Hook useEffect para verificar autenticación y cargar datos iniciales
  useEffect(() => {
    // Si el usuario no está autenticado, redirigir al login
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      // Si está autenticado, decodificar token y cargar órdenes
      decodeToken();
      fetchOrders();
    }
  }, [navigate]);

  /**
   * Función para decodificar el token JWT y extraer información del usuario
   * Obtiene el nombre de usuario y empresa desde el token
   */
  const decodeToken = () => {
    try {
      const token = getToken();
      const decoded = jwtDecode(token);
      setNombreUsuario(decoded.name || decoded.username); // Usar name o username como fallback
      setCompany(decoded.company); // Nombre completo de la empresa
      setEmpresa(decoded.company?.toLowerCase() || 'empresa'); // Versión en minúsculas para logos
    } catch (err) {
      console.error('Error al decodificar token:', err);
    }
  };

  /**
   * Función para obtener las órdenes del cliente desde la API
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
   * Función para manejar la subida de archivos
   * @param {Event} e - Evento del formulario
   */
  const handleUpload = async (e) => {
    e.preventDefault(); // Prevenir comportamiento por defecto del formulario
    if (!file) return; // No hacer nada si no hay archivo seleccionado

    // Crear FormData para enviar el archivo
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Enviar archivo al servidor
      await axios.post(`${API_BASE}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}` // Token de autenticación
        }
      });
      fetchOrders(); // Recargar órdenes después de subir archivo exitosamente
    } catch (err) {
      console.error('Error al subir archivo');
    }
  };

  /**
   * Función para normalizar nombres de empresa
   * Convierte a minúsculas y elimina espacios y caracteres especiales
   * @param {string} nombre - Nombre de la empresa
   * @returns {string} Nombre normalizado
   */
  const normalizarEmpresa = (nombre) => {
    return nombre.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  };

  return (
    <div className="client-container">
      {/* Header del cliente con logo, nombre de empresa y saludo personalizado */}
      <header className="client-header improved">
        <div className="left">
          {/* Logo dinámico basado en el nombre de la empresa normalizado */}
          <img src={`/assets/logos/${normalizarEmpresa(empresa)}.png`} alt={`${empresa} logo`} className="client-logo" />
          <span className="client-name">{company}</span>
        </div>

        <div className="center">
          {/* Saludo personalizado con el nombre del usuario */}
          <span className="welcome-text">Bienvenid@ {nombreUsuario}</span>
        </div>

        <div className="right" onClick={() => { logout(); navigate('/login'); }}>
          {/* Botón de logout que limpia sesión y redirige */}
          Logout
        </div>
      </header>

      {/* Sección para subir nuevos archivos de órdenes */}
      <section className="upload-section">
        <h2>Order Upload</h2>
        <form onSubmit={handleUpload}>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])} // Actualizar archivo seleccionado
            accept=".csv, .xlsx, .xls, .pdf" // Restricción de tipos de archivo
          />
          <button type="submit">Upload</button>
        </form>
        <p>Supported formats: Excel, CSV, PDF</p>
      </section>

      {/* Sección del historial de órdenes */}
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
            {/* Mapear todas las órdenes para mostrar en la tabla */}
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.client}</td>
                <td>{new Date(order.uploadedAt).toISOString().split('T')[0]}</td> {/* Formatear fecha como YYYY-MM-DD */}
                <td>
                  {/* Span con clase dinámica para estilizar según el estado */}
                  <span className={`status ${order.status}`}>{order.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Modal para mostrar detalles de una orden (actualmente no se usa) */}
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

