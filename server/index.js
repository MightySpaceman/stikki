const { db } = require("./database");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const config = require('./serverConfig.json');

// middleware thing idk I found this on stackoverflow (and yeah I admit it)
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  // redirect to the html index if the URL is accessed without a path. Access from the CLI and possibly the mobile app will have a specific URL they go to to get 
  // tailored data.

  if (config.usePassword == true) {
    res.sendFile("webapp/login.html", { root: __dirname });
  }
  else {
    res.sendFile("webapp/index.html", { root: __dirname });
  }
});

app.get('/list', (req, res) => {
    db.all(`SELECT * FROM notes`, (err, rows) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(rows);
    }
});
}); 

app.get('/login', (req, res) => {
  res.sendFile('webapp/login.html');
});

app.post('/new', (req, res) => {
    try {
      db.run(`INSERT INTO notes(title, creation_date, content) VALUES ("${req.body.title}", "${Date()}", "${req.body.content}")`);
      res.redirect('back');
    }
    catch (err) {
      console.log(err);
      res.redirect("500.html");
    }
});

app.post('/login', (req, res) => {
  if (req.body.password == config.password) {
    console.log(`Succesful login from ${req.ip}`);
    res.sendFile('webapp/index.html', { root: __dirname });
  }
  else {
    res.send("<h1>Access.denied</h1>");
  }
});

 // Listen idk
app.listen(config.port, () => {
  console.log(`Serving at http://localhost:${config.port}`);
});