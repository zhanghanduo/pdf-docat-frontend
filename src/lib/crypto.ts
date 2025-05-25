// Simple encryption/decryption for admin credentials
// Note: This is for demo purposes. In production, use more secure methods.

const ADMIN_CREDENTIALS_ENCRYPTED = {
  // admin_handuo@so-cat.top:Christlurker@2 (base64 encoded)
  username: 'YWRtaW5faGFuZHVvQHNvLWNhdC50b3A=',
  password: 'Q2hyaXN0bHVya2VyQDI=',
};

// Simple encryption functions for future use
// const SECRET_KEY = 'pdf-docat-admin-key-2024'; // In production, this should be in env vars

// Simple XOR encryption (for demo purposes - unused but kept for future enhancement)
// function simpleEncrypt(text: string, key: string): string {
//   let result = '';
//   for (let i = 0; i < text.length; i++) {
//     result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
//   }
//   return btoa(result);
// }

// function simpleDecrypt(encrypted: string, key: string): string {
//   const decoded = atob(encrypted);
//   let result = '';
//   for (let i = 0; i < decoded.length; i++) {
//     result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
//   }
//   return result;
// }

export function getAdminCredentials(): { username: string; password: string } {
  try {
    // For demo, we'll use base64 decode (replace with proper decryption in production)
    const username = atob(ADMIN_CREDENTIALS_ENCRYPTED.username);
    const password = atob(ADMIN_CREDENTIALS_ENCRYPTED.password);
    
    return { username, password };
  } catch (error) {
    console.error('Failed to decrypt admin credentials:', error);
    // Fallback credentials
    return { username: 'admin_handuo@so-cat.top', password: 'Christlurker@2' };
  }
}

export function validateAdminCredentials(username: string, password: string): boolean {
  const adminCreds = getAdminCredentials();
  return username === adminCreds.username && password === adminCreds.password;
}

// Mock user storage (in production, this would be handled by backend)
export const mockUsers = [
  {
    id: 1,
    email: 'admin_handuo@so-cat.top',
    name: 'Administrator',
    role: 'admin' as const,
    tier: 'premium',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    credits: { used: 0, limit: 10000, available: 10000 }
  },
  {
    id: 2,
    email: 'user1@example.com',
    name: 'John Doe',
    role: 'user' as const,
    tier: 'basic',
    is_active: true,
    created_at: '2024-01-15T10:30:00Z',
    credits: { used: 25, limit: 100, available: 75 }
  },
  {
    id: 3,
    email: 'user2@example.com',
    name: 'Jane Smith',
    role: 'user' as const,
    tier: 'premium',
    is_active: true,
    created_at: '2024-01-20T14:20:00Z',
    credits: { used: 150, limit: 500, available: 350 }
  },
];

// Mock authentication store
let currentUser: any = null;
let authToken: string | null = null;

export function mockLogin(username: string, password: string): Promise<{ token: string; user: any }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check admin credentials
      if (validateAdminCredentials(username, password)) {
        const user = mockUsers.find(u => u.email === username);
        if (user) {
          authToken = `mock-token-${Date.now()}`;
          currentUser = user;
          localStorage.setItem('token', authToken);
          localStorage.setItem('user', JSON.stringify(user));
          resolve({ token: authToken, user });
        } else {
          reject(new Error('Admin user not found'));
        }
      } else {
        // Check regular users (for demo, allow any user with password 'user123')
        const user = mockUsers.find(u => u.email === username);
        if (user && password === 'user123') {
          authToken = `mock-token-${Date.now()}`;
          currentUser = user;
          localStorage.setItem('token', authToken);
          localStorage.setItem('user', JSON.stringify(user));
          resolve({ token: authToken, user });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }
    }, 1000); // Simulate network delay
  });
}

export function mockLogout(): void {
  currentUser = null;
  authToken = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser(): any {
  if (currentUser) return currentUser;
  
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    return currentUser;
  }
  
  return null;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'admin';
} 