import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sqlite3 from 'sqlite3';

import config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

const serverIP = 'localhost';
const serverPort = 8080;
const googleRedirectUrl = `http://${serverIP}:${serverPort}/auth/google/callback`;
const googleClientId = config.googleClientId;
const googleClientSecret = config.googleClientSecret;

app.get('/auth/google', (req, res) => {
    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUrl}&scope=email profile&response_type=code`;
    res.redirect(redirectUrl);
});

app.get('/auth/google/callback', async (req, res) => {
    try {
        const {code} = req.query;

        const tokenUrl = 'https://oauth2.googleapis.com/token';
        const tokenParams = new URLSearchParams({
            code: code,
            client_id: googleClientId,
            client_secret: googleClientSecret,
            redirect_uri: googleRedirectUrl,
            grant_type: 'authorization_code'
        });

        const tokenResponse = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: tokenParams
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to exchange authorization code for access token');
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        const userInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
        const userInfoResponse = await fetch(userInfoUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!userInfoResponse.ok) {
            throw new Error('Failed to fetch user information from Google');
        }

        const userData = await userInfoResponse.json();

        // Handle user data
        console.log(userData);
        // const userID = userData.sub;

        res.send(`Authentication successful. You will be redirected shortly.
            <script>setTimeout(function() { window.location.href = "/settings"; }, 2000);</script>`
        );
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred during authentication');
    }
});

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

app.use(express.static(join(__dirname, 'public')));
const validRoutes = ['/', '/home', '/workouts', '/settings'];
app.get(validRoutes, (req, res) => {
    const requestedRoute = req.url;
    if (validRoutes.includes(requestedRoute)) {
        res.sendFile(join(__dirname, 'public', 'index.html'));
    }
});

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(serverPort, serverIP, () => console.log(`App is listening on http://${serverIP}:${serverPort}`));