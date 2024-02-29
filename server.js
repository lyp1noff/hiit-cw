const express = require('express');
const path = require('path');

const app = express();

const validRoutes = ['/', '/home', '/workouts', '/settings'];

app.use(express.static(path.join(__dirname, 'public')));
app.get(validRoutes, (req, res) => {
    const requestedRoute = req.url;
    if (validRoutes.includes(requestedRoute)) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(8080, () => console.log('App is listening on http://localhost:8080.'));