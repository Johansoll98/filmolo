import React from 'react';
import LoginForm from '../components/LoginForm';
import './AuthPage.css';

function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2 className="auth-title">Login</h2>
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;