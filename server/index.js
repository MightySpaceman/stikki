const { db } = require("./database");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(express.static('webapp'));

const port = 8000;

// middleware thing idk I found this on stackoverflow (and yeah I admit it)
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/list', (req, res) => {
    db.all(`SELECT * FROM notes`, (err, rows) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(rows);
    }
});
}); 

app.post('/new', (req, res) => {
    db.run(`INSERT INTO notes(title, creation_date, content) VALUES ("${req.body.title}", "${Date()}", "${req.body.content}")`);
    res.redirect('back');
});

app.get('/', (req, res) => {
    // redirect to the html index if the URL is accessed without a path. Access from the CLI and possibly the mobile app will have a specific URL they go to to get 
    // tailored data.
    res.redirect('webapp/index.html');
});

 // Listen idk
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});