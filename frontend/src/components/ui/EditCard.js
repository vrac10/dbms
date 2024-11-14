// src/components/ui/Card.js
import React from 'react';
import './Card.css';
import Button from './Button';

const EditCard = ({ event, onViewParti, onEdit }) => {
  let Date = new String(event.Date)
  return (
    <div className="card">
      <div className="card-content">
        <h3 className="card-title">{event.Name}</h3>
        <p className="card-description">Register For this event now</p>
        <div className="card-date">
          📅 {Date.slice(0,10)}
        </div>
        <div className="card-actions">
          <Button variant="outline" onClick={onViewParti}>
            View Participants
          </Button>
          <Button onClick={onEdit}>
            Edit Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCard;