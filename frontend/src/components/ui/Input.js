// src/components/ui/Input.js
import React from 'react';
import './Input.css';

const Input = ({ placeholder, value, onChange, type = 'text', ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="input"
      {...props}
    />
  );
};

export default Input;
