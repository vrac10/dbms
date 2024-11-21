// src/components/ui/EditEventModal.js
import React, { useEffect, useState } from 'react';
import './EditEventModal.css';

const EditEventModal = ({ event, onClose, onSave, onDelete }) => {
  const dateStr = new String(event.Date)
  const [name, setName] = useState(event.Name || '');
  const [date, setDate] = useState(dateStr.slice(0,10) || '');
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchTeamMembers = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:8000/event/${event.EventID}/team-members`);
  //       const data = await response.json();
  //       setTeamMembers(data);
  //     } catch (error) {
  //       console.error('Error fetching team members:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

    // fetchTeamMembers();
  // }, [event.EventID]);

  const handleTeamMemberChange = (index, field, value) => {
    setTeamMembers((prev) => {
      const updatedMembers = [...prev];
      updatedMembers[index][field] = value;
      return updatedMembers;
    });
  };

  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, { name: '', role: '' }]);
  };

  const handleRemoveTeamMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const updatedEvent = {
      EventID : event.EventID,
      name,
      date,
      teamMembers,
    };
    onSave(updatedEvent);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Edit Event</h2>
        
        {/* Event Name and Date */}
        <div className="form-group">
          <label htmlFor="eventName">Event Name:</label>
          <input
            type="text"
            id="eventName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="eventDate">Event Date:</label>
          <input
            type="date"
            id="eventDate"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
{/* 
        <h3>Team Members</h3>
        {loading ? (
          <p>Loading team members...</p>
        ) : (
          teamMembers.map((member, index) => (
            <div key={index} className="team-member">
              <input
                type="text"
                placeholder="Name"
                value={member.name}
                onChange={(e) =>
                  handleTeamMemberChange(index, 'name', e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Role"
                value={member.role}
                onChange={(e) =>
                  handleTeamMemberChange(index, 'role', e.target.value)
                }
              />
              <button onClick={() => handleRemoveTeamMember(index)}>Remove</button>
            </div>
          ))
        )}
        <button onClick={handleAddTeamMember}>Add Team Member</button> */}

        {/* Delete and Save Buttons */}
        <div className="modal-actions">
          <button className="delete-button" onClick={() =>{
           onDelete(event.EventID)}}>
            Delete Event
          </button>
          <button className="save-button" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;
