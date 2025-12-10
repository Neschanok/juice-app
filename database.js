const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'calendar.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Fejl ved forbindelse til SQLite:', err.message);
    else console.log('Tilsluttet SQLite database');
    db.run(`
        CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        day INTEGER NOT NULL,
        month INTEGER NOT NULL,
        year INTEGER NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
        )
    `);
});

//hent events
function getAllEvents() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM events ORDER BY year, month, day, start_time ASC', [], (err, rows) => {
            if (err) reject (err);
            else resolve(rows);
        });
    });
}

//indsæt event
function insertEvent({ title, start_time, end_time, day, month, year }) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO events (title, start_time, end_time, day, month, year)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [title, start_time, end_time, day, month, year],
            function (err) {
                if (err) reject (err);
                else resolve(this.lastID);
            }
        );
    });
}

//slet event
function deleteEvent(id) {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM events WHERE id = ?`, [id], function (err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
}

module.exports = { getAllEvents, insertEvent, deleteEvent };