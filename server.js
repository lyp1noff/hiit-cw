const express = require('express');
const path = require('path');

const app = express();

// app.get('/', (req, res) => {
//   res.send('Successful response.');
// });

app.use(express.static(path.join(__dirname, 'public')));

app.listen(8080, () => console.log('App is listening on http://localhost:8080.'));