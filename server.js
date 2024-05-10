import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

import * as db from './database.js';
// import config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

const serverIP = '0.0.0.0'; // firefox doesn't like localhost
const serverPort = 8080;

// I mean it works, but it's not the best way to do it
//
// const googleRedirectUrl = `http://${serverIP}:${serverPort}/auth/google/callback`;
// const googleClientId = config.googleClientId;
// const googleClientSecret = config.googleClientSecret;
//
// app.get('/auth/google', (req, res) => {
//   const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUrl}&scope=email profile&response_type=code`;
//   res.redirect(redirectUrl);
// });
//
// app.get('/auth/google/callback', async (req, res) => {
//   try {
//     const { code } = req.query;
//
//     const tokenUrl = 'https://oauth2.googleapis.com/token';
//     const tokenParams = new URLSearchParams({
//       code,
//       client_id: googleClientId,
//       client_secret: googleClientSecret,
//       redirect_uri: googleRedirectUrl,
//       grant_type: 'authorization_code',
//     });
//
//     const tokenResponse = await fetch(tokenUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: tokenParams,
//     });
//
//     if (!tokenResponse.ok) {
//       throw new Error('Failed to exchange authorization code for access token');
//     }
//
//     const tokenData = await tokenResponse.json();
//     const accessToken = tokenData.access_token;
//
//     const userInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
//     const userInfoResponse = await fetch(userInfoUrl, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//
//     if (!userInfoResponse.ok) {
//       throw new Error('Failed to fetch user information from Google');
//     }
//
//     const userData = await userInfoResponse.json();
//
//     // Handle user data
//     console.log(userData);
//     // const userID = userData.sub;
//
//     res.send(`Authentication successful. You will be redirected shortly.
//             <script>setTimeout(function() { window.location.href = "/app/settings"; }, 2000);</script>`,
//     );
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('An error occurred during authentication');
//   }
// });

app.post('/api/exercise', async (req, res) => {
  const { uuid, name, description } = req.body;
  const data = await db.addExercise(uuid, name, description);
  if (data) {
    res.json({ lastID: data.lastID });
  } else {
    res.status(404).json({ error: 'SQL error' });
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

app.get('/api/exercises/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  const data = await db.getExercises(uuid);
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

// USER RELATED
app.post('/api/workout', async (req, res) => {
  const { userUUID, name, data } = req.body;
  await db.addUserWorkout(userUUID, name, data);
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'SQL error' });
  }
});

// USER RELATED
app.delete('/api/workout/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  await db.deleteUserWorkout(uuid);
  res.status(200).json({ status: 200 });
});

app.put('/api/workout/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  const { name, data } = req.body;
  const dbData = await db.editWorkout(uuid, name, data);
  if (dbData) {
    res.json(dbData);
  } else {
    res.status(404).json({ error: 'SQL error' });
  }
});

// USER RELATED
app.get('/api/workouts/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  const data = await db.getUserWorkouts(uuid);
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'SQL error' });
  }
});

app.get('/api/globalWorkouts/', async (req, res) => {
  const data = await db.getGlobalWorkouts();
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'SQL error' });
  }
});

app.get('/api/user/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  const data = await db.getUser(uuid);
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'SQL error' });
  }
});

app.post('/api/user', async (req, res) => {
  const { uuid } = req.body;
  await db.addUser(uuid);
  res.status(200).json({ status: 200 });
});

app.get('/api/uuid', (req, res) => {
  res.json({ uuid: uuidv4() });
});

app.use(express.static(join(__dirname, 'public')));
app.get('/app/*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(serverPort, serverIP, () => console.log(`App is listening on http://${serverIP}:${serverPort}`));
