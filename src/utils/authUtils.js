/**
 * Utilidades de autenticación para la aplicación
 * Contiene funciones para manejar tokens JWT, verificar autenticación y logout
 */

/**
 * Función para obtener el token de autenticación desde localStorage
 * @returns {string|null} Token JWT almacenado o null si no existe
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Función para verificar si el usuario está autenticado
 * Valida que el token exista y no haya expirado
 * @returns {boolean} true si está autenticado, false en caso contrario
 */
export function isAuthenticated() {
  const token = getToken();
  if (!token) return false; // Si no hay token, no está autenticado

  try {
    // Decodificar el payload del JWT (parte central del token)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
    
    // Verificar si el token no ha expirado comparando con el campo 'exp'
    return payload.exp > now;
  } catch (e) {
    // Si hay error al decodificar, considerar como no autenticado
    return false;
  }
}

/**
 * Función para cerrar sesión del usuario
 * Elimina el token del localStorage y redirige al login
 */
export function logout() {
  localStorage.removeItem('token'); // Eliminar token del almacenamiento local
  window.location.href = '/login'; // Redirigir al login
}