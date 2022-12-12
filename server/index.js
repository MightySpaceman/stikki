  const { db } = require("./database");
  const express = require('express');
  const fs = require('fs');
  const app = express();
  const bodyParser = require('body-parser');

  // config
  const config = require('./serverConfig.json');

  // files whitelist?
  app.use('/style.css', express.static('webapp/style.css'));
  app.use('/webapp.js', express.static('webapp/webapp.js'));
  app.use('/logo.png', express.static('webapp/logo.png'));
  app.use('/favicon.png', express.static('webapp/favicon.png'));

  // middleware thing idk I found this on stackoverflow (and yeah I admit it)
  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  function logFile(data) {
    fs.appendFileSync("./events.log", `${Date()}: ${data}\n`);
  }

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
          // rows are send in reverse order so that upon loading on the frontend page they are ordered most recent first to least recent last
          rows.reverse();
          res.json(rows);
      }
  });
  }); 


  app.post('/', (req, res) => {
    db.all(`SELECT password FROM whitelist WHERE username = ?`, [req.body.username], (err, rows) => {
      if (err) {
        throw err;
      }
  
      try {
        if (rows.length > 0 && req.body.password == rows[0].password) {
          res.sendFile('./webapp/index.html', { root: __dirname });
          console.log(`Succesful login from ${req.ip}`);
          logFile(`Succesful login from ${req.ip} by user ${req.body.username}`);
        }
        else {
          res.send("<h1>Access.denied</h1>");
          console.log(`Unsuccesful login from ${req.ip} - username supplied: ${req.body.username} password: ${req.body.password}`);
          logFile(`Unsuccesful login from ${req.ip} - username supplied: ${req.body.username} password: ${req.body.password}`);
        }
      }
      catch (err) {
        res.send("<h1>Error 500</h1><h2>Internal server error</h2>");
        console.log(err);
        logFile(`Error encountered: \n${err}`);
      }
  
    });
  });

  app.post('/dashboard', (req, res) => {
    req.body.title == "" ? req.body.title = "[No Title]" : req.body.title = req.body.title;
    req.body.content == "" ? req.body.content = "[No Content]" : req.body.content = req.body.content;

      try {
        db.run(`INSERT INTO notes(title, creation_date, content) VALUES (?, ?, ?)` , [req.body.title, Date(), req.body.content]);
        res.sendFile('./webapp/index.html', { root: __dirname });
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