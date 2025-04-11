import React from 'react';
import RegistrationForm from '../components/RegistrationForm';
import './AuthPage.css';

function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2 className="auth-title">Create Account</h2>
        <RegistrationForm />
      </div>
    </div>
  );
}

export default RegisterPage;