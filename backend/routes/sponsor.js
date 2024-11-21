import express from "express";
import { getPool } from "../db.js";

const router = express.Router();

// 1. Add a new sponsor
router.post('/sponsors', async (req, res) => {
    const pool = getPool()
    const { name, amount, eventId, festId } = req.body;

    try {
        const [result] = await pool.query(
            "INSERT INTO Sponsor (Name, Amount, EventID, FestID) VALUES (?, ?, ?, ?)", 
            [name, amount, eventId, festId]
        );
        res.status(201).json({ message: 'Sponsor added successfully', sponsorID: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add sponsor' });
    }
});

// 2. Fetch all sponsor names
router.get('/sponsors', async (req, res) => {
    const pool = getPool()
    try {
        const [rows] = await pool.query(
            "SELECT SponsorID, Name FROM Sponsor"
        );
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch sponsor names' });
    }
});

// 3. Remove a sponsor by SponsorID
router.delete('/sponsors/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query(
            "DELETE FROM Sponsor WHERE SponsorID = ?", [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Sponsor not found' });
        }

        res.status(200).json({ message: 'Sponsor removed successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove sponsor' });
    }
});

export default router;
