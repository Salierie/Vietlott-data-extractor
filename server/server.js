const express = require('express');
const path = require('path')
const app = express();
const port = 3000;

app.use('/', express.static(path.join(__dirname + '')));

app.get('/api', (req, res) => {
    res.join(`HTTP GET request received`)
})

app.listen(port, () => {
  console.log(`App listening  on port ${port}`);
})

app.use(function(req, res) {
    res.status(400);
    return res.send(`<h1>404 Error: Resource not found<h1/>`);
  });