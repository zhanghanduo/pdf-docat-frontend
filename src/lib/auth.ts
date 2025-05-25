import { authApi } from './api';

export function getCurrentUser(): any {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      localStorage.removeItem('user');
      return null;
    }
  }
  return null;
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Basic token validation - check if it's expired
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    return payload.exp > now;
  } catch (error) {
    // If token parsing fails, consider it invalid
    console.error('Invalid token format:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return false;
  }
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'admin';
}

export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.reload(); // Force page reload to reset state
}

export function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

// Verify the current user by making an API call
export async function verifyCurrentUser(): Promise<any> {
  try {
    const user = await authApi.getCurrentUser();
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    // If verification fails, clear stored data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw error;
  }
} 