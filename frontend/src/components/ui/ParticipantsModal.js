// src/components/ui/ParticipantsModal.js
import React, { useEffect, useState } from 'react';
import './ParticipantsModal.css'

const ParticipantsModal = ({ eventID, onClose }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(`http://localhost:8000/event//events/${eventID}/participants`);
        const data = await response.json();
        console.log(data)
        setParticipants(data);
      } catch (error) {
        console.error('Error fetching participants:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchParticipants();
  }, [eventID]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Participants for Event ID: {eventID}</h2>
        {loading ? (
          <p>Loading...</p>
        ) : participants.length > 0 ? (
          <ul>
            {participants.map((participant) => (
              <li key={participant.P_id}>
                {participant.Name} - {participant.DOB} - {participant.ContactNo}
              </li>
            ))}
          </ul>
        ) : (
          <p>No participants registered yet.</p>
        )}
      </div>
    </div>
  );
};

export default ParticipantsModal;
