const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());

let db = new sqlite3.Database('./hiit.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)");
    });
    console.log('Connected to the in-memory SQLite database.');
});

app.get('/api/users', (req, res) => {
    db.all("SELECT * FROM users", (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json(rows);
    });
});

app.post('/api/users', (req, res) => {
    const {name, email} = req.body;
    if (!name || !email) {
        res.status(400).json({error: "Name and email are required"});
        return;
    }
    db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], function (err) {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json({id: this.lastID, name, email});
    });
});

app.use(express.static(path.join(__dirname, 'public')));
const validRoutes = ['/', '/home', '/workouts', '/settings'];
app.get(validRoutes, (req, res) => {
    const requestedRoute = req.url;
    if (validRoutes.includes(requestedRoute)) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(8080, 'localhost', () => console.log('App is listening on http://localhost:8080.'));