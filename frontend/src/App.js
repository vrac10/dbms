// src/App.js
import React, { useEffect, useState } from 'react';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import RegistrationModal from './components/ui/RegistrationModal'; // Ensure you have this component
import LoginModal from './components/ui/LoginModal'; 
import CreateEventModal from './components/ui/CreateEventModal'; // Ensure you have this component
import EventDetails from './components/ui/EditEventModal';
import './App.css';
import { LogIn, PlusCircle } from 'lucide-react'; // Ensure lucide-react is installed
import EditCard from './components/ui/EditCard';
import ParticipantsModal from './components/ui/ParticipantsModal';
import EditEventModal from './components/ui/EditEventModal';



const App = () => {
  const [events, setEvents] = useState([{Date: "2024-11-01T18:30:00.000Z",EventID: 1,FestID: 1,Name: "Hackathon"}]);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showSelectedEvent, setShowSelectedEvent] = useState(false); 
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [selectedEventID, setSelectedEventID] = useState(null);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null)

  const handleEditEvent = async (event) => {
    setEditEvent(event);
    setShowEditEventModal(true);
  };

  const handleViewParticipants = (eventID) => {
    setSelectedEventID(eventID);
    setShowParticipantsModal(true);
  };

  

  const handleLogin = async (credentials) => {
      const response = await fetch('http://localhost:8000/auth/login',{ 
        method : "POST",
        headers : {
            "Content-Type": "application/json",
        },
        body : JSON.stringify(credentials)})

        if(response && response.ok){
          const final = await response.json()
          
          if(credentials["username"] === 'register'){
            alert("logged out successfully")
            setUser(null)
          }
          else{
            alert('LoggedIn successfully!')
            setUser(credentials['username']);
          }
          
        
        }
       
  };

  const handleRegister = async (formData) => {
    const response = await fetch('http://localhost:8000/participant/addParticipant',{ 
      method : "POST",
      headers : {
          "Content-Type": "application/json",
      },
      body : JSON.stringify(formData)})
    if(response && response.ok){
      const final = await response.json()
      alert('Registered successfully!')
    }else{
      const error = await response.json()
      console.log(error)
    }
   
  };

  const handleOnDelete = async (event) => {
    try {
      const response = await fetch('http://localhost:8000/event/events/deleteEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ EventID: event.EventID }), // Wrap in an object
        mode: 'cors',
      });
  
      if (response.ok) {
        alert("Event Deleted Successfully!");
      } else {
        const errorData = await response.json();
        console.error({ error: errorData.error });
      }
    } catch (error) {
      console.error("Request failed", error);
    }
  };
  
  const fetchEvents = async () => {
    const response = await fetch(`http://localhost:8000/event/events/${user}`);
    const final = await response.json();
    if(response && response.ok){
      setEvents(final)
    }
    else{
      console.log(final)
    }
    
  }

  const handleSaveEvent = async (eventData) => {

      const response = await fetch(`http://localhost:8000/event/events/updateEvent/${eventData.EventID}`, {
        method : "PUT",
        headers : {
            "Content-Type": "application/json",
        },
        body : JSON.stringify({newName : eventData.name, date : eventData.date})});
        if (response.ok) {
          alert("Event Updated Successfully!");
        } else {
          const errorData = await response.json();
          console.log(errorData);
        }
  }

  useEffect(() => {
    fetchEvents();
  },[user,events])
  
  const handleCreateEvent = async (eventData) => {
    
    const response = await fetch(`http://localhost:8000/event/events/addevent`,{ 
      method : "POST",
      headers : {
          "Content-Type": "application/json",
      },
      body : JSON.stringify({name : eventData.name, date : eventData.date})})
      if(response && response.ok){
        const final = await response.json()
       
        const newUser = await fetch('http://localhost:8000/auth/register',{ 
          method : "POST",
          headers : {
              "Content-Type": "application/json",
          },
          body : JSON.stringify({username: eventData.managerUsername, password: eventData.managerPassword, event_name : eventData.name, event_id : final.eventID})})

          if(newUser && newUser.ok){
            alert("Event created successfully")
          }
          else{
            console.log(await newUser.json())
          }

      }else{
        console.log(await response.json())
      }

  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="app-title">University Fest 2024</h1>
          {!user ? (
            <Button
              onClick={() => {
                setShowLoginModal(true);
              }}
            >
              <LogIn className="icon" />
              Manager Login
            </Button>
          ) : (
            <div className="user-info">
              <span>Welcome, {user}</span>
              <Button variant="outline" onClick={() => {
                handleLogin({username : 'register',password : 'reg1234'})
                setUser(null)
                }}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {user === 'root' && (
          <div className="admin-controls">
            <Button onClick={() => setShowCreateEventModal(true)}>
              <PlusCircle className="icon" />
              Create New Event
            </Button>
          </div>
        )}

        <div className="events-grid">
  {events.map((event) => (
    user ? (
      <EditCard
        key={event.EventID}
        event={event}
        onViewParti={() => handleViewParticipants(event.EventID)}
        onEdit={() => {
          handleEditEvent(event)
        }}
      />
    ) : (
      <Card
        key={event.EventID}
        event={event}
        onViewDetails={() => {
          setSelectedEvent(event);
          setShowSelectedEvent(true);
        }}
        onRegister={() => {
          setSelectedEvent(event);
          setShowRegistrationModal(true);
        }}
      />
    )
  ))}
</div>

      </main>

      {/* Modals */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}
      {showRegistrationModal && (
        <RegistrationModal
          event={selectedEvent}
          onClose={() => setShowRegistrationModal(false)}
          onRegister={handleRegister}
        />
      )}
      {showCreateEventModal && (
        <CreateEventModal
          onClose={() => setShowCreateEventModal(false)}
          onCreateEvent={handleCreateEvent}
        />
      )}
      {showSelectedEvent && <EventDetails event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      {showParticipantsModal && (
        <ParticipantsModal
          eventID={selectedEventID}
          onClose={() => setShowParticipantsModal(false)}
          user= {user}
        />
      )}
      {showEditEventModal && (
        <EditEventModal
          event={editEvent}
          onClose={() => setShowEditEventModal(false)}
          onSave={handleSaveEvent}
          onDelete={() => {handleOnDelete(editEvent)}}
        />
      )}
    </div>
  );
};

export default App;
