import React, { useState } from 'react';
import { isAuthenticated, getCurrentUser } from '../lib/crypto';
import LoginForm from './LoginForm';

interface AuthCheckProps {
  children: React.ReactNode;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
  const [user, setUser] = useState(getCurrentUser());

  if (!isAuthenticated() || !user) {
    return (
      <LoginForm 
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
        }} 
      />
    );
  }

  return <>{children}</>;
};

export default AuthCheck; 