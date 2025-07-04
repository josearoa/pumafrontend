export function getToken() {
  return localStorage.getItem('token');
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (e) {
    return false;
  }
}

export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}