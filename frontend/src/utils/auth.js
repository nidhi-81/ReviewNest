
import {jwtDecode} from 'jwt-decode';

export const getToken = () => localStorage.getItem('token');

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    return !!decoded.userId;
  } catch (err) {
    return false;
  }
};

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.role || null;  
  } catch {
    return null;
  }
};

// // Optional: If needed elsewhere
// export const getUserId = () => {
//   const token = getToken();
//   if (!token) return null;
//   try {
//     const decoded = jwtDecode(token);
//     return decoded.userId;
//   } catch {
//     return null;
//   }
// };

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};
