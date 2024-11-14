// src/components/ui/RegistrationModal.js
import React, { useState } from 'react';
import './Modal.css';
import Input from './Input';
import Button from './Button';

const RegistrationModal = ({ event, onClose, onRegister }) => {

  const id = new String(event.EventID)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNo: '',
    dob: '2008-11-26',
    festId : '1',
    eventId: id
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData);
    onClose()
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Register for {event.Name}</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            type="date"
            placeholder="Date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            required
          />
          <Input
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
            required
          />

          <div className="modal-actions">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Register</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;
