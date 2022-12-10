const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) return console.error(err.message);
});

db.run("CREATE TABLE IF NOT EXISTS notes (title, creation_date, content)");
db.run("CREATE TABLE IF NOT EXISTS whitelist (username, password, contact)");

module.exports = { db };