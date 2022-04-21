const mysql = require("mysql2");

// connect to database
const db = mysql.createConnection(
    {
        host: "localhost",
        // your SQL username,
        user: "root",

        // your SQL password
        password: "Bananabread27",

        database: "election"
    },
    console.log("Connected to the election database.")
);

module.exports = db;