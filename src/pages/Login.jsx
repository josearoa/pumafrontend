import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE}/api/login`, {
        username,
        password
      });

      const { token } = res.data;
      localStorage.setItem('token', token);

      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Login OK. Redirigiendo a:', payload.role);

      if (payload.role === 'client') navigate('/client');
      else if (payload.role === 'admin') navigate('/admin');
      else navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al conectar con el servidor';
      setError(msg);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img
          src="/assets/logos/puma-37624.png"
          alt="Puma logo"
          className="login-logo"
        />
        <h2>Login Puma OM App Chile</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
