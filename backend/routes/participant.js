import express from 'express';
import { createPool,getPool } from '../db.js';

const router = express.Router();

router.post('/addParticipant', async (req,res) => {
    const { name, dob, contactNo, eventId, festId } = req.body;
    
    const newPool = createPool('register','reg1234');

    try {
        const connection = await newPool.getConnection();

        const [rows] = await connection.query('SELECT P_id FROM Participant ORDER BY P_id DESC LIMIT 1');

        let newP_id;
        if (rows.length > 0) {
            const lastP_id = rows[0].P_id;
            newP_id = lastP_id + 1; 
        } else {
            newP_id = 1;
        }

        const insertQuery = `
            INSERT INTO Participant (P_id, Name, DOB, ContactNo, EventID, FestID) 
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        await connection.query(insertQuery, [newP_id, name, dob, contactNo, eventId, festId]);

        return res.status(200).send({ message: 'Participant added successfully', P_id: newP_id });
        
    } catch (err) {
        return res.status(500).send({ error: 'Error adding participant', details: err.message });
    }
    // } finally {
    //     if (connection) connection.release(); 
    // }
})

export default  router;