import express from "express";
import {getPool,createPool} from "../db.js";

const router = express.Router();


// 1. Fetch all events
router.get('/events/:user', async (req, res) => {
    let pool = getPool();
    if(pool == null){
        pool = createPool('register','reg1234');
    }

    try {
        let query;
        let loggedInUser = req.params.user;
        if(loggedInUser === 'null'){
            loggedInUser = 'register'
        }

        if (loggedInUser === 'root' || loggedInUser === 'register') {
            // root or register user: query all events
            query = "SELECT * FROM Event;";
        } else {
            // Other users: query a restricted view
            query = `SELECT * FROM event_manager_${loggedInUser}_view;`; // Use the view specific to the logged-in user
        }
        const [rows] = await pool.query(query);

        return res.status(200).json(rows);
    } catch (err) {
        return res.status(500).json({ error: err});
    }
});

// 2. Edit event name by EventID
router.put('/events/updateEvent/:id', async (req, res) => {
    const { id } = req.params;
    const { newName, date } = req.body;
    console.log(newName+' '+date)
    let pool = getPool();
    try {
        const [result] = await pool.query(
            "UPDATE Event SET Name = ?, Date = ? WHERE EventID = ?", [newName,date, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json(result);
        }
        res.status(200).json({ message: 'Event name updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update event name' });
    }
});

// 3. Create a team for a specific event
router.post('/events/:id/teams', async (req, res) => {
    const { id } = req.params;
    const { teamName, teamType } = req.body;
    let pool = getPool();
    try {
        const [result] = await pool.query(
            "INSERT INTO Team (Name, Type, EventID, FestID) VALUES (?, ?, ?, (SELECT FestID FROM Event WHERE EventID = ?))", 
            [teamName, teamType, id, id]
        );
        res.status(201).json({ message: 'Team created successfully', teamID: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create team' });
    }
});

// 4. Edit members of the event
router.put('/events/:eventId/teams/:teamId/members/:memberId', async (req, res) => {
    const { eventId, teamId, memberId } = req.params;
    const { memberName, role, contactNo } = req.body;
    let pool = getPool();
    try {
        const [result] = await pool.query(
            "UPDATE Member SET Name = ?, Role = ?, ContactNo = ? WHERE M_id = ? AND T_id = ? AND EventID = ?",
            [memberName, role, contactNo, memberId, teamId, eventId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Member not found' });
        }
        res.status(200).json({ message: 'Member details updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update member details' });
    }
});

// 5. Add a member to the event team
router.post('/events/:eventId/teams/:teamId/members', async (req, res) => {
    const { eventId, teamId } = req.params;
    const { memberName, role, contactNo, dob } = req.body;
    let pool = getPool();
    try {
        const [result] = await pool.query(
            "INSERT INTO Member (Name, Role, ContactNo, DOB, T_id, EventID, FestID) VALUES (?, ?, ?, ?, ?, ?, (SELECT FestID FROM Event WHERE EventID = ?))", 
            [memberName, role, contactNo, dob, teamId, eventId, eventId]
        );
        res.status(201).json({ message: 'Member added successfully', memberID: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add member' });
    }
});

// 6. Fetch all participants of a particular event
router.get('/events/:eventId/participants/:user', async (req, res) => {
    const { eventId} = req.params;
    let pool = getPool();
    try {   

        let query;
        let loggedInUser = req.params.user;
        if(loggedInUser === 'null'){
            loggedInUser = 'register'
        }

        if (loggedInUser === 'root') {
            // root or register user: query all events
            query =  `SELECT * FROM Participant WHERE EventID = ${eventId}`;
        } else {
            // Other users: query a restricted view
            query = `SELECT * FROM participant_manager_${loggedInUser}_view`;
        }

        const [rows] = await pool.query(    
          query
        );
        return res.status(200).json(rows);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch participants' + err });
    }
});

router.post('/events/addevent', async (req, res) => {
    const { name, date } = req.body;
    let pool = getPool();
    try {

        const [rows] = await pool.query('SELECT EventID FROM Event ORDER BY EventID DESC LIMIT 1');

        let EventID;
        if (rows.length > 0) {
            const lastEventID= rows[0].EventID;
            EventID = lastEventID + 1; 
        } else {
            EventID = 1;
        }
        const [result] = await pool.query(
            "INSERT INTO Event (EventID, FestID, Name, Date) VALUES (?, ?, ?, ?)",
            [EventID, '1', name, date]
        );
        res.status(201).json({ message: 'Event created successfully', eventID: EventID });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create event' +  err});
    }
});

router.post('/events/deleteEvent', async (req, res) => {
    console.log("Received body:", req.body); // Log request body
    const { EventID } = req.body;
  
    if (!EventID) {
      return res.status(400).json({ error: 'Event ID is required' });
    }
  
    let pool = getPool();
    try {
      const [rows] = await pool.query(`CALL DeleteEvent(?)`, [EventID]);
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete event: ' + err.message });
    }
  });
  



export default router;
