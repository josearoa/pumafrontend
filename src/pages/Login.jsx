// Importaciones necesarias para el componente
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegación programática
import axios from 'axios'; // Para realizar peticiones HTTP
import '../styles/Login.css'; // Estilos específicos del login

/**
 * Componente Login - Página de autenticación de usuarios
 * Permite a los usuarios ingresar con credenciales y redirige según su rol
 */
function Login() {
  // Estados del componente para el formulario de login
  const [username, setUsername] = useState(''); // Campo de usuario
  const [password, setPassword] = useState(''); // Campo de contraseña
  const [error, setError] = useState(''); // Mensaje de error para mostrar al usuario
  const navigate = useNavigate(); // Hook para navegación
  const API_BASE = process.env.REACT_APP_API_URL; // URL base de la API

  /**
   * Función para manejar el proceso de login
   * @param {Event} e - Evento del formulario
   */
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    try {
      // Realizar petición POST al endpoint de login
      const res = await axios.post(`${API_BASE}/api/login`, {
        username,
        password
      });

      // Extraer token de la respuesta
      const { token } = res.data;
      localStorage.setItem('token', token); // Guardar token en localStorage

      // Decodificar el payload del JWT para obtener información del usuario
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar base64 del payload
      console.log('Login OK. Redirigiendo a:', payload.role);

      // Redirigir según el rol del usuario
      if (payload.role === 'client') navigate('/client'); // Vista de cliente
      else if (payload.role === 'admin') navigate('/admin'); // Vista de administrador
      else navigate('/login'); // Fallback: volver al login si rol desconocido
    } catch (err) {
      // Manejar errores de autenticación
      const msg = err.response?.data?.error || 'Error al conectar con el servidor';
      setError(msg); // Mostrar mensaje de error al usuario
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Logo de Puma para branding */}
        <img
          src="/assets/logos/puma-37624.png"
          alt="Puma logo"
          className="login-logo"
        />
        {/* Título de la aplicación */}
        <h2>Login Puma OM App Chile</h2>
        
        {/* Formulario de login */}
        <form onSubmit={handleLogin}>
          {/* Campo de usuario */}
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Actualizar estado del usuario
            required // Campo obligatorio
          />
          {/* Campo de contraseña */}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Actualizar estado de la contraseña
            required // Campo obligatorio
          />
          {/* Botón de envío del formulario */}
          <button type="submit">Ingresar</button>
          {/* Mostrar mensaje de error si existe */}
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
