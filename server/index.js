const { input } = require("./io");
const { db } = require("./database");



db.run('INSERT INTO users(id, name, age) VALUES (5, "me", 35)')

db.close();
