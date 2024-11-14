// src/components/ui/LoginModal.js
import React, { useState } from 'react';
import './Modal.css';
import Input from './Input';
import Button from './Button';

const LoginModal = ({ onClose, onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(credentials);
    onClose()
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Login</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <Input
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />
          <div className="modal-actions">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Login</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
