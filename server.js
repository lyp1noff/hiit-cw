const express = require('express');

const app = express();

// app.get('/', (req, res) => {
//   res.send('Successful response.');
// });

app.use(express.static("public"))

app.listen(8080, () => console.log('App is listening on port 8080.'));