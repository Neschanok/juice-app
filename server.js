//Express server med API-routes
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const cookieParser = require('cookie-parser');
const path = require('path');
const { getAllEvents, insertEvent, deleteEvent } = require('./database');

const app = express();
const PORT = process.env.PORT || 6005;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

/*skal slettes: SQLite forbindelse - opret database og tabel
const db = new sqlite3.Database('calendar.db', (err) => {
    if (err) {
        console.error('Fejl ved forbindelse til SQLite', err.message);
    } else {
        console.log('Tilsluttet SQLite-database');
        db.run(`
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                start_time TEXT NOT NULL,
                end_time TEXT,
                day INTEGER NOT NULL,
                month INTEGER NOT NULL,
                year INTEGER NOT NULL,
                created_at TEXT DEFAULT (datetime('now'))
            )
        `);
    }
});
*/

// API routes
//henter alle events
app.get('/events', async (req, res) => {
    try {
        const rows = await getAllEvents();
        res.json(rows);
    } catch (err) {
        res.status(500).json({error: err.message });
    }
});

//opret et nyt event
app.post('/events', async (req, res) => {
    const { title, start_time, end_time, day, month, year } = req.body;
    try {
        const id = await insertEvent({ title, start_time, end_time, day, month, year });
        res.json({ id, message: 'Event oprettet!' });
    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }
});

//slet et event
app.delete('/events/:id', async (req, res) => {
    try {
        await deleteEvent(req.params.id);
        res.json({ message: 'Event slettet!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Server kører på port ${PORT}`));
