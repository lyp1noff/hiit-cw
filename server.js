import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import * as db from './database.js';
import config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

const serverIP = '0.0.0.0';
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
    const { code } = req.query;

    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const tokenParams = new URLSearchParams({
      code,
      client_id: googleClientId,
      client_secret: googleClientSecret,
      redirect_uri: googleRedirectUrl,
      grant_type: 'authorization_code',
    });

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams,
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange authorization code for access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const userInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
    const userInfoResponse = await fetch(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user information from Google');
    }

    const userData = await userInfoResponse.json();

    // Handle user data
    console.log(userData);
    // const userID = userData.sub;

    res.send(`Authentication successful. You will be redirected shortly.
            <script>setTimeout(function() { window.location.href = "/app/settings"; }, 2000);</script>`,
    );
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred during authentication');
  }
});

app.get('/api/exercise/:id', async (req, res) => {
  const id = req.params.id;
  const data = await db.getExercise(id);
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'SQL error' });
  }
});

app.get('/api/exercises', async (req, res) => {
  const data = await db.getExercises();
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'SQL error' });
  }
});

app.get('/api/workout/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  const data = await db.getWorkout(uuid);
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'SQL error' });
  }
});

app.delete('/api/workout/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  const data = await db.deleteWorkout(uuid);
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'SQL error' });
  }
});


app.get('/api/workouts', async (req, res) => {
  const data = await db.getWorkouts();
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'SQL error' });
  }
});

app.post('/api/workouts', async (req, res) => {
  const { name, data } = req.body;
  await db.addWorkout(name, data);
  res.status(200).json({ status: 200 });
});

app.get('/api/users', async (req, res) => {
  const data = await db.getUsers();
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'SQL error' });
  }
});

app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }
  await db.addUser(name, email);
  res.status(200).json({ status: 200 });
});

app.use(express.static(join(__dirname, 'public')));
app.get('/app/*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(serverPort, serverIP, () => console.log(`App is listening on http://${serverIP}:${serverPort}`));
