// routes/auth.js
import express from "express";
import { createPool, getPool } from "../db.js";  

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        createPool(username, password);  
        return res.status(200).json({ message: "Logged in successfully" });
    } catch (error) {
        return res.status(400).json({ error: "Failed to log in" + error });
    }
});

router.post('/register', async (req, res) => {
    const { username, password, event_name, event_id } = req.body;
    const pool = getPool(); 

    if (pool == null) {
        return res.status(400).send({ err: 'Root not authenticated' });
    }

    const checkUserQuery = `SELECT USER();`;
    const connection = await pool.getConnection();

    try {
        
        const [result] = await connection.query(checkUserQuery);
        console.log(result);
        if (result[0]['USER()'] !== 'root@localhost') {
            connection.release();  // Release connection if not authorized
            return res.status(400).send({ err: 'Not authorized' });
        }
    } catch (err) {
        return res.status(400).send({ err: 'Could not authenticate' });
    }

    try {
        // Create the user and views as you did before
        const createUserQuery = `CREATE USER '${username}'@'localhost' IDENTIFIED BY '${password}';`;
        await connection.query(createUserQuery);

        const viewCreationQuery = `
            CREATE OR REPLACE VIEW event_manager_${username}_view AS 
            SELECT * FROM Event WHERE Name = '${event_name}';
        `;
        await connection.query(viewCreationQuery);

        const grantAccessQuery = `
            GRANT SELECT, UPDATE, INSERT, DELETE ON event_manager_${username}_view TO '${username}'@'localhost';
        `;
        await connection.query(grantAccessQuery);

        const createTeamViewQuery = `
            CREATE OR REPLACE VIEW team_manager_${username}_view AS 
            SELECT * FROM Team WHERE EventID = ${event_id};
        `;
        await connection.query(createTeamViewQuery);

        const grantTeamPermissionsQuery = `
            GRANT SELECT, UPDATE, INSERT, DELETE ON team_manager_${username}_view TO '${username}'@'localhost';
        `;
        await connection.query(grantTeamPermissionsQuery);

        const createMemberViewQuery = `
            CREATE OR REPLACE VIEW member_manager_${username}_view AS 
            SELECT * FROM Member WHERE EventID = ${event_id};
        `;
        await connection.query(createMemberViewQuery);

        const grantMemberPermissionsQuery = `
            GRANT SELECT, UPDATE, INSERT, DELETE ON member_manager_${username}_view TO '${username}'@'localhost';
        `;
        await connection.query(grantMemberPermissionsQuery);

        const createParticipantViewQuery = `CREATE OR REPLACE VIEW participant_manager_${username}_view AS 
            SELECT * FROM Participant WHERE EventID = ${event_id};`

        await connection.query(createParticipantViewQuery);

        const grantParticipantPermissionsQuery = `GRANT SELECT, UPDATE, INSERT, DELETE ON participant_manager_${username}_view TO '${username}'@'localhost';`

        await connection.query(grantParticipantPermissionsQuery)


        return res.status(200).send({ message: "User created successfully" });

    } catch (err) {
        return res.status(400).send({ err: err });
    }
});

export default router;

