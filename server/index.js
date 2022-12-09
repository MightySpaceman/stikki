const { db } = require("./database");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use('/style.css', express.static('webapp/style.css'));
app.use('/webapp.js', express.static('webapp/webapp.js'));
const config = require('./serverConfig.json');

// middleware thing idk I found this on stackoverflow (and yeah I admit it)
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  // redirect to the html index if the URL is accessed without a path. Access from the CLI and possibly the mobile app will have a specific URL they go to to get 
  // tailored data.


  if (config.usePassword == true) {
    res.sendFile("./webapp/login.html", { root: __dirname });
  }
  else {
    res.sendFile("./webapp/index.html", { root: __dirname });
    app.use('/', express.static('webapp'));
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


app.post('/', (req, res) => {
  try {
    if (req.body.password == "helloworld" && req.body.username == "kerbal") {
      console.log(`Succesful login from ${req.ip}`);
      res.sendFile('./webapp/index.html', { root: __dirname });
    }
    else {
      console.log(`Unsuccesful login from ${req.ip}`);
      res.send("<h1>Access.denied</h1>");
    }
  }
  catch (err) {
    res.send("<h1>Error 500</h1><h2>Internal server error</h2>")
  }
});

app.post('/new', (req, res) => {
    try {
      db.run(`INSERT INTO notes(title, creation_date, content) VALUES ("${req.body.title}", "${Date()}", "${req.body.content}")`);
      res.redirect('back');
    }
    catch (err) {
      console.log(err);
      res.sendFile('./webapp/500.html', { root: __dirname });
    }
});

 // Listen idk
app.listen(config.port, () => {
  console.log(`Serving at http://localhost:${config.port}`);
});