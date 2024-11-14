
// src/components/ui/CreateEventModal.js
import React, { useState } from 'react';
import './Modal.css';
import Input from './Input';
import Button from './Button';

const CreateEventModal = ({ onClose, onCreateEvent }) => {
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    managerUsername: '',
    managerPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateEvent(eventData);
    onClose()
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Create New Event</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <Input
            placeholder="Event Title"
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
            required
          />
          <Input
            type="date"
            placeholder="Date"
            value={eventData.date}
            onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
            required
          />
          <Input
            placeholder="Manager Username"
            value={eventData.managerUsername}
            onChange={(e) => setEventData({ ...eventData, managerUsername: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Manager Password"
            value={eventData.managerPassword}
            onChange={(e) => setEventData({ ...eventData, managerPassword: e.target.value })}
            required
          />
          <div className="modal-actions">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Event</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
