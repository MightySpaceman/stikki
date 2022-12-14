  const { db } = require("./database");
  const express = require('express');
  const app = express();
  const fs = require('fs');
  const bodyParser = require('body-parser');

  // import config file for parsing later
  const config = require('./serverConfig.json');

  // files whitelist?
  app.use('/style.css', express.static('webapp/style.css'));
  app.use('/webapp.js', express.static('webapp/webapp.js'));
  app.use('/cookies.js', express.static('webapp/cookies.js'));
  app.use('/logo.png', express.static('webapp/logo.png'));
  app.use('/favicon.png', express.static('webapp/favicon.png'));

  // middleware thing idk I found this on stackoverflow (and yeah I admit it)
  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  // function to simplify the use of logging to the events.log file.
  function logFile(data) {
    fs.appendFileSync("./events.log", `${Date()}: ${data}\n`);
  }

  // accessing the root URL will bring you to the login page if authentication is turned on, and straight to the main page if not.
  app.get('/', (req, res) => {
    if (config.usePassword == true) {
      res.sendFile("./webapp/login.html", { root: __dirname });
    }
    else {
      res.sendFile("./webapp/index.html", { root: __dirname });
      app.use('/', express.static('webapp'));
    }
  });


  // list is to return a list of notes
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

    // search for username provided by login form in the database
    db.all(`SELECT password FROM whitelist WHERE username = ?`, [req.body.username], (err, rows) => {
      if (err) {
        throw err;
      }
  
      // if the username exists, and the password value of such is correct, pass the if statement
      try {
        if (rows.length > 0 && req.body.password == rows[0].password) {
          // send the index page and log the succesful request
          res.sendFile('./webapp/index.html', { root: __dirname });
          console.log(`Succesful login from ${req.ip}`);
          logFile(`Succesful login from ${req.ip} by user ${req.body.username}`);
        }
        else {
          // otherwise, access denied!
          res.send("<h1>Access.denied</h1>");
          console.log(`Unsuccesful login from ${req.ip} - username supplied: ${req.body.username} password: ${req.body.password}`);
          logFile(`Unsuccesful login from ${req.ip} - username supplied: ${req.body.username} password: ${req.body.password}`);
        }
      }

      // log database query error
      catch (err) {
        res.send("<h1>Error 500</h1><h2>Internal server error</h2>");
        console.log(err);
        logFile(`Error encountered: \n${err}`);
      }
  
    });
  });

  app.post('/dashboard', (req, res) => {
    // check if fields are empty, and if so replace with [no content]
    req.body.title == "" ? req.body.title = "[No Title]" : req.body.title = req.body.title;
    req.body.content == "" ? req.body.content = "[No Content]" : req.body.content = req.body.content;

    // select username provided by cookies from the hidden form input
    db.all(`SELECT password FROM whitelist WHERE username = ?`, [req.body.username], (err, rows) => {
      if (err) {
        throw err;
      }
      
      try {

        // if the username record exists, and the password value is correct, pass the if statement
        if (rows.length > 0 && req.body.password == rows[0].password) {
          try {
            // insert the note into the database (using parameterized values, of course)
            db.run(`INSERT INTO notes(title, creation_date, content) VALUES (?, ?, ?)` , [req.body.title, Date(), req.body.content]);
            res.sendFile('./webapp/index.html', { root: __dirname });
          }
          // log the error and show 500 page
          catch (err) {
            console.log(err);
            res.sendFile('./webapp/500.html', { root: __dirname });
          }
        }
        else {
          // if it's false, the problem is not with the user and probably the cookies. that is, unless they're someone trying to gain access by submitting an external post request without a password :)
          res.send("<h1>Access.denied - password cookie is wrong, try clearing them.</h1>");
          console.log(`Unsuccesful post from ${req.ip} - username supplied: ${req.body.username} password: ${req.body.password}`);
          logFile(`Unsuccesful post from ${req.ip} - username supplied: ${req.body.username} password: ${req.body.password}`);
        }
      }

      // catch an error if database query fails
      catch (err) {
        res.send("<h1>Error 500</h1><h2>Internal server error</h2>");
        console.log(err);
        logFile(`Error encountered: \n${err}`);
      }
    });
  });
  

  // Begin listening on config port
  app.listen(config.port, () => {
    console.log(`Serving at http://localhost:${config.port}`);
  });